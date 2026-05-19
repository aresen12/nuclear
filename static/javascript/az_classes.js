class Az{
    constructor(reactor){
        this.sound = false;
        this.az_run = false; // работает ли АЗ
        this.az_5 = 0; // идентефикация работы конкретной аварийной защиты
        this.az_1 = 0;
        this.az_2 = 0;
        this.az_b = 0;
        this.lar = false;
        this.laz = [[2,2], [2,4], [2, 6], [4, 2], [4, 6], [6, 2], [6, 4], [6, 6]]; // координаты стрежней ЛАЗ
        this.baz_k = [[1, 4], [3, 3], [3, 5], [4, 1], [4, 7], [5, 3], [5, 5], [7, 4]];
        this.reactor = reactor;
    }

    turn_on_or_down_lar(){
        this.lar = !this.lar;
        ui_power("lar_s", this.lar);
    }

    set_position_az5(){
        var flag = true;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(this.reactor.sterg[i][j] < 100){
                    if (this.reactor.sterg[i][j] + 20 <= 100){
                        this.reactor.sterg[i][j] += 20;
                        flag = false;
                    } else{
                        this.reactor.sterg[i][j] = 100;
                    }
                }
                show_mnemo_i_j(this.reactor.sterg[i][j], i, j);
            }
        }
        this.az_5 = !flag;
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
        return flag;
    }

    az5(){
        this.az_run = 1;
        this.az_5 = true;
    }

    baz(){
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

    check_error_alerts(){
        let flag = false;
        if (this.reactor.thermal_power / 1e6 > 3200){
//            if (this.reactor.thermal_power / 1e6 >= 3500){
//                this.az5();
//            }
            my_alert("alert_power_q");
            flag = true;
        }
        if (this.reactor.t1.obr > 3000){
             my_alert("alert_high_turnovers1");
             flag = true;
        }
        if ( this.reactor.t2.obr > 3000){
            my_alert("alert_high_turnovers2");
            flag = true;
        }
        if (this.reactor.t1.w_e > 500){
            my_alert("alert_high_e_power_t1");
            flag = true;
        }
        if (this.reactor.t2.w_e > 500){
            my_alert("alert_high_e_power_t2");
            flag = true;
        }
        if (this.reactor.t1.broken){
            my_alert("error_t1");
            flag = true;
        }
        if (this.reactor.t2.broken){
            my_alert("error_t2");
            flag = true;
        }
        if (this.reactor.T_2_H2O >= 260){
            my_alert("alert_high_temperature2");
            flag = true;
        }
        if (this.reactor.bs1.T_H2O > 271){
            my_alert("alert_high_temperatureBS1");
            flag = true;
        }
        if (this.reactor.bs2.T_H2O > 271){
            my_alert("alert_high_temperatureBS2");
            flag = true;
        }
        if (this.reactor.bs1.v_inBS >= 100){
            my_alert("h_high_water_level_BS1");
            flag = true;
        }
        if (this.reactor.bs2.v_inBS >= 100){
            my_alert("h_high_water_level_BS2");
            flag = true;
        }
        if(this.az_5){
            my_alert("alert_az_5");
            flag = true;
        }
         if(this.az_b){
            my_alert("alert_baz");
            flag = true;
        }
        if(this.az_1){
            my_alert("alert_az_1");
            flag = true;
        }
        if(this.az_2){
            my_alert("alert_az_2");
            flag = true;
        }
        var k = Object.keys(this.reactor.gcn);
        for (i = 0; i < k.length; i++){
            if  (this.reactor.gcn[k[i]].broken){
                my_alert(`${k[i]}_error`);
                flag = true;
            };
        }
        if (this.reactor.bs1.v_inBS < 66){
            my_alert("h_lower_water_level_BS1");
            flag = true;
        }
        if (this.reactor.bs2.v_inBS < 66){
            my_alert("h_lower_water_level_BS2");
            flag = true;
        }
        if (this.reactor.rho_total > 0.003){
            my_alert("high_rho_total");
            flag = true;
        }

        if (flag && !this.sound){
                this.sound = true;
                playAudio();

        }
        else if (!flag && this.sound){
            this.sound = false;
            document.getElementById("play").pause();
        }
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
}