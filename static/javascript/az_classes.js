// Координаты стержней ЛАЗ, БАЗ, УСП
const AR_K = [[3, 4], [4, 3], [4, 5], [5, 4]]; // координаты стержней ЛАР
const LAZ_K = [[2,2], [2,4], [2, 6], [4, 2], [4, 6], [6, 2], [6, 4], [6, 6]]; // координаты стрежней ЛАЗ
const BAZ_K = [[1, 4], [3, 3], [3, 5], [4, 1], [4, 7], [5, 3], [5, 5], [7, 4]];
const YSP_K = [[1, 3], [1, 5], [3, 1], [3, 7], [5, 1], [5, 7], [7, 3], [7, 5]];


class TemporaryAlert{
    constructor(id_, type, does_stop){
        this.id = id_;
        this.time = 0;
        this.max_time = 10;
        this.does_stop = does_stop;
        this.type = type; // 1 - 2 - 3 - характеризует кому из операторов реагировать
    }

    show(){
        my_alert(this.id);
    }

    delete_show(){
        console.log(this.max_time % 2 == 0, this.does_stop);
        if (this.does_stop){
             if (this.max_time % 2 != 0){
                my_alert(this.id);
            }
            return;
        } else {
            stop_alert(this.id);
        }

    }

    update(){
        this.time += 1;
        if (this.time >= this.max_time){
            this.delete_show();
            return true;
        }
        this.show();
        return false;
    }
}


class SAOR {
    constructor(){
        this.q_current = 0;
        this.v_total = 40.8;
        this.v_w0 = 36;
        this.p1 = 90;
        this.work = false;
        this.time = 0;
    }

    update(){
        if (this.work){

        }
    }

    p_g(t){


    }

}

class Az{
    constructor(reactor){
        this.mode = 0 // 0 - откл 1- азс 2 -азср
        this.sound = false;
        this.az_run = false; // работает ли АЗ
        this.az_5 = 0; // идентефикация работы конкретной аварийной защиты
        this.az_1 = 0;
        this.az_2 = 0;
        this.az_b = 0;
        this.ar = false;
        this.reactor = reactor;
        this.power_ar = 0
        this.current_errors = [];
        this.temporary_alert = [];
        this.period_power = 0;
        this.last_power = this.reactor.thermal_power;
        this.ozr_ar = 0;
        this.time_stop_az = 0;
        this.power_SYZ = true;
    }

    turn_on_or_down_ar(){
        this.ar = !this.ar;
        ui_power("lar_s", this.ar);
        if (!this.ar){
           this.temporary_alert.push(new TemporaryAlert('ar_turn_down', 2))
        }
    }

    turn_on_or_down_power_SYZ(){
        this.power_SYZ = !this.power_SYZ;
        if (this.power_SYZ){
            turn("key_power_btn", 0);
            if (this.ar){
                this.turn_on_or_down_ar();
            }
        } else {
            turn("key_power_btn", 1);
        }

    }

    set_w_ar(w){
        this.power_ar = w * 1e6;
    }


    set_position_ar(direction, speed){
        if (!this.power_SYZ && direction == 0){
            return;
        }
        this.ozr_ar = 0;
        for (let i = 0; i < AR_K.length; i++) {
            if (direction < 0){
                if (this.reactor.sterg[AR_K[i][0]][AR_K[i][1]] + speed <= 100){
                    this.reactor.sterg[AR_K[i][0]][AR_K[i][1]] += speed;
                } else{
                    this.reactor.sterg[AR_K[i][0]][AR_K[i][1]] = 100;
                }
            } else {
                if (this.reactor.sterg[AR_K[i][0]][AR_K[i][1]] - speed > 0) {
                    this.reactor.sterg[AR_K[i][0]][AR_K[i][1]] -= speed;
                } else {
                    this.reactor.sterg[AR_K[i][0]][AR_K[i][1]] = 0;
                }
            }
            this.ozr_ar += this.reactor.sterg[AR_K[i][0]][AR_K[i][1]];
            show_mnemo_i_j(this.reactor.sterg[AR_K[i][0]][AR_K[i][1]], AR_K[i][0], AR_K[i][1]);
        }
        this.ozr_ar /= 4;
    }

    set_position_laz(coord, direction, speed){
        if (coord == -1 | !this.power_SYZ){
            return;
        }
        show_mnemo(this.reactor);
        if (this.reactor.sterg[LAZ_K[coord][0]][LAZ_K[coord][1]] + direction * speed >= 0 & this.reactor.sterg[LAZ_K[coord][0]][LAZ_K[coord][1]] + direction * speed <= 100){
            this.reactor.sterg[LAZ_K[coord][0]][LAZ_K[coord][1]] += direction * speed;
            if (direction > 0){
                my_alert(`alert_az`);
            }
        }
    }

    update_laz(){
        let power_sek = this.power_ar / 7.6;
        let sek = calculate_power_sek(this.reactor.sterg);
        let s = 0;
        for (let i = 0; i < sek.length; i++) {
            for (let j = 0; j < sek[i].length; j++) {
                if ((i == 0 | i == 2) & (j == 0 | j == 2)){
                    s += sek[i][j] * (4 / 3);
                } else{
                    s += sek[i][j];
                }
            }
        }
        s /= 9;
        let color_mnemo = [];
        for (let i = 0; i < sek.length; i++) {
            for (let j = 0; j < sek[i].length; j++) {
                if ((i == 0 | i == 2) & (j == 0 | j == 2)){
                    if (sek[i][j] * 0.9 > s * (2 / 3)){
                        this.set_position_laz(get_s_number(i, j), -1, 2);
                        color_mnemo.push(2);
                    } else if (sek[i][j] < s * (2 / 3)) {
                        this.set_position_laz(get_s_number(i, j), 1, 2);
                        color_mnemo.push(1);
                    }
                } else{
                    if (sek[i][j] * 0.9 > s){
                        this.set_position_laz(get_s_number(i, j), -1, 2);
                        color_mnemo.push(2);
                    } else if (sek[i][j] < s) {
                        this.set_position_laz(get_s_number(i, j), 1, 2);
                        color_mnemo.push(1);
                    }
                }
            }
        }
    ui_thermal_power_mnemo(color_mnemo);
    }

    update_ar(){
        if (this.ar){
            if (this.reactor.rho_total > 0.0005){
                this.set_position_ar(-1, calculate_speed_ar_rho(this.reactor.rho_total));
            } else if (this.period_power > 7 && this.reactor.rho_total > 0) {
                this.set_position_ar(-1, calculate_speed_ar_power_speed(this.period_power));
            } else if (this.reactor.thermal_power > this.power_ar && this.period_power > 0){
                let r = (this.reactor.thermal_power - this.power_ar) / 1e6;
                console.log(r, calculate_speed_ar_power(r));
                this.set_position_ar(-1, calculate_speed_ar_power(r));
            } else if (this.reactor.thermal_power < this.power_ar && this.period_power < 0){
                let r =(this.power_ar - this.reactor.thermal_power) / 1e6;
                this.set_position_ar(1  , calculate_speed_ar_power(r));
            }
            this.update_laz();
        }

    }

    set_position_power(){
        var flag = true;
        var k = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (YSP_K[k][0] == i && YSP_K[k][1] == j){
                    if (k + 1 < YSP_K.length){
                        k++;
                    }
                    continue;
                }
                if(this.reactor.sterg[i][j] < 100){
                    if (this.reactor.sterg[i][j] + 2 <= 100 && this.reactor.sterg[i][j] >= 0){
                        this.reactor.sterg[i][j] += 2;
                        flag = false;
                    } else{
                        this.reactor.sterg[i][j] = 100;
                    }
                }
                show_mnemo_i_j(this.reactor.sterg[i][j], i, j);
            }
        }
        return flag;
    }

    set_position_az5(){
        var flag = true;
        if (!this.power_SYZ){
            return;
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.reactor.sterg[i][j] == -1){
                    continue;
                }
                if(this.reactor.sterg[i][j] < 100){
                    if (this.reactor.sterg[i][j] + 10 <= 100 && this.reactor.sterg[i][j] >= 0){
                        this.reactor.sterg[i][j] += 10;
                        flag = false;
                    } else{
                        this.reactor.sterg[i][j] = 100;
                    }
                }
                show_mnemo_i_j(this.reactor.sterg[i][j], i, j);
            }
        }
        this.az_5 = !flag;
        if (flag){
            turn("az_btn", 0);
        }
        return flag;
    }

    set_position_baz(){
        var flag = true;
        for (let i = 0; i < BAZ_K.length; i++) {
                if(this.reactor.sterg[BAZ_K[i][0]][BAZ_K[i][1]] < 100){
                    if (this.reactor.sterg[BAZ_K[i][0]][BAZ_K[i][1]] + 25 <= 100){
                        this.reactor.sterg[BAZ_K[i][0]][BAZ_K[i][1]] += 25;
                        flag = false;
                    } else{
                        this.reactor.sterg[BAZ_K[i][0]][BAZ_K[i][1]] = 100;
                    }
                }
                show_mnemo_i_j(this.reactor.sterg[BAZ_K[i][0]][BAZ_K[i][1]], BAZ_K[i][0], BAZ_K[i][1]);
        }
        this.az_b = !flag;
        if (flag){
            turn("baz_btn", 0);
        }
        return flag;
    }

    az5(manual){
        if (manual || this.mode != 0){
            red_alert("az_call");
            if (!manual){
                setTimeout(() => {
                 this.az_5 = true;
            }, 2000);
            } else {
                this.az_5 = true;
            }
            turn("az_btn", 1);
            this.az_run = 1;

        }

    }

    baz(){
        turn("baz_btn", 1);
        this.az_run = true;
        this.az_b = true;
    }

    check_az_work(){
        if (this.az_5 || this.az_1 || this.az_2 || this.az_b){
            this.az_run = true;
        } else{
            this.az_run = false;
        }
    }


    azs_start(){
        if (this.mode == 1){
            this.mode = 0;
            turn("azs_start", 0);
            stop_alert("azs_on");
            this.temporary_alert.push(new TemporaryAlert('azs_turn_down', 2))
        } else {
            this.mode = 1;
            turn("azs_start", 1);
            turn("azsr_start", 0);
            green_alert("azs_on")
            stop_alert("azsr_on");
        }
    }

    azsr_start(){
        if (this.mode == 2){
            this.mode = 0;
            turn("azsr_start", 0);
            stop_alert("azsr_on");
            this.temporary_alert.push(new TemporaryAlert('azsr_turn_down', 2))
        } else {
            this.mode = 2;
            turn("azsr_start", 1);
            turn("azs_start", 0);
            stop_alert("azs_on");
            green_alert("azsr_on");
        }
    }

    check_azs(){
        this.period_power = (this.reactor.thermal_power - this.last_power) / 1e6;
        this.last_power = this.reactor.thermal_power;

        if (this.period_power > 10 && this.mode == 1){
            my_alert("high_speed_power");
            this.current_errors.push("high_speed_power");
            if (!this.sound){
                this.sound = true;
                playAudio();
            }
            if (this.period_power > 15){
                this.az5();
                this.azs_start();
            }
            if (this.thermal_power > 700){
                this.azs_start();
            }
        }

    }

    check_error_alerts(){
        let flag = false;
        let c_e = [];
        if (this.reactor.thermal_power / 1e6 > 3200){
            c_e.push("alert_power_q");
            if (this.reactor.thermal_power / 1e6 >= 3250){
                this.az5();
            }
            if(this.reactor.thermal_power / 1e6 > 3300){
                alert("Вы взорвали реактор!");
                this.reactor.pause = true;
            }
            my_alert("alert_power_q");
            flag = true;
        }
        if (this.ozr_ar > 50 & this.period_power > 0){
             my_alert("m_ozr_ar");
             flag = true;
             c_e.push("m_ozr_ar");
        }
        if (this.reactor.ozr < 5.78){
             my_alert("m_ozr");
             flag = true;
             c_e.push("m_ozr");
        }
        if (this.reactor.t1.obr > 3000){
             my_alert("alert_high_turnovers1");
             flag = true;
             c_e.push("alert_high_turnovers1");
        }
        if ( this.reactor.t2.obr > 3000){
            my_alert("alert_high_turnovers2");
            flag = true;
            c_e.push("alert_high_turnovers2");
        }
        if (this.reactor.t1.w_e > 500){
            my_alert("alert_high_e_power_t1");
            c_e.push("alert_high_e_power_t1");
            flag = true;
        }
        if (this.reactor.t2.w_e > 500){
            my_alert("alert_high_e_power_t2");
            flag = true;
            c_e.push("alert_high_e_power_t2");
        }
        if (this.reactor.t1.broken){
            my_alert("error_t1");
            flag = true;
            c_e.push("error_t1");
        }
        if (this.reactor.t2.broken){
            my_alert("error_t2");
            flag = true;
            c_e.push("error_t2");
        }
        if (this.reactor.T_2_H2O >= 260){
            my_alert("alert_high_temperature2");
            flag = true;
            c_e.push("alert_high_temperature2");
        }
        if (this.reactor.bs1.T_H2O > 271){
            my_alert("alert_high_temperatureBS1");
            flag = true;
            c_e.push("alert_high_temperatureBS1");
        }
        if (this.reactor.bs2.T_H2O > 271){
            my_alert("alert_high_temperatureBS2");
            flag = true;
            c_e.push("alert_high_temperatureBS2");
        }
        if (this.reactor.bs1.v_inBS >= 70){
            if (this.reactor.bs1.v_inBS >= 74){
                c_e.push("level_down1");
                my_alert("level_down1");
                this.reactor.bs1.level_down();
            }
            my_alert("h_high_water_level_BS1");
            flag = true;
            c_e.push("h_high_water_level_BS1");
        }
        if (this.reactor.bs2.v_inBS >= 70){
            if (this.reactor.bs2.v_inBS >= 74){
                c_e.push("level_down2");
                my_alert("level_down2");
                this.reactor.bs2.level_down();
            }
            my_alert("h_high_water_level_BS2");
            flag = true;
            c_e.push("h_high_water_level_BS2");
        }
        if(this.az_5){
            my_alert("alert_az_5");
            flag = true;
            c_e.push("alert_az_5");
        }
         if(this.az_b){
            my_alert("alert_baz");
            flag = true;
            c_e.push("alert_baz");
        }
        if(this.az_1){
            my_alert("alert_az_1");
            flag = true;
            c_e.push("alert_az_1");
        }
        if(this.az_2){
            my_alert("alert_az_2");
            flag = true;
            c_e.push("alert_az_2");
        }
        if (this.temporary_alert.length > 0 && this.temporary_alert[this.temporary_alert.length - 1].time == 0 && !this.sound){
            this.sound = true;
            playAudio();
        }
        var k = Object.keys(this.reactor.gcn);
        for (i = 0; i < k.length; i++){
            if  (this.reactor.gcn[k[i]].broken){
                my_alert(`${k[i]}_error`);
                flag = true;
                c_e.push(`${k[i]}_error`);
            };
        }
        if (this.reactor.bs1.v_inBS < 66){
            my_alert("h_lower_water_level_BS1");
            flag = true;
            c_e.push("h_lower_water_level_BS1");
        }
        if (this.reactor.bs2.v_inBS < 66){
            my_alert("h_lower_water_level_BS2");
            flag = true;
            c_e.push("h_lower_water_level_BS2");
        }
        if (this.reactor.rho_total > 0.00055){
            my_alert("high_rho_total");
            flag = true;
            c_e.push("high_rho_total");
        }


        if (flag && !this.sound && this.current_errors.length < c_e.length){
                this.sound = true;
                playAudio();
        }
        else if (!flag && this.sound && this.temporary_alert.length == 0){
            this.sound = false;
            document.getElementById("play").pause();
        }
        for (let i = 0; i < this.current_errors.length; i++){
            if (!c_e.includes(this.current_errors[i])){
                stop_alert(this.current_errors[i]);
            }
        }
        this.current_errors = c_e;
    }

    stop_sound(){
        this.sound = false;
            document.getElementById("play").pause();
    }

    stop_az(){
        this.time_stop_az = 5;
    }

    update(){
        if (this.time_stop_az > 0){
            this.time_stop_az -= 1;
            this.az_run = false;
        }
        if (!this.power_SYZ){
            this.set_position_power();

        }
        if (this.az_run){
            if (this.az_5){
                this.set_position_az5();
            }
            if (this.az_b){
                this.set_position_baz();
            }
        }
        this.check_error_alerts();
        this.check_az_work();
        this.update_ar();
        this.check_azs();
        var c_index = [];
        for (let i = 0; i < this.temporary_alert.length; i++){
            if (this.temporary_alert[i].update()){
                c_index.push(i);
            }
        }
        for (let i = 0; i < c_index.length; i++){
            this.temporary_alert.splice(c_index[i], 1);
        }
        return this.az_run;
    }
}


class DAz extends Az{
    az5(manual){
        red_alert("az_call");
        socket.emit("method_send", {"room": room_id, "function": "az5", "manual": manual});
    }

    baz(){
        socket.emit("method_send", {"room": room_id, "function": "baz"});
    }

    set_w_ar(w){
        socket.emit("set_w_ar", {"w": w, "room": room_id});
    }

    turn_on_or_down_ar(){
        socket.emit("method_send", {"room": room_id, "function": "turn_on_or_down_ar"});
    }

    turn_on_or_down_power_SYZ(){
        socket.emit("method_send", {"room": room_id, "function": "turn_on_or_down_power_SYZ"});
    }

    stop_az(){
        socket.emit("method_send", {"room": room_id, "function": "stop_az"});
    }
}


function get_s_number(i, j){
    let res = get_sektor_number(i, j);
    if (res >= 4){
        if (res == 4){
            return -1;
        }
        return res - 1
    }
    return res;
}


function calculate_speed_ar_power(r){
    if (r < 3){
        return 0;
    }
    if (r > 50){
        return 5;
    } else if (r > 30){
        return 4;
    } else if (r > 25) {
        return 3;
    }
    return 2;
}


function calculate_speed_ar_rho(rho){
    if (rho > 0.001){
        return 5;
    } else if (rho > 0.0008){
        return 4;
    } else if (rho > 0.0007) {
        return 3;
    } else if (rho > 0.00055){
        return 2;
    }
    return 1;
}


function calculate_speed_ar_power_speed(speed){
    if (speed < 15){
        return 1;
    } else if (speed < 40){
        return 2;
    } else {
        return 3;
    }
}

function calculate_power_sek(sterg){
        let sek = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < sterg.length; i++) {
            let k = 1;
            if (i < 3){
                k = 0;
            }  else if (i > 5){
                k = 2;
            }
            for (let j = 0; j < sterg[i].length; j++) {
                if (sterg[i][j] == -1){
                    continue;
                }
                if (j < 3){
                    sek[k][0] += sterg[i][j];
                } else if (j > 5){
                    sek[k][2] += sterg[i][j];
                } else {
                    sek[k][1] += sterg[i][j];
                }
            }
        }
        return sek;
    }

function get_sektor_number(i, j){
    let x = Math.floor(i / 3);
    let y = Math.floor(j / 3);
    return x * 3 + y;
}

