function show_mnemo(reactor){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            show_mnemo_i_j(reactor.sterg[i][j], i, j);
        }
    }
}


function exit_menu(menu_id){
    document.getElementById(menu_id).style.display = "none";
}


function show_mnemo_i_j(value, i, j){
    try{
        var m = document.getElementById(`m${i}_${j}`);
        if (value == 100){
            m.style.background = "#b3c79f";
        } else if (value == 0){
            m.style.background = "#ffb961";
        } else {
            m.style.background = "";
        }
    m.textContent = value;
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


function start_alert(id_error){
    var div = document.getElementById(id_error);
     div.style.background = "#fcf172";
}

function red_alert(id_error){
    var div = document.getElementById(id_error);
    if (div.style.background == ""){
        div.style.background = "red";
    } else {
        div.style.background = "";
    }
}


function stop_alert(id_error){
    var div = document.getElementById(id_error);
    div.style.background = "";
}


function start_UI(reactor){
    var k = Object.keys(reactor.gcn);
    for (i = 0; i < k.length; i++){
        ui_power_source(reactor.gcn[k[i]].source_power, k[i]);
        if (!reactor.gcn[k[i]].work){
            start_alert(`${reactor.gcn[k[i]].id_pump}_turn_down`);
        } else {
            stop_alert(`${reactor.gcn[k[i]].id_pump}_turn_down`);
        }
    }
    if(!reactor.rdg1.work){
        start_alert(`turn_down_${reactor.rdg1.id_rdg}`);
    } else {
        stop_alert(`turn_down_${reactor.rdg1.id_rdg}`);
    }
    ui_power(`${reactor.rdg1.id_rdg}_s`, reactor.rdg1.work);
    ui_power(`${reactor.rdg2.id_rdg}_s`, reactor.rdg2.work);
    if(!reactor.rdg2.work){
        start_alert(`turn_down_${reactor.rdg2.id_rdg}`);
    } else {
        stop_alert(`turn_down_${reactor.rdg2.id_rdg}`);
    }
    for (let i = 0; i < reactor.chosen.length; i++){
        chosen(reactor.chosen[i][0], reactor.chosen[i][1], true);
    }
    ui_power("lar_s", reactor.az.power_ar);
    ui_speed_SYZ(reactor.speed_SYZ);
    if (reactor.az.mode == 2){
       turn("azsr_start", 1);
       turn("azs_start", 0);
       stop_alert("azs_on");
       stop_alert('azsr_turn_down');
    } else if (reactor.az.mode == 1){
        turn("azs_start", 1);
        turn("azsr_start", 0);
        green_alert("azs_on")
        stop_alert("azsr_on");
        stop_alert('azs_turn_down');
    } else {
        stop_alert("azsr_on");
        stop_alert("azs_on");
        start_alert('azs_turn_down');
        start_alert('azsr_turn_down');
    }
}


function ui_thermal_power_mnemo(sek){
    for (let i = 0; i < 9; i++) {
            for (let j = 0; j < re.sterg[i].length; j++) {
                if (re.sterg[i][j] == -1){
                    continue;
                }
                ui_thermal_power_laz(i, j, sek[get_sektor_number(i, j)])
            }
    }

}

// type  1 - danger 2 - 3 - green
function ui_thermal_power_laz(i, j, type){
    try{
        var div = document.getElementById(`m2${i}_${j}`);
        if (type == 1){
            div.style.background = "red";
        } else if (type == 2) {
            div.style.background = "#fcf172";
        } else {
            div.style.background = "green";
        }
    } catch(e){
     console.log(`m2${i}_${j}`)
    }
}


function showdiv1(Div){
    var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "block";
        return true;
    }
    x.style.display = "none";
    return false;
}


function showdivFlex(Div){
    var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "flex";
        return true;
    }
    x.style.display = "none";
    return false;
}



function ui_speed_SYZ(speed){
    for (let i = 1; i < 6; i++){
        if (speed == i){
            start_alert(`s${i}`);
        } else {
            stop_alert(`s${i}`);
        }
    }
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
    document.getElementById("p_bs1").value = reactor.bs1.p;
    document.getElementById("T_H2O2").value = reactor.bs2.T_H2O;
    document.getElementById("power_lep1").value = reactor.power_lep1;
    document.getElementById("power_lep2").value = reactor.power_lep2;
    document.getElementById("game-time").textContent = game.time_work;
    document.getElementById("last_time").textContent = game.tasks[game.id_task]["time"] - game.global_time;
    document.getElementById("power_lar_show").value = reactor.az.power_ar  / 1e6 ;
    if (rc.copy){
        show_mnemo(reactor);
        for (i = 0; i < k.length; i++){
            ui_power_source(reactor.gcn[k[i]].source_power, k[i]);
        }
    }

}


function green_alert(id_error){
    var div = document.getElementById(id_error);
     div.style.background = "#7ba05b";
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
        document.getElementById(id_div).innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 32 32" xml:space="preserve" fill="#000000" transform="rotate(270)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <style type="text/css"> .puchipuchi_een{fill:#111918;} </style>
         <path class="puchipuchi_een" d="M30,17c0,7.72-6.28,14-14,14S2,24.72,2,17C2,10.311,6.718,4.71,13,3.332v4.129 C8.948,8.739,6,12.531,6,17c0,5.514,4.486,10,10,10s10-4.486,10-10c0-4.469-2.948-8.261-7-9.539V3.332C25.282,4.71,30,10.311,30,17z M16,13c1.104,0,2-0.896,2-2V3c0-1.104-0.896-2-2-2s-2,0.896-2,2v8C14,12.104,14.896,13,16,13z"></path> </g></svg>`;
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


function ui_power_source(number, id_pump){
    for (let i = 1; i < 5; i++){
        if (number == i){
            start_alert(`${number}_source_${id_pump}`);
        }  else {
            stop_alert(`${i}_source_${id_pump}`);
        }
    }
}


function select_game_menu(){
    showdiv1("game_select_d");
}


function gener_select_task_menu(tasks){
    let cont = document.getElementById("select_task");
    var k = Object.keys(tasks);
    k.sort();
    for (i = 0; i < k.length; i++){
        cont.innerHTML += `<div onclick="game.set_task(${k[i]})" class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Задания</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">За выполнение ${tasks[k[i]]["points"]} очков</h6>
    <p class="card-text">${tasks[k[i]]["text"]}</p>
    <p class="card-text">Время на выполнение ${tasks[k[i]]["time"]}с.</p>

  </div>
</div>`;
    }
}


function clear_and_write_text_task(text){
    let cont = document.getElementById("select_task");
    cont.textContent = text;
}
