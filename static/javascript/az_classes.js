class TemporaryAlert{
    constructor(id_, type){
        this.id = id_;
        this.time = 0;
        this.max_time = 4;
        this.type = type; // 1 - 2 - 3 - характеризует кому из операторов реагировать
    }

    show(){
        my_alert(this.id);
    }

    delete_show(){
        stop_alert(this.id);
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
        this.ar_k = [[3, 4], [4, 3], [4, 5], [5, 4]]; // координаты стержней ЛАР
        this.laz = [[2,2], [2,4], [2, 6], [4, 2], [4, 6], [6, 2], [6, 4], [6, 6]]; // координаты стрежней ЛАЗ
        this.baz_k = [[1, 4], [3, 3], [3, 5], [4, 1], [4, 7], [5, 3], [5, 5], [7, 4]];
        this.reactor = reactor;
        this.power_ar = 0
        this.current_errors = [];
        this.temporary_alert = [];
    }

    turn_on_or_down_ar(){
        this.ar = !this.ar;
        ui_power("lar_s", this.ar);
    }

    set_w_ar(w){
        this.power_ar = w * 1e6;
    }


    set_position_ar(direction){
        var flag = true;
        for (let i = 0; i < this.ar_k.length; i++) {
                if(direction < 0 && this.reactor.sterg[this.ar_k[i][0]][this.ar_k[i][1]] < 100){
                    if (this.reactor.sterg[this.ar_k[i][0]][this.ar_k[i][1]] + 5 <= 100){
                        this.reactor.sterg[this.ar_k[i][0]][this.ar_k[i][1]] += 5;
                        flag = false;
                    } else{
                        this.reactor.sterg[this.ar_k[i][0]][this.ar_k[i][1]] = 100;
                    }
                } else if (direction > 0 && this.reactor.sterg[this.ar_k[i][0]][this.ar_k[i][1]] > 0) {
                    flag = false;
                    this.reactor.sterg[this.ar_k[i][0]][this.ar_k[i][1]] -= 5;
                }
                show_mnemo_i_j(this.reactor.sterg[this.ar_k[i][0]][this.ar_k[i][1]], this.ar_k[i][0], this.ar_k[i][1]);
        }
        return flag;
    }

    update_ar(){
        if (this.ar){
            if (this.reactor.rho_total > 0.0005){
                this.set_position_ar(-1);
            } else if (this.reactor.thermal_power - 50 > this.power_ar){
                this.set_position_ar(-1);
            } else if (this.reactor.thermal_power + 50 < this.power_ar){
                this.set_position_ar(1);
            }
        }
    }

    set_position_az5(){
        var flag = true;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(this.reactor.sterg[i][j] < 100){
                    if (this.reactor.sterg[i][j] + 10 <= 100){
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
        for (let i = 0; i < this.baz_k.length; i++) {
                if(this.reactor.sterg[this.baz_k[i][0]][this.baz_k[i][1]] < 100){
                    if (this.reactor.sterg[this.baz_k[i][0]][this.baz_k[i][1]] + 25 <= 100){
                        this.reactor.sterg[this.baz_k[i][0]][this.baz_k[i][1]] += 25;
                        flag = false;
                    } else{
                        this.reactor.sterg[this.baz_k[i][0]][this.baz_k[i][1]] = 100;
                    }
                }
                show_mnemo_i_j(this.reactor.sterg[this.baz_k[i][0]][this.baz_k[i][1]], this.baz_k[i][0], this.baz_k[i][1]);
        }
        this.az_b = !flag;
        if (flag){
            turn("baz_btn", 0);
        }
        return flag;
    }

    az5(manual){
        if (manual || this.mode != 0){
            turn("az_btn", 1);
            this.az_run = 1;
            this.az_5 = true;
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
        } else {
            this.mode = 1;
            turn("azs_start", 1);
        }
    }

    azsr_start(){
        if (this.mode == 2){
            this.mode = 0;
            turn("azsr_start", 0);
        } else {
            this.mode = 2;
            turn("azsr_start", 1);
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
            }
            my_alert("alert_power_q");
            flag = true;
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
        console.log(this.temporary_alert);
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
        else if (!flag && this.sound){
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


    update(){
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
    az5(){
        socket.emit("method_send", {"room": room_id, "function": "az5"});
    }

    baz(){
        socket.emit("method_send", {"room": room_id, "function": "baz"});
    }

    set_w_lar(w){
        socket.emit("set_w_lar", {"w": w, "room": room_id});
    }
}