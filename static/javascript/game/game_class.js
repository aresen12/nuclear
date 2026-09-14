

class Game{
    constructor(type=0, inaccuracy=0.01){
    this.win = false;
            this.tasks = {
  "1": {
    "text": "Вывести реактор на проектную мощность 3200 мвт тепловых.",
    "points": 80,
    "time": 600,
    "time_work": 60, "condition": "w1600"
  },
  "2": {
    "text": "вывести реактор на мощность 1600 мвт и подключить тг1",
    "points": 75,
    "time": 600,
    "time_work": 60
    , "condition": "w0"
  },
  "3": {
    "text": "Удержать реактор на мощности 3200 Мвт",
    "points": 80,
    "time": 600,
    "time_work": 60,
    "condition": "w3200"
  },
  "4": {
    "text": "Уменшить мощность реактора с 3200 мвт до 1600. У удержать реактор в стабильном состоянии 2 мин",
    "points": 75,
    "time": 600,
    "time_work": 60,
    "condition": "w3200"
  },
  "5": {
    "text": "Перевести реактор в аварийное состояние: снизить мощность до 100мвт и перевести питание на генераторы",
    "points": 90,
    "time": 600,
    "time_work": 60,
    "condition": "w1600"
  },
  "6": {
    "text": "Вывести реактор на Минимально контролируемую мощность(МКУ = 20 МВт) и удерживать 1 мин",
    "points": 10,
    "time": 600,
    "time_work": 60,
    "condition": "w0"
  }
}
        this.type = type;
        this.check_parament_end = this.tasks[1]["check_parament_end"];
        this.inaccuracy = inaccuracy;
        this.id_task = 0;
        this.time_work = 0;
        this.global_time = 0
        if (this.type == 0 || this.type == 4){
            select_game_menu();
        }
    }

    update(reactor){
        if (this.type != 3 && !reactor.pause && this.id_task != 0){
            this.global_time++;
            if (this.check_end_game(reactor)){
                alert("Проиграли")
                reactor.pause = true;
                return;
            }
            if (this.check_win(reactor)){
                this.time_work++;
                if (this.time_work >= this.tasks[this.id_task]["time_work"] && !this.win){
                    send_win();
                reactor.pause = true;
                alert("Вы выйграли");
                }

            }
        }
    }

    check_end_game(reactor){
        if (reactor.thermal_power /1e6 >= 3300){
            return true;
        }
        if (this.global_time > this.tasks[this.id_task]["time"]){
            return true;
        }
        return false;
    }

    check_win(reactor){
        if (this.id_task == 1){
            return check_win1(reactor);
        } else if (this.id_task == 2){
            return check_win2(reactor);
        } else if (this.id_task == 3){
            return check_win3(reactor);
        } else if (this.id_task == 4){
            return check_win4(reactor);
        } else if (this.id_task == 5){
            return check_win5(reactor);
        }else if (this.id_task == 6){
            return check_win6(reactor);
        }
        return false;
    }

    set_type(type, number_task){
        this.type = type;
        showdiv1("game_select_d")
    }

    set_task(id_task){
        get_data_start_task(this.tasks[id_task]['condition']);
        this.win = false;
        this.id_task = id_task;
        this.time_work = 0;
        this.global_time = 0;
        showdivFlex("game_process");
        clear_and_write_text_task(this.tasks[id_task]["text"])
    }
}


function send_win(){
    $.ajax({
    url: '/win_game',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id_task": game.id_task}),
    success: function(json){
        },
    error: function(err) {
        console.error(err);
    }
});
}


function get_data_start_task(condition){
    $.ajax({
        url: `/b/get_data_start/${condition}`,
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            load_data_DB(json);
            console.log(json)
            showdiv1("game_select_d");
            },
        error: function(err) {
            console.error(err);
        }
});
}


function check_win1(reactor){
    console.log(reactor.thermal_power / 1e6 )
    if (reactor.thermal_power / 1e6 >= 10 && reactor.thermal_power / 1e6 < 11){

        return true;
    }
    return false;
}

function check_win2(reactor){
    console.log(reactor.thermal_power / 1e6 )
    if (reactor.thermal_power / 1e6 >= 10 && reactor.thermal_power / 1e6 < 11){
        return true;
    }
    return false;
}


function check_win3(reactor){
    console.log(reactor.thermal_power / 1e6 )
    if (reactor.thermal_power / 1e6 >= 3170 && reactor.thermal_power / 1e6 < 3300){
        return true;
    }
    return false;
}


function check_win4(reactor){
    if (reactor.thermal_power / 1e6 >= 1596 && reactor.thermal_power / 1e6 < 1605){
        return true;
    }
    return false;
}


function check_win5(reactor){
    if (reactor.thermal_power / 1e6 >= 98  && reactor.thermal_power / 1e6 < 103){
        flag = true;
        var k = Object.keys(reactor.gcn);
        for (i = 0; i < k.length; i++){
            if (!(reactor.gcn[k[i]].source_power == 1 || reactor.gcn[k[i]].source_power == 2)){
                return false;
            }
        }
        return true;
    }
    return false;
}


function check_win6(reactor){
    if (reactor.thermal_power / 1e6 >= 20  && reactor.thermal_power / 1e6 < 21){
        return true;
    }
    return false;
}
