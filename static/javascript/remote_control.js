class RC{
    constructor(is_copy){
        this.sid = "";
        this.copy = is_copy;
        this.connect_device = [];
        this.connect_flag = false;
        this.start_connect_time = 0;
        this.wait = false;
    }

    update(){
        if (!this.copy && this.connect_device.length != 0){
            send_update();
        }
    }

    connect(id_device){
        if (!this.copy){
            this.connect_device.push(id_device);
            socket.emit("connect_rc", {"sid": id_device, "room": room_id});
            console.log("connect_device")
        }

    }

    disconnect(id_device){
        this.connect_device;
    }

    connect_other_room(){
        try{
        this.start_connect_time = re.time;
        this.wait = true;
        } catch(e){
        socket.emit("connect_other_room", {"id_device": this.sid, "room": room_id});
        }
    }

    connect_skala()   {
        socket.emit("connect_other_room", {"id_device": this.sid, "room": room_id});

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