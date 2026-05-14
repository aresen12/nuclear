class Turnover{
    constructor(id_turnover){
        this.work = false;
        this.w_e = 0;
        this.obr = 0;
        this.p_start = 700000;
        this.broken = false;
        this.v_down = 200;
        this.g_max = 0;
        this.g_max_teor = 3000;
        this.direction = 0;
        this.id_turnover = id_turnover;
    }

    turn_on_or_down(){
        this.work = !this.work;
        ui_power(`APP_${this.id_turnover}_s`, this.work)
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
        if(this.p_start >= 680000 && !this.broken){
        this.obr = 350;
        this.p_start = 20000;
        }
    }




    update(g_re){
//         if (this.direction != 0){
//            this.set_g_max();
//        } в  reactor update
        var current_g = Math.min(g_re, this.g_max);
//        if (g_re >= this.g_max){
//                current_g = this.g_max;
//        }
        if (!this.work && this.obr > 0){
            if (this.obr - this.v_down >= 0){
                this.obr -= this.v_down;
            } else {
                this.obr = 0;
            }

        } else if (this.work && this.obr >= 3000){

            if (current_g >= 272.41){
                this.w_e = (current_g - 272.41) / 4.71;
            } else{
                this.w_e = 0;
                this.obr -= this.v_down;
            }
        } else {
            this.w_e = 0;
//            console.log(current_g, "g", current_g / 20, this.obr!= 0, this.g_max >= 1000, this.g >= 1000, this.obr + current_g / 20 <= 3000  );
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
}