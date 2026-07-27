const socket = io.connect();
socket.emit('join', {room: room_id});


function send_chosen_delete(i2){
    socket.emit("chosen_delete", {"i2": i2, "room": room_id});
}


function send_update(){
    data = gener_json();
    socket.emit("update", data);
}

socket.on('chosen_delete', (data) => {
    if (!rc.copy){
        re.chosen_delete(data["i2"])
    }
});
socket.on('connect_other_room', (data) => {
    rc.connect(data["id_device"]);
});

socket.on('set_w_ar', (data) => {
    if (!rc.copy){
        re.az.set_w_ar(data["w"]);
    }
});


socket.on('set_unset_down_direction', (data) => {
    if (!copy){
        re.set_unset_down_direction();
    }
});


socket.on('method_send', (data) => {
    if (!rc.copy){
        if(data["function"] == "az5"){
            re.az.az5(data["manual"]);
        } else if(data["function"] == "baz"){
            re.az.baz();
        } else if(data["function"] == "set_unset_up_direction"){
            re.set_unset_up_direction();
        } else if(data["function"] == "turn_on_or_down_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.turn_on_or_down();
            } else {
                re.t2.turn_on_or_down();
            }
        } else if(data["function"] == "start_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.start();
            } else {
                re.t2.start();
            }
        } else if(data["function"] == "set_unset_down_direction_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.set_unset_down_direction();
            } else {
                re.t2.set_unset_down_direction();
            }
        } else if(data["function"] == "set_unset_up_direction_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.set_unset_up_direction();
            } else {
                re.t2.set_unset_up_direction();
            }
        }
        if (data["function"] == "set_steam_direction_turnover"){
            if (data["id_t"] == "t1"){
                console.log("test");
                re.t1.set_steam_direction();
            } else {
                re.t2.set_steam_direction();
            }
        }
        if (data["function"] == "turn_on_or_down_rdg"){
            if (data["id_rdg"] == "rdg1"){
                re.rdg1.turn_on_or_down();
            } else {
                re.rdg2.turn_on_or_down();
            }
        }
        if (data["function"] == "set_unset_down_direction_pump"){
            re.gcn[data["id_pump"]].set_unset_down_direction();
        }
         if (data["function"] == "turn_on_or_down_ar"){
            re.az.turn_on_or_down_ar();
        }if (data["function"] == "stop_az"){
            re.az.stop_az();
        }
        if (data["function"] == "turn_on_or_down_power_SYZ"){
            re.az.turn_on_or_down_power_SYZ();
        }

        if (data["function"] == "set_unset_up_direction_pump"){
            re.gcn[data["id_pump"]].set_unset_up_direction();
        }
        if (data["function"] == "turn_on_or_down_pump"){
            re.gcn[data["id_pump"]].turn_on_or_down();
        }
    } else {
         if (data["function"] == "ui_power"){
            ui_power(data["id_div"], data["flag"]);
        } else if (data["function"] == "set_direction_ui"){
            set_direction_ui(data["flag"], data["id_div"]);
        }
        if (data["function"] == "chosen_add_show"){
           console.log("chosen_add_show");
           chosen(data["i"], data["j"], true);
        }
                if (data["function"] == "chosen_delete"){
chosen(data["i"], data["j"], false);
        }
    }
});



socket.on('chosen_current', (data) => {
    if (!rc.copy){
    re.chosen_current(data["i"], data["j"]);
    }
});


socket.on('update', (data) => {
    if (rc.copy){
        load_data(data);
        setup_UI(re);
    }
});


socket.on('connect', () => {
    socket.emit('join', {room: room_id});
});

socket.on('join_event', (data) => {
//   alert(`Пользователь ${data["name"]} вошёл`);
});

socket.on('leave_event', (data) => {
    alert(`Пользователь ${data["name"]} вышел`);
});