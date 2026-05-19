const socket = io.connect();
socket.emit('join', {room: room_id});


function send_chosen_delete(i2){
    socket.emit("chosen_delete", {"i2": i2, "room": room_id});
}


function send_update(){
    var data = {
    "room": room_id,
    "sterg": re.sterg,
    "bs1": {"v_inBS":re.bs1.v_inBS,
            "h_braban_s":re.bs1.h_braban_s,"T_H2O": re.bs1.T_H2O,
        "m_sep": re.bs1.m_sep
        },
        "bs2": {"v_inBS":re.bs2.v_inBS,
            "h_braban_s":re.bs2.h_braban_s,"T_H2O": re.bs2.T_H2O,
        "m_sep": re.bs2.m_sep
        },
            "fuel_temp":re.fuel_temp,
            "w_lar": re.w_lar,
            "p_in_reactor":re.p_in_reactor,
            "thermal_power":re.thermal_power,
            "rho_total":re.rho_total,
            "chosen":re.chosen,
            "direction": re.direction,
            "outlet_temp":re.outlet_temp,
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
                console.log("test");
                re.rdg1.turn_on_or_down();
            } else {
                re.rdg1.turn_on_or_down();
            }
        }
        if (data["function"] == "set_unset_down_direction_pump"){
            re.gcn[data["id_pump"]].set_unset_down_direction();
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
    if (!copy){
    re.chosen_current(data["i"], data["j"]);
    console.log("test")
    }
});

socket.on('update', (data) => {
    if (copy){
    re.w_lar = data["w_lar"];
    re.bs1.v_inBS = data["bs1"]["v_inBS"];
    re.bs1.h_braban_s = data["bs1"]["h_braban_s"];
    re.bs1.T_H2O = data["bs1"]["T_H2O"];
    re.bs2.v_inBS = data["bs2"]["v_inBS"];
    re.bs2.h_braban_s = data["bs2"]["h_braban_s"];
    re.bs2.T_H2O = data["bs2"]["T_H2O"];
    re.p_in_reactor = data["p_in_reactor"];
    re.thermal_power = data["thermal_power"];
    re.chosen = data["chosen"];
    re.rho_total = data["rho_total"];
    re.direction = data["direction"];
    re.fuel_temp = data["fuel_temp"];
    re.outlet_temp = data["outlet_temp"];
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

socket.on('join_event', (data) => {
//   alert(`Пользователь ${data["name"]} вошёл`);
});

socket.on('leave_event', (data) => {
    alert(`Пользователь ${data["name"]} вышел`);
});