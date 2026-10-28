// Ограничивает значение заданным диапазоном.
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


// Возвращает температуру насыщения воды
// при заданном давлении.
function get_saturation_temperature(pressure_mpa) {
    var pressure = clamp(
        pressure_mpa,
        MIN_PRESSURE,
        MAX_PRESSURE
    );

    // Табличные значения для рабочего диапазона.
    // Используются для устойчивого расчёта в браузере.
    var table = [
        [0.10, 45.8],
        [0.20, 120.2],
        [0.50, 151.8],
        [1.00, 179.9],
        [2.00, 212.4],
        [3.00, 233.9],
        [4.00, 250.4],
        [5.00, 263.9],
        [6.00, 275.6],
        [6.50, 280.9],
        [6.87, 284.7],
        [7.00, 285.8],
        [8.00, 295.0],
        [9.00, 303.3],
        [10.00, 311.0],
        [12.00, 324.6],
        [14.00, 337.7],
        [16.00, 349.5],
        [18.00, 358.9],
        [20.00, 365.8],
        [22.00, 373.0]
    ];
    if (pressure <= table[0][0]) {
        return table[0][1];
    }

    for (var i = 1; i < table.length; i++) {
        if (pressure <= table[i][0]) {
            var p1 = table[i - 1][0];
            var t1 = table[i - 1][1];
            var p2 = table[i][0];
            var t2 = table[i][1];

            var fraction =
                (pressure - p1) /
                (p2 - p1);

            return (
                t1 +
                fraction * (t2 - t1)
            );
        }
    }

    return table[table.length - 1][1];
}


// Возвращает температуру кипения
// при текущем давлении.
function get_boiling_point(p_mpa) {
    return get_saturation_temperature(p_mpa);
}


// Рассчитывает реактивность от среднего положения СУЗ.
function calculate_rods_reactivity(ozr) {
    var rad = Math.PI * (ozr / 100.0);
    var eff = 0.5 * (1.0 - Math.cos(rad));
    return (0.018 * (0.52 - eff));
}


class Reactor {
    constructor() {
        // Матрица положения регулирующих стержней.
        this.sterg = [
            [-1, -1, 100, 100, 100, 100, 100, -1, -1],
            [-1, 100, 100, 0, 0, 0, 100, 100, -1],
            [100, 100, 0, 100, 0, 100, 0, 100, 100],
            [100, 0, 100, 0, 0, 0, 100, 0, 100],
            [100, 0, 0, 0, 100, 0, 0, 0, 100],
            [100, 0, 100, 0, 0, 0, 100, 0, 100],
            [100, 100, 0, 100, 0, 100, 0, 100, 100],
            [-1, 100, 0, 0, 0, 0, 0, 100, -1],
            [-1, -1, 100, 100, 100, 100, 100, -1, -1]
        ];
        this.power_lep1 = 20000;
        this.power_lep2 = 20000;
        this.physical = new Modal1();
        this.direction = 0; // Направление перемещения стержней.
        this.chosen = []; // Выбранные стержни.
        // ГЦН.
        this.gcn = {
            "1_n": new Pump("1_n", 400, "ГЦН1"),
            "2_n": new Pump("2_n", 400, "ГЦН2"),
            "3_n": new Pump("3_n", 100, "ПЭН1"),
            "4_n": new Pump("4_n", 100, "ПЭН2"),
            "1_a": new Pump("1_a", 400, "НОАП"),
            "2_a": new Pump("2_a", 400, "НОНП"),
            "3_a": new Pump("3_a", 100, "АПЭН1"),
            "4_a": new Pump("4_a", 100, "АПЭН2")
        };
        // Дизель-генераторы.
        this.rdg1 = new Rdg("rdg1");
        this.rdg2 = new Rdg("rdg2");
        // Турбины.
        this.t1 = new Turnover("t1");
        this.t2 = new Turnover("t2");
        // Барабаны-сепараторы.
        this.bs1 = new BS(1, true);
        this.bs2 = new BS(2);
        this.T_2_H2O = 190; // Температура второго контура, °C.
        // Температура кипения при начальном давлении, °C.
        this.speed_SYZ = 1; // Скорость движения СУЗ.
        this.ozr = 0;
        this.time = 0;
        this.az = new Az(this); // Аварийная защита.
        this.pause = false;
        // Нагрузки электросети.
        this.tsn = new TSN();
        this.target_pressure = this.p_in_reactor;
        // Включаем исходные насосы.
        this.gcn["1_n"].turn_on_or_down();
        this.gcn["2_n"].turn_on_or_down();
        this.gcn["3_n"].turn_on_or_down();
        // Начальные расходы насосов.
        this.gcn["1_n"].g = 6000;
        this.gcn["3_n"].g = 1200;
        this.gcn["2_n"].g = 0;
        // Рассчитываем ОЗР.
//        this.update_ozr();
        this.rdg1.start_ui(); // Запускаем интерфейс первого дизель-генератора.
        show_mnemo(this);// Инициализируем мнемосхему.
        start_UI(this);
    }


    // Переключает движение СУЗ вверх.
    set_unset_up_direction() {
        if (!this.az.power_SYZ){
            return;
        }
        if (this.direction == 1){
            this.direction = 0;
            stop_alert("up_direction")
        } else {
            this.direction = 1;
            my_alert("up_direction")
        }
    }

    // Переключает движение СУЗ вниз.
    set_unset_down_direction() {
        if (this.direction == -1){
            this.direction = 0;
            stop_alert("down_direction");
        } else {
            this.direction = -1;
            my_alert("down_direction");
        }
//        ui_direction(this.direction);
    }


    // Изменяет положение конкретного стержня.
    set_s_position(i, j, direction) {
        if (direction == 1) {
            if (this.sterg[i][j] - this.speed_SYZ >= 0) {
                this.sterg[i][j] -= this.speed_SYZ;
            }
        } else {
            if (this.sterg[i][j] + this.speed_SYZ <= 100) {
                this.sterg[i][j] += this.speed_SYZ;
            }
        }
        show_mnemo_i_j(this.sterg[i][j], i, j);
    }


    // Устанавливает скорость движения СУЗ.
    set_speed_SYZ(speed) {
        this.speed_SYZ = speed;
        ui_speed_SYZ(speed);
    }

    // Выбирает или снимает выбор со стержня.
    chosen_current(i, j){
        for (let i2 = 0; i2 < this.chosen.length; i2++){
            if (this.chosen[i2][0] == i && this.chosen[i2][1] == j){
                this.chosen_delete(i2);
                socket.emit("method_send", {"room": room_id, "function": "chosen_delete", "i": i, "j": j});
                return;
            }
        }
        this.chosen_add(i, j);
    }

    // Добавляет стержень в список выбранных.
    chosen_add(i, j){
        chosen(i, j, true);
        this.chosen.push([i, j]);
        socket.emit("method_send", {"room": room_id, "function": "chosen_add_show", "i": i, "j": j});
    }


    // Удаляет стержень из списка выбранных.
    chosen_delete(i2){
        chosen(this.chosen[i2][0], this.chosen[i2][1], false);
        this.chosen.splice(i2, 1);
    }

    // Рассчитывает электропотребление.
    calculate_power_use(){
        let w_use = {
            1: {"w": this.rdg1.power_e, "consumer":[]},
            2: {"w": this.rdg2.power_e, "consumer":[]},
            3: {"w": this.power_lep1, "consumer":[]},
            4: {"w": this.power_lep1, "consumer":[]},
            5: {"w": this.tsn.w_e, "consumer":[]}
         }
         var k = Object.keys(this.gcn);
         for (i = 0; i < k.length; i++){
            w_use[this.gcn[k[i]].source_power]["w"] -= this.gcn[k[i]].w_e;
            w_use[this.gcn[k[i]].source_power]["consumer"].push(k[i]);
        }
        return w_use;
    }

    // Отключает насосы при недостатке электрической мощности.
    update_electrical(){
        let w_use = this.calculate_power_use();
        for (i = 1; i <=  Object.keys(w_use).length; i++){
            if (w_use[i]["w"] < 0){
                for (let j = w_use[i]["consumer"].length - 1; j >= 0; j--){
                    if (this.gcn[w_use[i]["consumer"][j]].work){
                        w_use[i]["w"] += this.gcn[w_use[i]["consumer"][j]].w_e;
                        this.gcn[w_use[i]["consumer"][j]].turn_on_or_down();
                    }
                    if (w_use[i]["w"] >= 0){
                        break;
                    }
                }
            }
        }
    }
    unset_chosen(){
        let b_chosen = this.chosen.length;
        for (let i = 0; i < b_chosen; i++){
            this.chosen_delete(0);
        }
    }

    check_broke(){
        if (this.bs1.v_inBS > 100){
            this.t1.break_t()
        }
        if (this.bs2.v_inBS > 100){
            this.t2.break_t()
        }
        if (this.bs1.T_H2O > 271){
//            this.gcn["1_n"].broken = true;
        }if (this.bs2.T_H2O > 271){
//            this.gcn["2_n"].broken = true;
        }
    }

    update() {
        if (this.pause) {
            return;
        }
        this.time += 1;
        this.az.update(); // Обновляем аварийную защиту.
        if (this.az.az_run) {
            this.direction = 0;
        }
        // Обновляем дизель-генераторы.
        this.rdg1.update();
        this.rdg2.update();
        // Обновляем насосы.
        let pump_keys = Object.keys(this.gcn);
        for (let i = 0; i < pump_keys.length; i++) {
            this.gcn[pump_keys[i]].update();
        }
        this.physical.update(this.gcn, this.sterg, this.bs1.T_H2O, this.bs2.T_H2O);
        // Рассчитываем температуру входа
        // как расходно-взвешенное среднее температур двух БС.
        if (this.direction != 0) {
            for (let i = 0; i < this.chosen.length; i++) {
                this.set_s_position(this.chosen[i][0], this.chosen[i][1], this.direction);
            }
        }
        if (this.t1.direction != 0) {
            this.t1.set_g_max();
        }
        if (this.t2.direction != 0) {
            this.t2.set_g_max();
        }
        this.bs1.update(this.gcn["1_n"].g, this.gcn["3_n"].g, this.physical.void_fraction, this.physical.T_2_H2O, this.physical.outlet_temp,
            this.t1.g_max, this.gcn["1_a"].g, this.gcn["3_a"].g, this.time);
        this.bs2.update(this.gcn["2_n"].g, this.gcn["4_n"].g, this.physical.void_fraction, this.physical.T_2_H2O, this.physical.outlet_temp,
            this.t2.g_max, this.gcn["2_a"].g, this.gcn["4_a"].g, this.time);
        this.t1.update(this.bs1.m_sep, this.physical.p_in_reactor);
        this.t2.update(this.bs2.m_sep, this.physical.p_in_reactor);
        this.tsn.update(this.t1.w_e * 1e3, this.t2.w_e * 1e3, this.t1.obr, this.t2.obr);
        this.update_electrical(); // Обновляем электроснабжение.
        this.check_broke();
        setup_UI(this);
        rc.update();
    }
}


class RemoteControl extends Reactor{
    constructor(){
        super();
        this.az = new DAz(this);
        this.t1 = new DTurnover("t1");
        this.t2 = new DTurnover("t2");
        this.rdg1 = new DRdg("rdg1");
        this.rdg2 = new DRdg("rdg2");
        this.gcn = {
            "1_n": new DPump("1_n"),
            "2_n": new DPump("2_n"),
            "3_n": new DPump("3_n"),
            "4_n": new DPump("4_n"),
            "1_a": new DPump("1_a"),
            "2_a": new DPump("2_a"),
            "3_a": new DPump("3_a"),
            "4_a": new DPump("4_a"),
        }
    }
    chosen_delete(i2){
        send_chosen_delete(i2);
    }

    set_unset_up_direction(){
        socket.emit("method_send", {"room": room_id, "function": "set_unset_up_direction"});
    }

    set_unset_down_direction(){
        socket.emit("set_unset_down_direction", {"room": room_id});
    }

    chosen_current(i, j){
        socket.emit("chosen_current", {"i": i, "j": j, "room": room_id});
    }

    set_speed_SYZ(speed){
        socket.emit("set_speed_SYZ", {"speed": speed, "room": room_id});
        ui_speed_SYZ(speed);
    }

    update(){
        this.time++;
        if (!rc.connect_flag && this.time - rc.start_connect_time >= 3 && rc.wait){
            rc.wait = false;
            alert("Возможно тут никого нет. Делаем вас организатором этой комнаты.")
            window.location.href = `/b/${room_id}`;
        }
        this.bs1.grafiti.init_UI(this.bs1.condition, this.time);
        this.bs2.grafiti.init_UI(this.bs2.condition, this.time);
        this.az.update();
        setup_UI(this);
         if (this.az.az_run){
            this.direction = 0;
         }
    }
}
