const socket = io.connect();
socket.emit('join', {room: room_id});


socket.on('chosen_delete', (data) => {
});

socket.on('set_w_ar', (data) => {
        save_error(`Установка мощности АР${data["w"]}`)
//        re.az.set_w_ar(data["w"]);
});
socket.on('set_unset_down_direction', (data) => {
//    if (!copy){
//        re.set_unset_down_direction();
//    }
});


socket.on('method_send', (data) => {
//    if (!copy){

        if(data["function"] == "az5"){
            save_error("Набор аз-5");
//            re.az.az5();
        } else if(data["function"] == "baz"){
            save_error("Набор баз");
//            re.az.baz();
        } else if(data["function"] == "set_unset_up_direction"){

            re.set_unset_up_direction();
        } else if(data["function"] == "turn_on_or_down_turnover"){
            if (data["id_t"] == "t1"){
                save_error("вкл откл ТГ1");
//                re.t1.turn_on_or_down();
            } else {
//                re.t2.turn_on_or_down();
                save_error("вкл откл ТГ2");
            }
        } else if(data["function"] == "start_turnover"){
//            if (data["id_t"] == "t1"){
//                re.t1.start();
//            } else {
//                re.t2.start();
//            }
        } else if(data["function"] == "set_unset_down_direction_turnover"){
//            if (data["id_t"] == "t1"){
//                re.t1.set_unset_down_direction();
//            } else {
//                re.t2.set_unset_down_direction();
//            }
        } else if(data["function"] == "set_unset_up_direction_turnover"){
//            if (data["id_t"] == "t1"){
//                re.t1.set_unset_up_direction();
//            } else {
//                re.t2.set_unset_up_direction();
//            }
        }
        if (data["function"] == "set_steam_direction_turnover"){
            if (data["id_t"] == "t1"){
                console.log("test");
                save_error("Изменение расхода через ТГ1");
//                re.t1.set_steam_direction();
            } else {
//                re.t2.set_steam_direction();
                save_error("Изменение расхода через ТГ1");
            }
        }
        if (data["function"] == "turn_on_or_down_rdg"){
            if (data["id_rdg"] == "rdg1"){
                save_error("ВКЛ ОТКЛ РДГ1");
//                re.rdg1.turn_on_or_down();
            } else {
//                re.rdg2.turn_on_or_down();
save_error("ВКЛ ОТКЛ РДГ2");
            }
        }
        if (data["function"] == "set_unset_down_direction_pump"){
            re.gcn[data["id_pump"]].set_unset_down_direction();
        }
         if (data["function"] == "turn_on_or_down_ar"){
//            re.az.turn_on_or_down_ar();
            save_error("ВКЛ ОТКЛ АР");
        }if (data["function"] == "stop_az"){
            save_error("Съём аз");
//            re.az.stop_az();
        }
        if (data["function"] == "turn_on_or_down_power_SYZ"){
//            re.az.turn_on_or_down_power_SYZ();
            save_error("ОТКЛ ВКЛ ПИТ МУФТ")
        }

        if (data["function"] == "set_unset_up_direction_pump"){
            save_error(`Изменение расхода ${data["id_pump"]}`);
//            re.gcn[data["id_pump"]].set_unset_up_direction();
        }
        if (data["function"] == "turn_on_or_down_pump"){
            save_error(`ВКЛ ОТКЛ ${data["id_pump"]}`);
//            re.gcn[data["id_pump"]].turn_on_or_down();
        }
//         if (data["function"] == "ui_power"){
//            ui_power(data["id_div"], data["flag"]);
//        } else if (data["function"] == "set_direction_ui"){
//            set_direction_ui(data["flag"], data["id_div"]);
//        }
//        if (data["function"] == "chosen_add_show"){
//           console.log("chosen_add_show");
//           chosen(data["i"], data["j"], true);
//        }
//                if (data["function"] == "chosen_delete"){
//chosen(data["i"], data["j"], false);
//        }
//    }
});



socket.on('chosen_current', (data) => {
//    if (!copy){
//    re.chosen_current(data["i"], data["j"]);
//    }
});


socket.on('update', (data) => {

    sk.thermal_power_g.draw(sk.last_data["thermal_power"], data["thermal_power"], sk.time, sk.time - 1);
    sk.speed_power_g.draw(sk.last_data["period_power"], data["period_power"], sk.time, sk.time - 1)
    sk.load_data(data);
//    sk.update(data);
//    if (copy){
//        load_data(data);
//        setup_UI(re);
//    }
});


socket.on('connect', () => {
    socket.emit('join', {room: room_id});
});


function save_error(text){
    document.getElementById("journal").value += `${sk.time} - ${text}\n`
}