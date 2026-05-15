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


class DRdg extends Rdg{
    turn_on_or_down(){
        socket.emit("method_send", {"room": room_id, "function": "turn_on_or_down_rdg", "id_rdg": this.id_rdg});
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
        this.g = 2000;
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
         if ( this.t1.direction != 0){
             this.t1.set_g_max();
        }
        if ( this.t2.direction != 0){
             this.t2.set_g_max();
        }
         var g1 = this.t1.g_max;
         var g2 = this.t2.g_max;
         if (this.t1.g_max + this.t2.g_max >= this.g){
            if (this.t2.g_max == this.t1.g_max){
                g1 = this.g / 2;
                g2 = g1;
            } else {
                if (this.t1.g_max > this.t2.g_max && this.t1.g_max <= this.g){
                    g1 = this.t1.g_max;
                    g2 = this.g - g1;
                }else if (this.t1.g_max < this.t2.g_max && this.t2.g_max <= this.g){
                        g2 = this.t2.g_max;
                        g1 = this.g - g2;

                } else if (this.t2.g_max == 0){
                    g1 = this.g;
                    g2 = 0;
                } else if(this.t1.g_max == 0){
                    g1 = 0;
                    g2 = this.g;
                }else{
                    g1 = this.g / 2;
                g2 = g1;
                }
            }
         }
         this.t1.update(g1, this.p_in_reactor);
         this.t2.update(g2, this.p_in_reactor);
         this.v_inBS -= (this.gcn["1_n"].g + this.gcn["1_a"].g) / 3600;
         this.v_inBS += (this.gcn["2_n"].g + this.gcn["2_a"].g) / 3600;
         this.h_braban_s = Math.sqrt(Math.abs((6.25 - Math.sqrt(39.0625 - 4 * (this.v_inBS / 33)* (this.v_inBS / 33))) / 2));
         setup_UI(this);
         send_update();
    }
}


class RemoteControl extends Reactor{

    constructor(){
    super();
//        super.constructor();
        this.az = new DAz(this);
        this.t1 = new DTurnover("t1");
        this.t2 = new DTurnover("t2");
        this.rdg1 = new DRdg("rdg1");
        this.rdg2 = new DRdg("rdg2");
        this.gcn = {
            "1_n": new DPump("1_n"),
            "2_n": new DPump("2_n"),
            "3_n": new DPump("3_n"),
            "1_a": new DPump("1_a"),
            "2_a": new DPump("2_a"),
            "3_a": new DPump("3_a"),
        }
    }
    chosen_delete(i2){
        send_chosen_delete(i2);
    }

    set_w_lar(w){
        socket.emit("set_w_lar", {"w": w, "room": room_id});
    }

    set_unset_up_direction(){
        socket.emit("method_send", {"room": room_id, "function": "set_unset_up_direction"});
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


