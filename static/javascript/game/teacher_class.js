
class Teacher{
    constructor(reactor){
        this.step = 0;
        this.toolip = [];
        this.update_step();
        this.reactor = reactor;
    }

    update(){
        if (this.step == 2){
            alert_block("p_syz");
            if (this.reactor.chosen.length != 0){
                this.next();
            }
        } else if (this.step == 3 && this.reactor.direction == 1){
            this.next();
        }else if (this.step == 7 && this.reactor.chosen.length >= 3){
            if ((this.reactor.chosen.length >= 3 && this.reactor.chosen.length < 4) || this.reactor.chosen.length >= 27){
                this.clear_toolip();
            } else if (this.reactor.chosen.length == 26){
                this.clear_toolip();
                console.log(this.toolip);
                add_tolip("p_syz",
            "Теперь можешь извлекать стержни Ручного регулирования(РР серые)",
             "p_syz_toolip");
             this.toolip.push("p_syz_toolip");
            }
            if (this.reactor.rho_total > 0 || this.reactor.thermal_power / 1e6 > 5){
                this.next();
            }
        }
    }

    update_step(){
        if (this.step == 0){
            display_hi();
            get_data_start_teach();
        } else if (this.step == 1){
            display_syz_info()
        } else if (this.step == 2){
            alert_block("p_syz");
            document.getElementById("game_select_d").style.display = "none";
            add_tolip("p_syz", "Вберите красные и желтые стержни", "p_syz_toolip");
            this.toolip.push("p_syz_toolip");
        } else if (this.step == 3){
            this.clear_toolip();
            add_tolip("up_direction_btn", "Нажмите для извлечения", "up_direction_btn_toolip");
            this.toolip.push("up_direction_btn_toolip");
        } else if (this.step == 4){
            this.clear_toolip();
            add_tolip("mnemo_sel", "На этом табло показывается положение стержней в зоне в процентах. Кликни на меня, для продолжения", "mnemo_sel_toolip");
            this.toolip.push("mnemo_sel_toolip");
        } else if (this.step == 5){
            this.clear_toolip();
            add_tolip("w_q_r", "СФКРЭ показывает тепловую мощность реактора в МВт. Кликни на меня, для продолжения", "w_q_r_toolip", false);
            this.toolip.push("w_q_r_toolip");
            console.log("w_q")
        } else if (this.step == 6){
            this.clear_toolip();
            add_tolip("w_q_r",
            "Если реактивность меньше 0, реакция деления затухает(мощность падает), если больше, то возрастает. Кликни на меня, для продолжения",
             "w_q_r_toolip", false);
            this.toolip.push("w_q_r_toolip");
        }else if (this.step == 7){
            this.clear_toolip();
            add_tolip("p_syz",
            "Начинай извлекать стержни, пока реактивность не станет больше 0, извлеки все цветные стрежни кроме серых",
             "p_syz_toolip");
            this.toolip.push("p_syz_toolip");
        } else if (this.step == 8){
            this.clear_toolip();
            add_tolip("ar_cont",
            "Здесь ты можешь включить автоматический регулятор. Он будет пытаться поддерживать мощность с помощью синих стержней",
             "ar_cont_toolip");
            this.toolip.push("ar_cont_toolip");
        } else if (this.step == 9){
            this.clear_toolip();
            add_tolip("az_btn_cont",
            "Если что-то пойдет не по плану, ты можешь вызвать аварийную защиту, которая заглушит реактор. Кликни на меня, для продолжения",
             "az_btn_cont_toolip", false);
            this.toolip.push("az_btn_cont_toolip");
        }else if (this.step == 10){
            this.clear_toolip();
            add_tolip("pumps_up_cont",
            "Если будешь увеличивать мощность больше 20 МВт, тебе придется увеличивать расход теплоносителя. Все нужные параметры, ты найдешь в справке Кликни на меня, для продолжения",
             "pumps_up_cont_toolip");
            this.toolip.push("pumps_up_cont_toolip");
        } else if (this.step == 11){
            this.clear_toolip();
            display_q_next();
        } else if (this.step == 12){
            display_viyb_info();
        } else if (this.step == 13){
            display_gcn_info();
        } else if (this.step == 14){
            display_pvs_info();
        } else if (this.step == 15){
            showdiv1('game_select_d');
            add_tolip("canvas_cont",
            "Здесь схематически представлена схема трубопроводов и насосов.  Кликни на меня, для продолжения",
             "canvas_cont_toolip", false);
            this.toolip.push("canvas_cont_toolip");
        }else if (this.step == 16){
            this.clear_toolip();
            add_tolip("bs1_cont",
            "Пытайтесь поддерживать уровень в БС в диапазоне от 67 до 70.  Кликни на меня, для продолжения",
             "bs1_cont_toolip", false);
            this.toolip.push("bs1_cont_toolip");
        }else if (this.step == 17){
            this.clear_toolip();
        }
    }

    next(){
        this.step++;
        this.update_step();
    }

    clear_toolip(){
        for (let i = 0; i < this.toolip.length; i++){
            delete_toolip(this.toolip[i]);
        }
        this.toolip = [];
    }
}


//addEventListener("click", (event) => {
//
//    if (game.type == 1){
//     console.log("test_click",game.teacher.step )
//            if (game.teacher.step == 4 || game.teacher.step == 5 || game.teacher.steps == 6)
//                game.teacher.next()
//    }
//});