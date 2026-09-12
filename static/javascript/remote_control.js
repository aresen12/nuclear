class RC{
    constructor(is_copy){
        this.copy = is_copy;
        this.connect_device = [];
        if (this.copy){
            this.connect_other_room(room_id);
            console.log("conect")
        }
    }

    update(){
        if (!this.copy && this.connect_device.length != 0){
            send_update();
console.log("send_update");
        }
    }

    connect(id_device){
        if (!this.copy){
            this.connect_device.push(id_device);
            console.log("connect_device")
        }

    }

    disconnect(id_device){
        this.connect_device;
    }

    connect_other_room(){
        socket.emit("connect_other_room", {"id_device": "device", "room": room_id});
    }
}