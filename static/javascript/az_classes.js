class Az{
    constructor(reactor){
        this.az_run = false;
        this.az_5 = 0;
        this.az_1 = 0;
        this.az_2 = 0;
        this.az_b = 0;
        this.lar = false;
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
        if (this.reactor.w_q > 3200){
            my_alert("alert_power_q");
        }
        if (this.reactor.t1.obr > 3000){
             my_alert("alert_high_turnovers1");
        }
        if ( this.reactor.t2.obr > 3000){
            my_alert("alert_high_turnovers2");
        }
        if (this.reactor.t1.w_e > 500){
            my_alert("alert_high_e_power_t1");
        }
        if (this.reactor.t2.w_e > 500){
            my_alert("alert_high_e_power_t2");
        }
        if (this.reactor.t1.broken){
            my_alert("error_t1");
        }
        if (this.reactor.t2.broken){
            my_alert("error_t2");
        }
        if (this.reactor.T_2_H2O >= 260){
            my_alert("alert_high_temperature2");
        }
        if (this.reactor.T_2_H2O >= 265){
            my_alert("alert_high_temperatureBS");
        }
        if(this.az_5){
            my_alert("alert_az_5");
        }
         if(this.az_b){
            my_alert("alert_baz");
        }
        if(this.az_1){
            my_alert("alert_az_1");
        }
        if(this.az_2){
            my_alert("alert_az_2");
        }
        var k = Object.keys(this.reactor.gcn);
        for (i = 0; i < k.length; i++){
            if  (this.reactor.gcn[k[i]].broken){
                my_alert(`${k[i]}_error`);
            };
        }
        if (this.reactor.v_inBS < 33){
            my_alert("h_lower_water_level_BS");
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

}