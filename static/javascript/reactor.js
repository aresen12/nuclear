var CP_WATER = 4400;// Удельная теплоёмкость воды, Дж/(кг·К).
var LH_VAPORIZATION = 1.6e6;// Удельная теплота парообразования, Дж/кг.
var COOLANT_MASS = 150000; // Расчётная масса теплоносителя в контуре, кг.
var FUEL_HEAT_CAPACITY = 2.4e8;// Эффективная теплоёмкость топлива, Дж/К.
var GRAPHITE_HEAT_CAPACITY = 8.5e8;// Эффективная теплоёмкость графита, Дж/К.
var GRAPHITE_DIRECT_HEATING = 0.055;// Доля мощности, непосредственно передаваемая графиту.
var BASE_VOID = 0.15;// Базовая объёмная доля пара.
var BASE_FUEL_TEMP = 270 + 250.0; // Базовая температура топлива, °C.
var BASE_GRAPHITE_TEMP = 270 + 180.0;// Базовая температура графита, °C.
// Параметры нейтронной кинетики.
var BETA = 0.0065;// Полная доля запаздывающих нейтронов.
var LAMBDA_PROMPT = 0.0001;// Время жизни мгновенных нейтронов, с.
// Параметры шести групп запаздывающих нейтронов.
var DELAYED_GROUPS = [
    {"beta": 0.00021, "lambda": 0.0124},
    {"beta": 0.00140, "lambda": 0.0305},
    {"beta": 0.00125, "lambda": 0.1110},
    {"beta": 0.00255, "lambda": 0.3010},
    {"beta": 0.00074, "lambda": 1.1400},
    {"beta": 0.00035, "lambda": 3.0100},
];
// Коэффициенты обратных связей реактивности.
// Коэффициент реактивности по объёмной доле пара.
var ALPHA_VOID = 0.00055;
// Температурный коэффициент реактивности топлива.
var ALPHA_FUEL = -0.000011;
// Температурный коэффициент реактивности графита.
var ALPHA_GRAPHITE = 0.000005;
// Геометрические параметры гидравлической модели.
// Ускорение свободного падения, м/с².
var GRAVITY = 9.80665;
var CHANNEL_COUNT = 1661;  // Количество технологических каналов.
var CORE_HEIGHT = 7.0;  // Высота активной зоны, м.
// Приближённый внутренний диаметр технологического канала, м.
var CHANNEL_DIAMETER = 0.080;

// Абсолютная шероховатость поверхности канала, м.
var CHANNEL_ROUGHNESS = 1.5e-6;
var MIN_PRESSURE = 0.1;// Минимальное давление модели, МПа.
var MAX_PRESSURE = 22.0;// Максимальное давление модели, МПа.
var PRESSURE_TIME_CONSTANT = 8.0;// Характерное время изменения давления, с.
// Параметры барабанов-сепараторов.
// После первого шага значение берётся из BS.v_inBS.
var SEPARATOR_FILL = 0.50;
// Исходный объём воды в одном экземпляре класса BS.
var BS_INITIAL_VOLUME = 67.0;
// Опорные параметры гидравлической модели.
// Номинальный массовый расход, кг/с.
var REFERENCE_FLOW = 10440.0;
// Опорное давление в барабан-сепараторе, МПа.
var REFERENCE_SEPARATOR_PRESSURE = 6.87;
// Опорное давление в напорном коллекторе, МПа.
var REFERENCE_HEADER_PRESSURE = 8.10;
const total_area = (Math.PI * CHANNEL_DIAMETER * CHANNEL_DIAMETER / 4.0) * CHANNEL_COUNT; // Общая площадь 1661 каналов.
// Ограничения паросодержания.
var MIN_VOID = 0.0; // Минимальная объёмная доля пара.
var MAX_VOID = 0.999; // Максимальная объёмная доля пара.


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
        this.p_in_reactor = 6.5; // Давление в реакторном контуре, МПа.
        this.direction = 0; // Направление перемещения стержней.
        this.chosen = []; // Выбранные стержни.
        // ГЦН.
        this.gcn = {
            "1_n": new Pump("1_n", 400),
            "2_n": new Pump("2_n", 400),
            "3_n": new Pump("3_n", 100),
            "4_n": new Pump("4_n", 100),
            "1_a": new Pump("1_a", 400),
            "2_a": new Pump("2_a", 400),
            "3_a": new Pump("3_a", 100),
            "4_a": new Pump("4_a", 100)
        };
        // Дизель-генераторы.
        this.rdg1 = new Rdg("rdg1");
        this.rdg2 = new Rdg("rdg2");
        // Турбины.
        this.t1 = new Turnover("t1");
        this.t2 = new Turnover("t2");
        // Барабаны-сепараторы.
        this.bs1 = new BS(1);
        this.bs2 = new BS(2);
        this.T_2_H2O = 190; // Температура второго контура, °C.
        // Температура кипения при начальном давлении, °C.
        this.t_boil = get_boiling_point(this.p_in_reactor);
        this.temp_in = 270;  // Температура теплоносителя на входе, °C.
        this.thermal_power = 0e6; // Начальная тепловая мощность реактора, Вт.
        this.rho_total = 0; // Суммарная реактивность.
        this.fuel_temp = this.temp_in + 250.0; // Температура топлива/ТВЭЛов, °C.
        this.graphite_temp = this.temp_in + 180.0; // Температура графита, °C.
        this.coolant_temp = this.temp_in; // Средняя температура теплоносителя, °C.
        this.outlet_temp = this.coolant_temp; // Температура теплоносителя на выходе, °C.
        this.void_fraction = 0.15; // Объёмная доля пара.
        this.precursors = []; // Предшественники запаздывающих нейтронов.
        this.speed_SYZ = 1; // Скорость движения СУЗ.
        this.w_e = 0;
        this.ozr = 0;
        this.time = 0;
        this.az = new Az(this); // Аварийная защита.
        this.pause = false;
        // Нагрузки электросети.
        this.power_lep1 = 20000;
        this.power_lep2 = 20000;
        this.water_flow = 0; // Массовый расход теплоносителя, кг/с.
        this.water_flow_m3_s = 0; // Объёмный расход теплоносителя, м³/с.
        this.water_velocity = 0; // Средняя скорость теплоносителя в каналах, м/с.
        this.water_density = 0; // Средняя плотность теплоносителя, кг/м³.
        this.water_viscosity = 0; // Динамическая вязкость теплоносителя, Па·с.
        this.reynolds = 0; // Число Рейнольдса.
        this.friction_factor = 0; // Коэффициент трения Darcy.
        this.pressure_loss = 0; // Потери давления в гидравлическом тракте, МПа.
        this.separator_pressure = 6.5;
        this.tsn = new TSN();
        this.target_pressure = this.p_in_reactor;
        // Предыдущее давление, МПа.
        this.previous_pressure = this.p_in_reactor;
        // Начальное заполнение первого БС.
        this.separator_fill_1 = clamp(this.bs1.v_inBS / BS_INITIAL_VOLUME, 0.0, 1.0); // Начальное заполнение  БС2
        this.separator_fill_2 = clamp(this.bs2.v_inBS / BS_INITIAL_VOLUME, 0.0, 1.0);
        // Включаем исходные насосы.
        this.gcn["1_n"].turn_on_or_down();
        this.gcn["2_n"].turn_on_or_down();
        this.gcn["3_n"].turn_on_or_down();
        // Начальные расходы насосов.
        this.gcn["1_n"].g = 6000;
        this.gcn["3_n"].g = 1200;
        this.gcn["2_n"].g = 0;
        // Рассчитываем ОЗР.
        this.update_ozr();
        this.rdg1.start_ui(); // Запускаем интерфейс первого дизель-генератора.
        // Формируем начальные концентрации предшественников.
        for (let i = 0; i < DELAYED_GROUPS.length;i++) {
            this.precursors.push(
                (DELAYED_GROUPS[i].beta / (LAMBDA_PROMPT * DELAYED_GROUPS[i].lambda)) * this.thermal_power);
        }
        show_mnemo(this);// Инициализируем мнемосхему.
        start_UI(this);
    }


    // Рассчитывает среднее положение стержней.
    update_ozr(){
        this.ozr = 0;
        let k = 0;
        for (let i = 0; i < this.sterg.length; i++){
            for (let j = 0; j < this.sterg[i].length; j++){
                if (this.sterg[i][j] != -1){
                    this.ozr += this.sterg[i][j];
                    k += 1;
                }
            }
        }
        this.ozr /= k;
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
    update_water_flow() {
        // переводим м3/ ч в кг/с
        this.water_flow = (this.gcn["1_n"].g + this.gcn["2_n"].g + this.gcn["1_a"].g + this.gcn["2_a"].g) / 3.6;
    }
    // Обновляет физическое состояние теплоносителя
    // и гидравлические характеристики активной зоны.
    update_hydraulics() {
        this.update_water_flow();
        let temperature = this.coolant_temp;
        // Используем текущее давление реактора.
        let pressure = this.p_in_reactor;
        // Оцениваем плотность жидкой воды.
        // Это reduced-order приближение для текущей модели.
        let liquid_density = 1000.0 - 0.30 * (temperature - 20.0);
        // Учитываем влияние давления на плотность.
        liquid_density *= (1.0 + 0.00002 * (pressure - 0.1));
        // Ограничиваем плотность снизу.
        liquid_density = Math.max(liquid_density, 1.0);
        // Ограничиваем паросодержание.
        let void_fraction = clamp(this.void_fraction, MIN_VOID, MAX_VOID);
        // Оценочная плотность пара.
        // Средняя плотность пароводяной смеси.
        this.water_density = (1.0 - void_fraction) * liquid_density + void_fraction * 35.0;
        // Защищаемся от деления на слишком малую плотность.
        this.water_density = Math.max(this.water_density, 1.0);
        // Оценочная динамическая вязкость смеси.
        this.water_viscosity = 0.00024;
        // Переводим массовый расход в объёмный.
        this.water_flow_m3_s = this.water_flow / this.water_density;
        // Средняя скорость потока в каналах.
        this.water_velocity = this.water_flow_m3_s / total_area;
        // Число Рейнольдса.
        this.reynolds = this.water_density * this.water_velocity * CHANNEL_DIAMETER / this.water_viscosity;
        this.reynolds = Math.max(this.reynolds, 1);
        // Коэффициент трения Дарси.
        if (this.reynolds < 2300) {
            this.friction_factor = 64.0 / this.reynolds;
        } else {
            // Относительная шероховатость канала.
            let relative_roughness = CHANNEL_ROUGHNESS / CHANNEL_DIAMETER;
            // Аппроксимация Хааланда.
            let denominator = -1.8 * Math.log10(Math.pow(relative_roughness / 3.7, 1.11) + 6.9 / this.reynolds);
            this.friction_factor = 1.0 / (denominator * denominator);
        }
        // Динамический напор.
        let dynamic_pressure = 0.5 * this.water_density * this.water_velocity * this.water_velocity;
        // Потери на трение по высоте активной зоны.
        let friction_pressure = this.friction_factor * (CORE_HEIGHT / CHANNEL_DIAMETER) * dynamic_pressure;
        // Гидростатическая составляющая.
        let hydrostatic_pressure = this.water_density * GRAVITY * CORE_HEIGHT;
        // Теоретические локальные потери по активной зоне.
        let physical_loss = friction_pressure + hydrostatic_pressure;
        // Опорный перепад давления всей гидросистемы.
        let reference_pressure_loss = REFERENCE_HEADER_PRESSURE - REFERENCE_SEPARATOR_PRESSURE;
        // Опорная плотность воды для масштабирования.
        let reference_density = 740.0;
        // Опорный объёмный расход.
        let reference_flow_m3_s = REFERENCE_FLOW / reference_density;
        // Опорная скорость.
        let reference_velocity = reference_flow_m3_s / Math.max(total_area, 1e-12);
        // Масштабирование гидравлического сопротивления по rho * v².
        let scaled_system_loss = reference_pressure_loss * (this.water_density / reference_density) * Math.pow(
                this.water_velocity / Math.max(reference_velocity, 1e-12), 2);
        scaled_system_loss = Math.max(0.0, scaled_system_loss);
        this.pressure_loss = scaled_system_loss + physical_loss / 1e6;
    }

    update_pressure() {
        // Расход через первый БС.
        let flow_bs1 = this.gcn["1_n"].g + this.gcn["1_a"].g;
        // Расход через второй БС.
        let flow_bs2 = this.gcn["2_n"].g + this.gcn["2_a"].g;
        // Общий расход.
        let total_bs_flow = flow_bs1 + flow_bs2;        // Среднее давление в БС.
        if (total_bs_flow > 0) {
            this.separator_pressure = (this.bs1.p * flow_bs1 + this.bs2.p * flow_bs2) / total_bs_flow;
        } else {
            this.separator_pressure = (this.bs1.p + this.bs2.p) / 2.0;
        }
        // Среднее заполнение БС.
        let average_separator_fill;
        if (total_bs_flow > 0) {
            average_separator_fill = (this.separator_fill_1 * flow_bs1 + this.separator_fill_2 * flow_bs2)
            / total_bs_flow;
        } else {
            average_separator_fill = (this.separator_fill_1 + this.separator_fill_2) / 2.0;
        }
        // Определяем долю свободного парового пространства.
        let free_steam_fraction = 1.0 - average_separator_fill;
        // Не допускаем нулевого свободного объёма.
        free_steam_fraction = Math.max(free_steam_fraction, 0.02);
        // Характерное время изменения давления.
        let pressure_time_constant = PRESSURE_TIME_CONSTANT * free_steam_fraction;
        pressure_time_constant = Math.max(pressure_time_constant, 0.5);
        // Обновляем гидравлику перед определением
        // нового давления.
        this.update_hydraulics();
        this.target_pressure = this.separator_pressure + this.pressure_loss;
        this.target_pressure = Math.max(this.target_pressure, this.separator_pressure);
        this.previous_pressure = this.p_in_reactor;
        let pressure_derivative = (this.target_pressure - this.p_in_reactor) / pressure_time_constant;
        this.p_in_reactor += pressure_derivative;
        // Ограничиваем расчётный диапазон.
        this.p_in_reactor = clamp(this.p_in_reactor, MIN_PRESSURE, MAX_PRESSURE);
        // Температура кипения изменяется вместе с давлением.
        this.t_boil = get_boiling_point(this.p_in_reactor);
    }

    update() {
        if (this.pause) {
            return;
        }
        this.time += 1;
        this.update_ozr();
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
        // Рассчитываем температуру входа
        // как расходно-взвешенное среднее температур двух БС.
        let flow_bs1 = this.gcn["1_n"].g +  this.gcn["1_a"].g;
        let flow_bs2 = this.gcn["2_n"].g + this.gcn["2_a"].g;
        let total_inlet_flow = flow_bs1 + flow_bs2;
        if (total_inlet_flow > 0) {
            this.temp_in = (this.bs1.T_H2O * flow_bs1 + this.bs2.T_H2O * flow_bs2) / total_inlet_flow;
        }
        this.rho_void = ALPHA_VOID * (this.void_fraction - BASE_VOID) * 100.0;
        this.rho_fuel = ALPHA_FUEL * (this.fuel_temp - BASE_FUEL_TEMP);
        this.rho_graphite = ALPHA_GRAPHITE * (this.graphite_temp - BASE_GRAPHITE_TEMP);

        this.rho_rods = calculate_rods_reactivity(this.ozr); // Реактивность СУЗ.
        // При экстремальном перегреве ослабляем теплосъём
        if (this.fuel_temp > 2400.0) {
            this.rho_fuel *= 0.1;
        }
        this.rho_total = this.rho_rods + this.rho_void + this.rho_fuel + this.rho_graphite; // Суммарная реактивность.
        let dt = 0.001; // Внутренний шаг нейтронной кинетики, с.
        for (let step = 0; step < 1000; step++) {
            let delayed_sum = 0;
            for (let i = 0; i < DELAYED_GROUPS.length; i++) {
                delayed_sum += DELAYED_GROUPS[i].lambda * this.precursors[i];
            }
            let dP_dt = ((this.rho_total - BETA) / LAMBDA_PROMPT) * this.thermal_power + delayed_sum;
            this.thermal_power += dP_dt * dt;
            if (this.thermal_power < 1e4) {
                this.thermal_power = 1e4;
            }
            // Обновляем все группы запаздывающих нейтронов.
            for (let i = 0; i < DELAYED_GROUPS.length; i++) {
                let group = DELAYED_GROUPS[i];
                // Изменение концентрации группы.
                let dC_dt = (group.beta / LAMBDA_PROMPT) * this.thermal_power - group.lambda * this.precursors[i];
                // Интегрируем концентрацию.
                this.precursors[i] += dC_dt * dt;
                // Не допускаем отрицательную концентрацию.
                this.precursors[i] = Math.max(0, this.precursors[i]);
            }
        }
        // Коэффициент теплообмена.
        let heat_transfer_coeff = 3.1e6;
        // При сильном перегреве уменьшаем теплосъём.
        if (this.fuel_temp > 2000.0) {
            heat_transfer_coeff = 0.5e6;
        }
        // Тепловой поток от топлива к теплоносителю.
        let heat_to_water = (this.fuel_temp - this.coolant_temp) * heat_transfer_coeff;
        // Изменение температуры топлива.
        this.fuel_temp += (this.thermal_power * (1.0 - GRAPHITE_DIRECT_HEATING) - heat_to_water) / FUEL_HEAT_CAPACITY;
        // Теплопередача от топлива графиту.
        let graphite_heat_from_fuel = (this.fuel_temp - this.graphite_temp) * 1.8e5;
        // Изменение температуры графита.
        this.graphite_temp += (this.thermal_power *
                GRAPHITE_DIRECT_HEATING + graphite_heat_from_fuel) / GRAPHITE_HEAT_CAPACITY;
        // Нагрев теплоносителя.
        let coolant_heating = heat_to_water / (COOLANT_MASS * CP_WATER);
        // Охлаждение за счёт циркуляции.
        let coolant_cooling = (this.coolant_temp - this.temp_in) * this.water_flow / COOLANT_MASS;
        // Обновляем среднюю температуру воды.
        this.coolant_temp += (coolant_heating - coolant_cooling);
        // Расчёт температуры воды на выходе.
        if (this.water_flow > 1e-9) {
            this.outlet_temp = this.temp_in + heat_to_water / (this.water_flow * CP_WATER);
        } else {
            this.outlet_temp = this.coolant_temp;
        }
        // Рассчитываем текущее гидравлическое состояние.
        this.update_hydraulics();
        // Целевая доля пара.
        let target_void = 0;
        if (this.outlet_temp > this.t_boil) {
            // Энергия выше температуры насыщения.
            let excess_heat = (this.outlet_temp - this.t_boil) * this.water_flow * CP_WATER;
            // Приближённая целевая доля пара.
            target_void = excess_heat / (this.water_flow * LH_VAPORIZATION + 1e5);
            // Ограничиваем долю пара.
            target_void = clamp(target_void, MIN_VOID, MAX_VOID);
            // При кипении температура выхода
            // приближается к температуре насыщения.
            this.outlet_temp = this.t_boil + (this.outlet_temp - this.t_boil) * 0.05;
        }
        // Плавно изменяем паросодержание.
        this.void_fraction += (target_void - this.void_fraction) * 0.4;
        // Ограничиваем паросодержание.
        this.void_fraction = clamp(this.void_fraction, MIN_VOID, MAX_VOID);
        // Двигаем выбранные стержни.
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
        this.bs1.update(this.gcn["1_n"].g, this.gcn["3_n"].g, this.void_fraction, this.T_2_H2O, this.outlet_temp,
            this.t1.g_max, this.gcn["1_a"].g, this.gcn["3_a"].g, this.time);
        this.bs2.update(this.gcn["2_n"].g, this.gcn["4_n"].g, this.void_fraction, this.T_2_H2O, this.outlet_temp,
            this.t2.g_max, this.gcn["2_a"].g, this.gcn["4_a"].g, this.time);
        this.separator_fill_1 = clamp(this.bs1.v_inBS / BS_INITIAL_VOLUME, 0.0, 1.0);
        this.separator_fill_2 = clamp(this.bs2.v_inBS / BS_INITIAL_VOLUME, 0.0, 1.0);
        this.update_hydraulics();
//        this.update_pressure();
        this.t1.update(this.bs1.m_sep, this.p_in_reactor);
        this.t2.update(this.bs2.m_sep, this.p_in_reactor);
        this.tsn.update(this.t1.w_e * 1e3, this.t2.w_e * 1e3, this.t1.obr, this.t2.obr);
        this.update_electrical(); // Обновляем электроснабжение.
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
            alert("Не удалось подключиться. Возможно тут никого нет. Создайте свой реактор, чтобы быть организатором.")
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
