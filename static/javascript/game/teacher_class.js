
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
        } else if (this.step == 3){
            alert_block("up_direction_btn");
            if(this.reactor.direction == 1){
                this.next();
            }
        }else if (this.step == 8 && this.reactor.chosen.length >= 3){
          if (this.reactor.chosen.length == 26){
                this.clear_toolip();
                add_tolip("p_syz",
            `Теперь можешь извлекать стержни ручного регулирования (РР) серые.
            <button class="btn btn-game btn-warning" onclick="game.teacher.clear_toolip();">Хорошо</button>`,
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
            add_tolip("p_syz", "Выберите красные и желтые стержни", "p_syz_toolip");
            this.toolip.push("p_syz_toolip");
        } else if (this.step == 3){
            this.clear_toolip();
            alert_block("up_direction_btn");
            add_tolip("up_direction_btn", "Нажмите для извлечения", "up_direction_btn_toolip");
            this.toolip.push("up_direction_btn_toolip");
        } else if (this.step == 4){
            this.clear_toolip();
            add_tolip("up_direction", `Стержни будут извлекаться до тех пор, пока вы не отмените извлечение повторным нажатием на кнопку "извлек"(опускание работает по той же схеме).
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`,
             "up_direction_toolip", false);
            this.toolip.push("up_direction_toolip");
        }else if (this.step == 5){
            this.clear_toolip();
            add_tolip("m4_4", `На этом табло показывается % погружения стержней в активную зону и их расположение.
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`, "mnemo_sel_toolip");
            this.toolip.push("mnemo_sel_toolip");
        } else if (this.step == 6){
            this.clear_toolip();
            add_tolip("w_q_r", `СФКРЭ показывает тепловую мощность реактора в МВт.
             <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`, "w_q_r_toolip", false);
            this.toolip.push("w_q_r_toolip");
            console.log("w_q")
        } else if (this.step == 7){
            this.clear_toolip();
            add_tolip("w_q_r",
            `Если реактивность меньше 0, реакция деления затухает(мощность падает), если больше, то возрастает.
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`,
             "w_q_r_toolip", false);
            this.toolip.push("w_q_r_toolip");
        }else if (this.step == 8){
            this.clear_toolip();
            add_tolip("p_syz",
            `Начинай извлекать стержни, пока реактивность не станет больше 0. Извлеки все цветные стрежни кроме серых.
            <button class="btn btn-game btn-warning" onclick="game.teacher.clear_toolip();">Хорошо</button>`,
             "p_syz_toolip");
            this.toolip.push("p_syz_toolip");
        } else if (this.step == 9){
            this.clear_toolip();
            add_tolip("ar_cont",
            `<div style="width: 120px;">Здесь ты можешь включить автоматический регулятор. Он будет пытаться поддерживать мощность с помощью синих стержней
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>
            </div>`,
             "ar_cont_toolip");
            this.toolip.push("ar_cont_toolip");
        } else if (this.step == 10){
            this.clear_toolip();
            add_tolip("az_btn_cont",
            `Если что-то пойдет не по плану, ты можешь вызвать аварийную защиту, которая заглушит реактор.
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`,
             "az_btn_cont_toolip", false);
            this.toolip.push("az_btn_cont_toolip");
        }else if (this.step == 11){
            this.clear_toolip();
            add_tolip("pumps_up_cont",
            `Если будешь увеличивать мощность больше 20 МВт, тебе придется увеличивать расход теплоносителя. Все нужные параметры ты найдешь в справке.
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`,
             "pumps_up_cont_toolip");
            this.toolip.push("pumps_up_cont_toolip");
        } else if (this.step == 12){
            this.clear_toolip();
            display_q_next();
        } else if (this.step == 13){
            display_viyb_info();
        } else if (this.step == 14){
            display_gcn_info();
        } else if (this.step == 15){
            display_pvs_info();
        } else if (this.step == 16){
            showdiv1('game_select_d');
            add_tolip("canvas_cont",
            `Здесь представлена схема трубопроводов и насосов.
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`,
             "canvas_cont_toolip", false);
            this.toolip.push("canvas_cont_toolip");
        }else if (this.step == 17){
            this.clear_toolip();
            add_tolip("bs1_cont",
            `Пытайтесь поддерживать уровень воды в БС (H БС) в диапазоне от 67 до 70.
            <button class="btn btn-game btn-warning" onclick="game.teacher.next()">Дальше</button>`,
             "bs1_cont_toolip", false);
            this.toolip.push("bs1_cont_toolip");
        }else if (this.step == 18){
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
const hints_json = {
"mode_kom": "Вы обесточили сервоприводы стержней. Стержни должны падать в реактор под действием силы тяжести, чтобы уменьшить мощность.",
  "down_direction": "Стержни опускаются в реактор (мощность должна падать).",
  "up_direction": "Стержни извлекаются из реактора (мощность должна расти).",
  "m_ozr": "Малый ОЗР. Вы вытащили слишком много стержней.",
  "m_ozr_ar": "ЛАР не справляется, нужно опускать стержни ручного регулирования.",
  "high_speed_power": "Мощность растёт слишком быстро.",
  "azs_on": "Включена аварийная защита по скорости роста мощности в пусковом диапазоне (до 700 МВт).",
  "azsr_on": "Включена аварийная защита по скорости роста мощности в рабочем диапазоне (от 700 МВт до 3200 МВт).",
  "azs_turn_down": "Выключена аварийная защита по скорости роста мощности в пусковом диапазоне",
  "azsr_turn_down": "Выключена аварийная защита по скорости роста мощности в рабочем диапазоне",
  "alert_az_5": "Сработала АЗ-5",
  "alert_az_1": "Сработала АЗ-1",
  "alert_az_2": "Сработала АЗ-2",
  "alert_baz": "Сработала быстродействующая аварийная защита.",
  "alert_power_q": "Высокая тепловая мощность. Номинальная мощность 3200 МВт.",
  "1_n_error": "ГЦН1 сломан. Вода в БС1 наверное закончилась.",
  "2_n_error": "ГЦН2 сломан. Вода в БС2 наверное закончилась.",
  "h_high_water_level_BS2": "Высокий уровень воды в БС2, нужно уменьшать расход ПЭН2.",
  "h_high_water_level_BS1": "Высокий уровень воды в БС1, нужно уменьшать расход ПЭН1.",
  "h_lower_water_level_BS2": "Низкий уровень воды в БС2, нужно увеличивать расход ПЭН2.",
  "h_lower_water_level_BS1": "Низкий уровень воды в БС1, нужно увеличивать расход ПЭН1.",
  "alert_high_temperature2": "Высокая температура в конденсаторах турбин.",
  "alert_high_temperatureBS2": "Высокая температура в БС2.",
  "alert_high_temperatureBS1": "Высокая температура в БС1.",
  "2_n_turn_down": "Главный циркуляционный насос №2 отключен.",
  "3_n_turn_down": "Питательный насос(для бс 1) отключен.",
  "4_n_turn_down": "Питательный насос(для бс 2) отключен.",
  "1_n_turn_down": "Главный циркуляционный насос №1 отключен.",
  "tk_broke": "Разрыв технологических каналов (Часть воды не доходит до реактора), нужно запускать САОР и МПА.",
  "mpa": "Максимальная проектная авария. Глушите реактор!",
  "saor": "Сработала система аварийного охлаждения реактора.",
  "bs2_level_up": "Уровень воды в БС № 2 растёт.",
  "bs1_level_up": "Уровень воды в БС № 1 растёт.",
  "alert_high_e_power_t1": "Турбина 1 вырабатывает слишком много энергии.",
  "alert_high_turnovers1": "Турбина 1 вращается слишком быстро.",
  "alert_high_turnovers2": "Турбина 2 вращается слишком быстро.",
  "alert_high_e_power_t2": "Турбина 2 вырабатывает слишком много энергии.",
  "error_t1": "Сломана Турбина 1.",
  "error_t2": "Сломана Турбина 2.",
  "turn_down_rdg2": "Вы отключили резервный дизель генератор № 2.",
  "turn_down_rdg1": "Вы отключили резервный дизель генератор № 1.",
  "turn_down_t2": "Турбина N2 остановлена.",
  "turn_down_t1": "Турбина N1 остановлена.",
  "m_down_t1": "Турбина 1 остановилась, из-за нехватки пара.",
  "m_down_t2": "Турбина 1 остановилась, из-за нехватки пара.",
  "rdg1_broken": "Резервный дизель генератор № 1 сломан.",
  "rdg2_broken": "Резервный дизель генератор № 2 сломан.",
  "lep1_broken": "Обрыв линии электропередач. Нужно глушить реактор.",
  "lep2_broken": "Обрыв резервной линии электропередач. Нужно глушить реактор.",
  "tsn_broken": "Сломан Трансформатор собственных нужд. Подключайте РДГ.",
  "e_h": "Вы потребляете больше энергии чем вырабатываете.",
  "ar_broken": "Автоматический регулятор сломан.",
  "alert_az": "Сработала локальная аварийная защита.",
  "high_rho_total": "Реакция деления возрастает слишком быстро. Вводите стержни!",
  "azs": "Сигнализация аварийной защиты по скорости в пусковом диапазоне.",
  "ar_turn_down": "Автоматический регулятор отключен."
}

//addEventListener("click", (event) => {
//
//    if (game.type == 1){
//     console.log("test_click",game.teacher.step )
//            if (game.teacher.step == 4 || game.teacher.step == 5 || game.teacher.steps == 6)
//                game.teacher.next()
//    }
//});