class Turnover{
    constructor(id_turnover){
        this.work = false;
        this.w_e = 0; // электрическая энергия
        this.obr = 0; // обороты
        this.p_start = 2; // стартовое давление стартует при 70000 ПА
        this.broken = false; // сломан или нет
        this.v_down = 200; // скорость снижения оборотов при потере момента
        this.g_max = 0; // сколько может в конкретный момент пройти, если есть чему
        this.g_max_teor = 3000;  // максимальный расход через турбину
        this.direction = 0;
        this.id_turnover = id_turnover;
        this.steam_direction = 1; // направление пара 1- турбина 2 - пусковой отсек
        this.time = 0;
    }

    turn_on_or_down(){
        this.work = !this.work;
        ui_power(`APP_${this.id_turnover}_s`, this.work);
        turn(`${this.id_turnover}_t_btn`, this.work);
        if (!this.work){
            re.az.temporary_alert.push(new TemporaryAlert(`turn_down_${this.id_turnover}`, 1))
        }
    }

    set_g_max(){
            if (0 <= this.g_max + this.direction * 200 && this.g_max + this.direction * 200 <= this.g_max_teor){
                this.g_max += this.direction * 200;
            } else {
                this.direction = 0;
            }
    }

    set_unset_up_direction() {
        if (this.work){
            if (this.direction == 1){
                this.direction = 0;
            } else {
                this.direction = 1;
            }
        }
    }

    break_t(){
        this.broken = true;
        this.work = false;
        this.g_max = 0;
        this.direction = false;
    }

    set_unset_down_direction() {
        if (this.work){
            if (this.direction == -1){
                this.direction = 0;
            } else {
                this.direction = -1;
            }
        }
    }

    start(){
        if(this.p_start >= 6 && !this.broken){
        this.obr = 350;
        this.p_start = 2;
        }
    }


    set_steam_direction(){
        if (this.steam_direction == 1){
            this.steam_direction = 0;
            set_direction_ui(0, `${this.id_turnover}_direction_steam`);
        } else {
            this.steam_direction = 1;
            set_direction_ui(1, `${this.id_turnover}_direction_steam`);
        }
    }

    update_p_start(g_c, p_in_reactor){
        let v = (g_c / 12000) * 20000;
        if (this.p_start < p_in_reactor){
            if (this.p_start + v <= p_in_reactor ){
                this.p_start += v;
            } else if (this.p_start + v >= p_in_reactor && p_in_reactor >= 6){
                this.p_start = p_in_reactor;
            }
        }
    }

    update(g_re, p_in_reactor){
        var current_g = Math.min(g_re, this.g_max);
        if (!this.steam_direction){
            this.update_p_start(current_g, p_in_reactor);
            current_g = 0;
        }
        if (!this.work && this.obr > 0){
            if (this.time < 10){
                this.time += 1;
                return;
            }else {
                if (this.obr - this.v_down >= 0){
                    this.obr -= this.v_down;
                } else {
                    this.obr = 0;
                }
            }
        } else if (this.work && this.obr >= 3000){
            if (current_g >= 272.41){
                this.w_e = (current_g - 272.41) / 4.71;
            } else{
                re.az.temporary_alert.push(new TemporaryAlert(`m_down_${this.id_turnover}`, 1));
                this.w_e = 0;
                this.obr -= this.v_down;
            }
        } else {
            this.w_e = 0;
            if (this.obr != 0 && current_g >= 1000 && this.obr + current_g / 20 <= 3000 ){
                this.obr += current_g / 20;
                if (current_g / 20 >= 75){
                    this.break_t();
                }
            } else if (this.obr != 0 && current_g >= 1000){
                this.obr = 3000;
            } else{
                if (this.obr - this.v_down >= 0){
                    this.obr -= this.v_down;
                } else {
                    this.obr = 0;
                }
            }
        }
    }
}


class DTurnover extends Turnover{
    turn_on_or_down(){
        socket.emit("method_send", {"room": room_id, "function": "turn_on_or_down_turnover", "id_t": this.id_turnover});
    }

    start(){
        socket.emit("method_send", {"room": room_id, "function": "start_turnover", "id_t": this.id_turnover});
    }

    set_unset_down_direction() {
        socket.emit("method_send", {"room": room_id, "function": "set_unset_down_direction_turnover", "id_t": this.id_turnover});
    }

    set_unset_up_direction() {
        socket.emit("method_send", {"room": room_id, "function": "set_unset_up_direction_turnover", "id_t": this.id_turnover});
    }

    set_steam_direction(){
        socket.emit("method_send", {"room": room_id, "function": "set_steam_direction_turnover", "id_t": this.id_turnover});
    }
}