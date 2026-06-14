function show_mnemo(reactor){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            show_mnemo_i_j(reactor.sterg[i][j], i, j);
        }
    }
}


function show_chosen(reactor){
}

function show_mnemo_i_j(value, i, j){
    try{
        var m = document.getElementById(`m${i}_${j}`);
        if (value == 100){
            m.style.background = "green";
            m.textContent = "";
        } else if (value >= 50){
            m.style.background = "#faf74d";
            m.textContent = value;
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


function stop_alert(id_error){
    var div = document.getElementById(id_error);
    div.style.background = "";
}



function chosen(i, j, flag){
    if (flag){
        document.getElementById(`s${i}_${j}`).style.border = "1px solid white";
    } else {
        document.getElementById(`s${i}_${j}`).style.border = "1px solid black";
    }
}

function setup_UI(reactor){
//СУЗ
    document.getElementById("W_Q").value = `${(reactor.thermal_power / 1e6 ).toFixed(0)}`;
    document.getElementById("reactivnost").value = reactor.rho_total;
    document.getElementById("speed_power").value = reactor.az.period_power;
    document.getElementById("ozr_ar").value = reactor.az.ozr_ar;
    document.getElementById("ozr").value = reactor.ozr;
    document.getElementById("grafit_temp").value = reactor.graphite_temp;
//    Турбины
    document.getElementById("w_e1").value = reactor.t1.w_e;
    document.getElementById("w_e2").value = reactor.t2.w_e;
    document.getElementById("T_reactor").value = reactor.outlet_temp;
    document.getElementById("obr_t1").value = reactor.t1.obr;
    document.getElementById("obr_t2").value = reactor.t2.obr;
    document.getElementById("rdg1_p").value = reactor.rdg1.power_e;
    document.getElementById("rdg2_p").value = reactor.rdg2.power_e;
    document.getElementById("p_in_reactor").value = reactor.p_in_reactor;
    document.getElementById("p_start1").value = reactor.t1.p_start;
    document.getElementById("p_start2").value = reactor.t2.p_start;
    document.getElementById("g_max_t1").value = reactor.t1.g_max;
    document.getElementById("g_max_t2").value = reactor.t2.g_max;
//    Насосы
var k = Object.keys(reactor.gcn);
    for (i = 0; i < k.length; i++){
        document.getElementById(k[i]).value = reactor.gcn[k[i]].g;
    }
    document.getElementById("T_2_H2O").value = reactor.T_2_H2O;
//    БС
    document.getElementById("h_braban_s1").value = reactor.bs1.h_braban_s;
    document.getElementById("fuel_temp").value = reactor.fuel_temp;
    document.getElementById("T_H2O1").value = reactor.bs1.T_H2O;
    document.getElementById("h_braban_s2").value = reactor.bs2.h_braban_s;
    document.getElementById("m_sep2").value = reactor.bs2.m_sep;
    document.getElementById("m_sep1").value = reactor.bs1.m_sep;
    document.getElementById("T_H2O2").value = reactor.bs2.T_H2O;
    document.getElementById("power_lar_show").value = reactor.az.power_ar  / 1e6 ;
    if (copy){
        show_mnemo(reactor);
        show_chosen(reactor)
    }
}


function ui_power(id_div, flag){
    if(flag) {
        document.getElementById(id_div).style.background = "green";
    } else {
        document.getElementById(id_div).style.background = "red";
    }
    try{
    if (!copy){
        socket.emit("method_send", {"room": room_id, "function": "ui_power", "id_div": id_div, "flag": flag});
    }
   } catch(error){
   }
}


function set_direction_ui(flag, id_div){
    if (!copy){
    socket.emit("method_send", {"room": room_id, "function": "set_direction_ui", "flag": flag, "id_div": id_div});
    }
    if (flag){
        document.getElementById(id_div).textContent = "\\";
    } else {
        document.getElementById(id_div).textContent = "/";
    }
}

function turn(id_div, flag){
    if (flag){
        document.getElementById(id_div).innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 32 32" xml:space="preserve" fill="#000000" transform="rotate(270)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .puchipuchi_een{fill:#111918;} </style> <path class="puchipuchi_een" d="M30,17c0,7.72-6.28,14-14,14S2,24.72,2,17C2,10.311,6.718,4.71,13,3.332v4.129 C8.948,8.739,6,12.531,6,17c0,5.514,4.486,10,10,10s10-4.486,10-10c0-4.469-2.948-8.261-7-9.539V3.332C25.282,4.71,30,10.311,30,17z M16,13c1.104,0,2-0.896,2-2V3c0-1.104-0.896-2-2-2s-2,0.896-2,2v8C14,12.104,14.896,13,16,13z"></path> </g></svg>`;
    } else {
        document.getElementById(id_div).innerHTML = `<svg  version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px"
                           height="20px" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                         <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                         <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                         <g id="SVGRepo_iconCarrier"> <style type="text/css"> .puchipuchi_een{fill:#111918;} </style>
                             <path class="puchipuchi_een" d="M30,17c0,7.72-6.28,14-14,14S2,24.72,2,17C2,10.311,6.718,4.71,13,3.332v4.129 C8.948,8.739,6,12.531,6,17c0,5.514,4.486,10,10,10s10-4.486,10-10c0-4.469-2.948-8.261-7-9.539V3.332C25.282,4.71,30,10.311,30,17z M16,13c1.104,0,2-0.896,2-2V3c0-1.104-0.896-2-2-2s-2,0.896-2,2v8C14,12.104,14.896,13,16,13z">

                             </path> </g></svg>`;
    }
}


function ui_direction(direction){
    if (direction == 1){
        ui_power("up_direction", true);
        ui_power("down_direction", false);
    } else if (direction == -1){
        ui_power("up_direction", false);
        ui_power("down_direction", true);
    } else {
        ui_power("up_direction", false);
        ui_power("down_direction", false);
    }
}