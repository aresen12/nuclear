function sterg(i, j){
    re.chosen_current(i, j);
}


function pause(){
    showdiv1('global_menu_d');
    re.pause = true;
}


function stop_pause(){
     re.pause = false;
     exit_menu("global_menu_d");

}

function set_w_ar(){
    re.az.set_w_ar(document.getElementById("w_ar").value);
}


function gener_json(){
    var data = {
        "room": room_id,
        "sterg": re.sterg,
        "ozr": re.ozr,
        "graphite_temp": re.graphite_temp,
        "ozr_ar": re.az.ozr_ar,
        "power_ar": re.az.power_ar,
        "bs1": {
            "v_inBS":re.bs1.v_inBS,
            "h_braban_s":re.bs1.h_braban_s,
            "T_H2O": re.bs1.T_H2O,
            "m_sep": re.bs1.m_sep
        },
        "bs2": {
            "v_inBS":re.bs2.v_inBS,
            "h_braban_s":re.bs2.h_braban_s,
            "T_H2O": re.bs2.T_H2O,
            "m_sep": re.bs2.m_sep
        },
        "fuel_temp":re.fuel_temp,
        "p_in_reactor":re.p_in_reactor,
        "thermal_power":re.thermal_power,
        "rho_total":re.rho_total,
        "chosen":re.chosen,
        "direction": re.direction,
        "outlet_temp":re.outlet_temp,
        "T_2_H2O": re.T_2_H2O,
        "t1":{
            "w_e":re.t1.w_e,
            "obr":re.t1.obr,
            "broken":re.t1.broken,
            "p_start":re.t1.p_start,
            "g":re.t1.g,
            "g_max":re.t1.g_max,
            "direction":re.t1.direction,
            "work": re.t1.work
            },
    "t2":{
                "w_e":re.t2.w_e,
                "obr":re.t2.obr,
                "broken":re.t2.broken,
                "p_start":re.t2.p_start,
                "g":re.t2.g,
                "g_max":re.t2.g_max,
                "direction":re.t2.direction,
                "work": re.t2.work
    },
    "gcn":{},
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
    return data;
}


function save_game(){

    $.ajax({
    url: '/save_game',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify(gener_json()),
    success: function(json){

        },
    error: function(err) {
        console.error(err);
    }
});
}


function load_game_from_db(){
    $.ajax({
    url: `/get_game/${room_id}`,
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    success: function(json){
        console.log(json);
        if (json){
            load_data(json);
            setup_UI(re);
            show_mnemo(re);
        } else {
            save_game();
        }

        },
    error: function(err) {
        console.error(err);
    }
});
}

async function playAudio() {
  window.my_mute = false;
  var audio = document.getElementById("play");
  await audio.play();
  audio.loop = true;
  try {
    console.log('Playing...');
    return audio;
  } catch (err) {
    console.log('Failed to play...' + err);
  }

}


function load_data(data){
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
    re.ozr = data["ozr"];
    re.graphite_temp = data["graphite_temp"];
    re.az.ozr_ar = data["ozr_ar"];
    re.az.power_ar = data["power_ar"];
    var k = Object.keys(data["gcn"]);
    for (let i = 0; i < k.length; i++){
        re.gcn[k[i]].g = data["gcn"][k[i]]["g"];
        re.gcn[k[i]].work = data["gcn"][k[i]]["work"];
        turn(`${k[i]}_btn`, data["gcn"][k[i]]["work"]);
        re.gcn[k[i]].broken = data["gcn"][k[i]]["broken"];
    }
    re.t1.w_e = data["t1"]["w_e"];
    re.t1.obr = data["t1"]["obr"];
    re.t1.broken = data["t1"]["broken"];
    re.t1.p_start = data["t1"]["p_start"];
    re.t1.g = data["t1"]["g"];
    re.t1.g_max = data["t1"]["g_max"];
    re.t1.direction = data["t1"]["direction"];
    re.t1.work = data["t1"]["work"];
    turn(`${re.t1.id_turnover}_t_btn`, re.t1.work);
    re.t2.w_e = data["t2"]["w_e"];
    re.t2.obr = data["t2"]["obr"];
    re.t2.broken = data["t2"]["broken"];
    re.t2.p_start = data["t2"]["p_start"];
    re.t2.g = data["t2"]["g"];
    re.t2.g_max = data["t2"]["g_max"];
    re.t2.direction = data["t2"]["direction"];
    re.t2.work = data["t2"]["work"];
    turn(`${re.t2.id_turnover}_t_btn`, re.t2.work);
    re.rdg1.work = data["rdg1"]["work"];
    re.rdg1.direction = data["rdg1"]["direction"];
    re.rdg1.power_e = data["rdg1"]["power_e"];
    re.rdg2.work = data["rdg2"]["work"];
    re.rdg2.direction = data["rdg2"]["direction"];
    re.rdg2.power_e = data["rdg2"]["power_e"];
}