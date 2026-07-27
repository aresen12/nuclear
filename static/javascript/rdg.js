class Rdg{
    constructor(id_rdg){
        this.work = false;
        this.power_e = 0;
        this.max_power_e = 20000; // KW
        this.direction = 0;
        this.id_rdg = id_rdg;
        this.speed = 75; // 40 c быстрее чернобыльских на 5 с
        this.obr = 0;
    }

    start_ui(){
        this.work = true;
        this.power_e = this.max_power_e;
        this.obr = 3000;
        ui_power(`${this.id_rdg}_s`, true);
    }

    update(){
        if (this.direction != 0){
            if (0 <= this.obr + this.direction * this.speed  && this.obr + this.direction * this.speed <= 3000){
                    this.obr += this.direction * this.speed;
                } else {
                    this.direction = 0;
                }
        }
            if (this.obr == 3000){
                this.power_e = this.max_power_e;
            } else {
                this.power_e = 0;
            }
    }

    turn_on_or_down(){
        if (this.work){
            this.work = false;
            this.direction = -1;
            ui_power(`${this.id_rdg}_s`, false);
            re.az.temporary_alert.push(new TemporaryAlert(`turn_down_${this.id_rdg}`, 1, true))
        } else {
            this.work = true;
            this.direction = 1;
            ui_power(`${this.id_rdg}_s`, true);
            stop_alert(`turn_down_${this.id_rdg}`);
        }
    }


}


class DRdg extends Rdg{
    turn_on_or_down(){
        socket.emit("method_send", {"room": room_id, "function": "turn_on_or_down_rdg", "id_rdg": this.id_rdg});
    }
}