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
        this.sterg = []; // стержние ввод в процентах
        for (let i = 0; i < 9; i++) {
            this.sterg[i] = [];
            for (let j = 0; j < 9; j++) {
                this.sterg[i][j] = 100;
            }
        }
        this.lar = [[3, 4], [4, 3], [4, 5], [5, 4]]; // координаты стержней ЛАР
        this.w_lar = 0; // мощность ЛАР
        this.w_q = 3300; //
        this.p_in_reactor = 700000;
//        this.v_inAZ = ;
        this.reactivnost = 0;
        this.direction = 0; // -1 - down 1 - up
        this.chosen = []; // выбранные стержни
        // насосы
        this.gcn = {
            "1_n": new Pump("1_n"),
            "2_n": new Pump("2_n"),
            "3_n": new Pump("3_n"),
            "4_n": new Pump("4_n"),
            "1_a": new Pump("1_a"),
            "2_a": new Pump("2_a"),
            "3_a": new Pump("3_a"),
        }
        this.rdg1 = new Rdg("rdg1");
        this.rdg2 = new Rdg("rdg2"); // Резервные дизель генераторы
        this.t1 = new Turnover("t1");
        this.t2 = new Turnover("t2");
        this.bs1 = new BS(1);
        this.bs2 = new BS(2); //
        this.T_reactor = 80; // температура самого реактора(не где не используеться)
        this.T_2_H2O = 25; // температура во втором контуре
        this.T_PVS = 280; // температкра параводяной смеси
        this.az = new Az(this); // класс аварийной защиты
        this.pr = 0; // процент пара
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
//        var g1 = 0;
//        var g2 = 0;
//        if (this.bs1.work && this.bs2.work){
//            g1 = this.g / 2;
//            g2 = g1;
//         } else if (this.bs1.work){
//             g1 = this.g;
//             g2 = 0;
//         } else if (this.bs2.work){
//            g1 = 0;
//             g2 = this.g;
//         }
//         console.log(g1, g2);
          this.bs1.update(this.gcn["1_n"].g, this.gcn["3_n"].g, this.pr, this.T_2_H2O, this.T_PVS);
          this.bs2.update(this.gcn["2_n"].g, this.gcn["4_n"].g, this.pr,, this.T_2_H2O, this.T_PVS);
         this.t1.update(this.bs1.m_sep, this.p_in_reactor);
         this.t2.update(this.bs2.m_sep, this.p_in_reactor);
//         this.v_inBS -= (this.gcn["1_n"].g + this.gcn["1_a"].g) / 3600;
//         this.v_inBS += (this.gcn["2_n"].g + this.gcn["2_a"].g) / 3600;
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


