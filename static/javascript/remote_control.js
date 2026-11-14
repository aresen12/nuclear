class RC{
    constructor(is_copy){
        this.sid = "";
        this.copy = is_copy;
        if (is_copy){
            this.main_sid = "";
            this.last_upd_time = 0;
            this.start_connect_time = 0;
            this.wait = false;
        }
        this.connect_device = [];
        this.connect_flag = false;
    }

    update(){
        if (!this.copy && this.connect_device.length != 0){
            send_update(this.sid);
        }
    }

    connect(id_device){
        if (!this.copy){
            this.connect_device.push(id_device);
            socket.emit("connect_rc", {"sid": id_device, "room": room_id, "main_sid": this.sid});
            init_cursor(0,0, id_device);
        }
    }

    disconnect(id_device){
        this.connect_device;
    }

    turn_send(id_btn, bool_, text){
        if (!this.copy && this.connect_device.length != 0){
            socket.emit("turn_btn", {id: id_btn, flag: bool_, text: text, room: room_id});
         }
    }

    send_mouse_pos(x, y){
        if (this.connect_device.length != 0 || this.copy){
            socket.emit("m_p", {sid: this.sid, x: x, y: y, room: room_id});
        }
    }

    connect_other_room(){
        try{
            if (this.sid != ""){
                this.start_connect_time = re.time;
                this.wait = true;
                socket.emit("connect_other_room_server", {"id_device": this.sid, "room": room_id});
            }
        } catch(e){}
    }

    connect_skala()   {
        socket.emit("connect_other_room_server", {"id_device": this.sid, "room": room_id});
    }


    set_sid(new_sid){
        this.sid = new_sid;
        if (this.copy){
            try{
                this.connect_other_room(room_id);
            } catch(e){
                this.connect_skala();
            }
            console.log("connect");
        }
    }
}