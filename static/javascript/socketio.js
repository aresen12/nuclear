const socket = io.connect();
socket.emit('join', {room: room_id});


function send_chosen_delete(i2){
    socket.emit("chosen_delete", {"i2": i2, "room": room_id});
}


function send_update(){
    var data = {
    "room": room_id,
    "sterg": re.sterg,
            "w_lar": re.w_lar,
            "v_inBS":re.v_inBS,
            "h_braban_s":re.h_braban_s,
            "p_in_reactor":re.p_in_reactor,
            "w_q":re.w_q,
            "reactivnost":re.reactivnost,
            "chosen":re.chosen,
            "direction": re.direction,
            "T_reactor":re.T_reactor,
            "T_H2O":re.T_H2O,
            "T_2_H2O": re.T_2_H2O,
            "t1":{"w_e":re.t1.w_e,
            "obr":re.t1.obr,
            "broken":re.t1.broken,
            "p_start":re.t1.p_start,
            "g":re.t1.g,
            "g_max":re.t1.g_max,
            "direction":re.t1.direction
            },
            "t2":{"w_e":re.t2.w_e,
            "obr":re.t2.obr,
            "broken":re.t2.broken,
            "p_start":re.t2.p_start,
            "g":re.t2.g,
            "g_max":re.t2.g_max,
            "direction":re.t2.direction
            },
            "gcn":{

            },
            "rdg1":{
                "work":re.rdg1.work,
                "direction":re.rdg1.direction,
                "power_e":re.rdg1.power_e
            },
            "rdg2":{
                "work":re.rdg2.work,
                "direction":re.rdg2.direction,
                "power_e":re.rdg2.power_e
            },
    };
    var k = Object.keys(re.gcn);
    for (let i = 0; i < k.length; i++){
        data["gcn"][k[i]] = {};
        data["gcn"][k[i]]["g"] = re.gcn[k[i]].g;
        data["gcn"][k[i]]["work"] = re.gcn[k[i]].work;
        data["gcn"][k[i]]["broken"] = re.gcn[k[i]].broken;
    }
    socket.emit("update", data);
}

socket.on('chosen_delete', (data) => {
    if (!copy){
    re.chosen_delete(data["i2"])
    }
});

socket.on('set_w_lar', (data) => {
    if (!copy){
        re.set_w_lar(data["w"]);
    }
});
socket.on('set_unset_down_direction', (data) => {
    if (!copy){
        re.set_unset_down_direction();
    }
});


socket.on('method_send', (data) => {
    if (!copy){
        if(data["function"] == "az5"){
            re.az.az5();
        } else if(data["function"] == "baz"){
            re.az.baz();
        } else if(data["function"] == "set_unset_up_direction"){
            re.set_unset_up_direction();
        } if(data["function"] == "turn_on_or_down_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.turn_on_or_down();
            } else {
                re.t2.turn_on_or_down();
            }
        }if(data["function"] == "start_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.start();
            } else {
                re.t2.start();
            }
        }if(data["function"] == "set_unset_down_direction_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.set_unset_down_direction();
            } else {
                re.t2.set_unset_down_direction();
            }
        }if(data["function"] == "set_unset_up_direction_turnover"){
            if (data["id_t"] == "t1"){
                re.t1.set_unset_up_direction();
            } else {
                re.t2.set_unset_up_direction();
            }
        }

    } else {
         if (data["function"] == "ui_power"){
            ui_power(data["id_div"], data["flag"]);
        }
    }
});



socket.on('chosen_current', (data) => {
    if (!copy){
    re.chosen_current(data["i"], data["j"]);
    console.log("test")
    }
});

socket.on('update', (data) => {
    if (copy){
    re.w_lar = data["w_lar"];
    re.v_inBS = data["v_inBS"];
    re.h_braban_s = data["h_braban_s"];
    re.p_in_reactor = data["p_in_reactor"];
    re.w_q = data["w_q"];
    re.chosen = data["chosen"];
    re.reactivnost = data["reactivnost"];
    re.direction = data["direction"];
    re.T_reactor = data["T_reactor"];
    re.T_H2O = data["T_H2O"];
    re.T_2_H2O = data["T_2_H2O"];
    re.sterg = data["sterg"];
    var k = Object.keys(data["gcn"]);
    for (let i = 0; i < k.length; i++){
        re.gcn[k[i]].g = data["gcn"][k[i]]["g"];
        re.gcn[k[i]].work = data["gcn"][k[i]]["work"];
        re.gcn[k[i]].broken = data["gcn"][k[i]]["broken"];
    }
    re.t1.w_e = data["t1"]["w_e"];
    re.t1.obr = data["t1"]["obr"];
    re.t1.broken = data["t1"]["broken"];
    re.t1.p_start = data["t1"]["p_start"];
    re.t1.g = data["t1"]["g"];
    re.t1.g_max = data["t1"]["g_max"];
    re.t1.direction = data["t1"]["direction"];
    re.t2.w_e = data["t2"]["w_e"];
    re.t2.obr = data["t2"]["obr"];
    re.t2.broken = data["t2"]["broken"];
    re.t2.p_start = data["t2"]["p_start"];
    re.t2.g = data["t2"]["g"];
    re.t2.g_max = data["t2"]["g_max"];
    re.t2.direction = data["t2"]["direction"];
    re.rdg1.work = data["rdg1"]["work"];
    re.rdg1.direction = data["rdg1"]["direction"];
    re.rdg1.power_e = data["rdg1"]["power_e"];
    re.rdg2.work = data["rdg2"]["work"];
    re.rdg2.direction = data["rdg2"]["direction"];
    re.rdg2.power_e = data["rdg2"]["power_e"];
    setup_UI(re);
    console.log("update control1")
    }
});


socket.on('connect', () => {
    socket.emit('join', {room: room_id});
});