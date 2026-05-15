function show_mnemo(reactor){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            show_mnemo_i_j(reactor.sterg[i][j], i, j);
        }
    }
}


function show_mnemo_i_j(value, i, j){
    try{
        var m = document.getElementById(`m${i}_${j}`);
        if (value == 100){
            m.style.background = "green";
            m.textContent = "";
        } else {
            m.style.background = "red";
            m.textContent = value;
        }

    }catch(error){
    }
}


function my_alert(id_error){
    var div = document.getElementById(id_error);
    if (div.style.background == ""){
        div.style.background = "#fcf172";
    } else {
        div.style.background = "";
    }
}




function chosen(i, j){
    if (document.getElementById(`s${i}_${j}`).style.border != "1px solid white"){
        document.getElementById(`s${i}_${j}`).style.border = "1px solid white";
    } else {
        document.getElementById(`s${i}_${j}`).style.border = "1px solid black";
    }
}

function setup_UI(reactor){
//    console.log("setup");
    document.getElementById("W_Q").value = reactor.w_q;
    document.getElementById("w_e1").value = reactor.t1.w_e;
    document.getElementById("w_e2").value = reactor.t2.w_e;
    var k = Object.keys(reactor.gcn);
    for (i = 0; i < k.length; i++){
        document.getElementById(k[i]).value = reactor.gcn[k[i]].g;
    }
    document.getElementById("T_reactor").value = reactor.T_reactor;
    document.getElementById("T_H2O").value = reactor.T_H2O;
    document.getElementById("T_2_H2O").value = reactor.T_2_H2O;
    document.getElementById("obr_t1").value = reactor.t1.obr;
    document.getElementById("obr_t2").value = reactor.t2.obr;
    document.getElementById("rdg1_p").value = reactor.rdg1.power_e;
    document.getElementById("rdg2_p").value = reactor.rdg2.power_e;
    document.getElementById("p_in_reactor").value = reactor.p_in_reactor;
    document.getElementById("p_start1").value = reactor.t1.p_start;
    document.getElementById("p_start2").value = reactor.t2.p_start;
    document.getElementById("g_max_t1").value = reactor.t1.g_max;
    document.getElementById("g_max_t2").value = reactor.t2.g_max;
    document.getElementById("h_braban_s").value = reactor.h_braban_s;
    document.getElementById("reactivnost").value = reactor.reactivnost;
    if (copy){
        show_mnemo(reactor);
    }
}


function ui_power(id_div, flag){
    if(flag) {
        document.getElementById(id_div).style.background = "green";
    } else {
        document.getElementById(id_div).style.background = "red";
    }
    if (!copy){
        socket.emit("method_send", {"room": room_id, "function": "ui_power", "id_div": id_div, "flag": flag});
    }
}set_direction_ui


function set_direction_ui(flag, id_div){
    if (!copy){
    socket.emit("method_send", {"room": room_id, "function": "set_direction_ui", "flag": flag, "id_div": id_div});
    }
//    console.log(document.getElementById("t1_direction_steam"), id_div, flag);
    if (flag){
        document.getElementById(id_div).textContent = "\\";
    } else {
        document.getElementById(id_div).textContent = "/";
    }
}