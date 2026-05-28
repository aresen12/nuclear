class Pump{
    constructor(id_pump){
//    g max 8000
        this.g = 0; // расход воды м3/ч
        this.work = false;
        this.direction = 0; // направление понижения или повышения расхода
        this.max_g = 24000; // макс расход
        this.id_pump = id_pump;
        this.broken = false; // сломан или нет
        this.w_e = 0;
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
            turn(`${this.id_pump}_btn`, false);
            this.w_e = 0;
        } else if (!this.broken){
            this.work = true
            turn(`${this.id_pump}_btn`, true);
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
        if (this.work){
            this.w_e = this.g * 0.5375;
        }
        if (this.broken && this.work){
            this.work = false;
            this.direction = -1;
            ui_power(`${this.id_pump}_s`, false);
            turn(`${this.id_pump}_btn`, false);
        }
    }
}


class DPump extends Pump {
    set_unset_down_direction() {
       socket.emit("method_send", {"room": room_id, "function": "set_unset_down_direction_pump", "id_pump": this.id_pump});
    }

    set_unset_up_direction() {
        socket.emit("method_send", {"room": room_id, "function": "set_unset_up_direction_pump", "id_pump": this.id_pump});
    }

    turn_on_or_down(){
        socket.emit("method_send", {"room": room_id, "function": "turn_on_or_down_pump", "id_pump": this.id_pump});
    }
}