class Pump{
    constructor(id_pump, speed){
//    g max 8000
        this.speed = speed;
        this.g = 0; // расход воды м3/ч
        this.work = false;
        this.direction = 0; // направление понижения или повышения расхода
        this.max_g = 32000; // макс расход
        this.id_pump = id_pump;
        this.broken = false; // сломан или нет
        this.w_e = 0;
        this.source_power = 1;
    }

    set_g(){
        if (0 <= this.g + this.direction * this.speed && this.g + this.direction * this.speed <= this.max_g){
            this.g += this.direction * this.speed;
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
            re.az.temporary_alert.push(new TemporaryAlert(`${this.id_pump}_turn_down`, 3, true))
            this.w_e = 0;
        } else if (!this.broken){
            this.work = true
            turn(`${this.id_pump}_btn`, true);
            ui_power(`${this.id_pump}_s`, true);
            my_alert(`${this.id_pump}_turn_down`);
        }
    }

    set_unset_up_direction() {

        if (this.work){
        if (this.direction == 1){

            this.direction = 0;
        } else {
         console.log("test")
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
            console.log("set_g")
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

    set_power_source(number_source){
        this.source_power = number_source;
        ui_power_source(number_source, this.id_pump);
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

    set_power_source(source){
        socket.emit("method_send", {"room": room_id, "function": "set_power_source", "id_pump": this.id_pump, "source": source});
    }
}