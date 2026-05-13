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
class Turnover{
    constructor(id_turnover){
        this.work = false;
        this.w_e = 0;
        this.obr = 0;
        this.p_start = 700000;
        this.broken = false;
        this.v_down = 200;
        this.g = 2000;
        this.g_max = 0;
        this.g_max_teor = 3000;
        this.direction = 0;
    }

    turn_on_or_down(){
        this.work = !this.work;

    }

    set_g_max(){
//        console.log( this.max_g + this.direcmax_gtion * 200, this.max_g + this.direction * 200 <= this.g_max_teor);
            if (0 <= this.g_max + this.direction * 200 && this.g_max + this.direction * 200 <= this.g_max_teor){
                this.g_max += this.direction * 200;
            } else {
                this.direction = 0;
            }
            console.log("g_max")
    }

    set_unset_up_direction() {
        if (this.work){
            if (this.direction == 1){
                this.direction = 0;
            } else {
                this.direction = 1;
            }
            console.log("set");
        }
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
        if(this.p_start >= 680000){
        this.obr = 350;
        this.p_start = 20000;
        }
    }


    update(){
         if (this.direction != 0){
            this.set_g_max();
        }
        if (!this.work && this.obr > 0){
            if (this.obr - this.v_down >= 0){
                this.obr -= this.v_down;
            } else {
                this.obr = 0;
            }

        } else if (this.work && this.obr > 2951){
            if (this.g < this.g_max){
                this.w_e = (this.g - 272.41) / 4.71;
            } else if (this.g_max >= 272.41){
                this.w_e = (this.g_max - 272.41) / 4.71;
            } else{
                this.w_e = 0;
            }
        } else {
            this.w_e = 0;
            if (this.obr!= 0 && this.g_max >= 1000 && this.g>= 1000 && this.obr + 50 <= 3000 ){
                this.obr += 50;
            }
        }
    }
}


class Pump{
    constructor(id_pump){
//    g max 8000
        this.g = 0;
        this.work = false;
        this.direction = 0;
        this.max_g = 8000;
        this.id_pump = id_pump;
        this.broken = false;
    }

    set_g(){
            if (0 <= this.g + this.direction * 400 && this.g + this.direction * 400 <= this.max_g){
                this.g += this.direction * 400;
            } else {
                this.direction = 0;
            }
    }

    turn_on_or_down(){
        if (this.work ){
            this.work = false;
            this.direction = -1;
            ui_power(`${this.id_pump}_s`, false);
        } else {
            this.work = true
            ui_power(`${this.id_pump}_s`, true);
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

    set_unset_down_direction() {
        if (this.work){
        if (this.direction == -1){
            this.direction = 0;
        } else {
            this.direction = -1;
        }
        }
    }

    update(){
        if (this.direction != 0){
            this.set_g();
        }
    }
}

class Rdg{
    constructor(id_rdg){
        this.work = false;
        this.power_e = 0;
        this.max_power_e = 10000; // KW
        this.direction = 0;
        this.id_rdg = id_rdg;
    }

    update(){
        if (this.direction != 0){
            if (0 <= this.power_e + this.direction * 1000  && this.power_e + this.direction * 1000 <= this.max_power_e){
                    this.power_e += this.direction * 1000;
                } else {
                    this.direction = 0;
                }
        }
    }

    turn_on_or_down(){
        if (this.work ){
            this.work = false;
            this.direction = -1;
            ui_power(`${this.id_rdg}_s`, false);
        } else {
            this.work = true
            this.direction = 1;
            ui_power(`${this.id_rdg}_s`, true);
        }
    }


}


class Reactor{
    constructor(){
        this.sterg = [];
        for (let i = 0; i < 9; i++) {
            this.sterg[i] = [];
            for (let j = 0; j < 9; j++) {
                this.sterg[i][j] = 100;
            }
        }
        this.lar = [[3, 4], [4, 3], [4, 5], [5, 4]];
        this.w_lar = 0;
        this.laz = [[2,2], [2,4], [2, 6], [4, 2], [4, 6], [6, 2], [6, 4], [6, 6]];
        this.kpd = 0.32;
        this.w_q = 3300;
        this.p_in_reactor = 700000;
        this.h_braban_s = 10;
        this.v_inBS = 33;
//        this.v_inAZ = ;
        this.reactivnost = 0;
        this.direction = 0; // -1 - down 1 - up
        this.chosen = []; // выбранные стержни
        this.gcn = {
            "1_n": new Pump("1_n"),
            "2_n": new Pump("2_n"),
            "3_n": new Pump("3_n"),
            "1_a": new Pump("1_a"),
            "2_a": new Pump("2_a"),
            "3_a": new Pump("3_a"),
        }
        this.rdg1 = new Rdg("rdg1");
        this.rdg2 = new Rdg("rdg2");
        this.t1 = new Turnover("t1");
        this.t2 = new Turnover("t2");
        this.T_reactor = 80;
        this.T_H2O = 80;
        this.T_2_H2O = 25;
        this.az = new Az(this);
    }

    set_unset_up_direction() {
        if (this.direction == 1){
            this.direction = 0;
        } else {
            this.direction = 1;
        }
    }

    set_unset_down_direction() {
        if (this.direction == -1){
            this.direction = 0;
        } else {
            this.direction = -1;
        }
    }

    set_w_lar(w){
        this.w_lar = w;
    }



    set_s_position(i, j, direction){
        if (direction == 1){
            if (this.sterg[i][j] - 5 >= 0){
                this.sterg[i][j] -= 5;
            }
        } else {
            if (this.sterg[i][j] + 5 <= 100){
                this.sterg[i][j] += 5;
            }
        }
        show_mnemo_i_j(this.sterg[i][j], i, j)
    }

    chosen_current(i, j){
        for (let i2 = 0; i2 < this.chosen.length; i2++){
            if (this.chosen[i2][0] == i && this.chosen[i2][1] == j){
                this.chosen_delete(i2);
            return;
            }
        }
        this.chosen_add(i, j);
    }

    chosen_add(i, j){
        chosen(i, j);
        this.chosen.push([i, j]);
    }

    chosen_delete(i2){
        chosen(this.chosen[i2][0], this.chosen[i2][1]);
//        console.log(this.chosen.splice(i2, 0), i2)
        this.chosen.splice(i2, 1);

        }


     update(){
         this.az.update();
         if (this.az.az_run){
            this.direction = 0;
         }
         this.rdg1.update();
         this.rdg2.update();
         var k = Object.keys(this.gcn);
        for (i = 0; i < k.length; i++){
            this.gcn[k[i]].update();
        }
         console.log("update");
         if (this.direction != 0){
            for (let i = 0; i < this.chosen.length; i++){
                this.set_s_position(this.chosen[i][0], this.chosen[i][1], this.direction);
            }
         }
         this.t1.update();
         this.t2.update();
         this.v_inBS -= (this.gcn["1_n"].g + this.gcn["1_a"].g) / 3600;
         this.v_inBS += (this.gcn["2_n"].g + this.gcn["2_a"].g) / 3600;
         this.h_braban_s = Math.sqrt(Math.abs((6.25 - Math.sqrt(39.0625 - 4 * (this.v_inBS / 33)* (this.v_inBS / 33))) / 2));
         setup_UI(this);
         send_update();
    }
}


class RemoteControl extends Reactor{
    chosen_delete(i2){
        send_chosen_delete(i2);
    }

    set_w_lar(w){
        socket.emit("set_w_lar", {"w": w, "room": room_id});
    }

    set_unset_up_direction(){
        socket.emit("set_unset_up_direction", {"room": room_id});
    }

    set_unset_down_direction(){
        socket.emit("set_unset_down_direction", {"room": room_id});
    }

    chosen_current(i, j){
        socket.emit("chosen_current", {"i": i, "j": j, "room": room_id});
        chosen(i, j);
    }

    update(){
        this.az.update();
         if (this.az.az_run){
            this.direction = 0;
         }
//         setup_UI(this);
    }
}



