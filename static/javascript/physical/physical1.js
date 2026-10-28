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
var REFERENCE_FLOW = 10440.0;
// Абсолютная шероховатость поверхности канала, м.
var CHANNEL_ROUGHNESS = 1.5e-6;
var MIN_PRESSURE = 0.1;// Минимальное давление модели, МПа.
var MAX_PRESSURE = 22.0;// Максимальное давление модели, МПа.
var PRESSURE_TIME_CONSTANT = 8.0;// Характерное время изменения давления, с.
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


class Modal1 {
    constructor() {
        this.p_in_reactor = 6.5; // Давление в реакторном контуре, МПа.
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
        this.ozr = 0;
        // Нагрузки электросети.
        this.water_flow = 0; // Массовый расход теплоносителя, кг/с.
        this.water_flow_m3_s = 0; // Объёмный расход теплоносителя, м³/с.
        this.water_velocity = 0; // Средняя скорость теплоносителя в каналах, м/с.
        this.water_density = 0; // Средняя плотность теплоносителя, кг/м³.
        this.water_viscosity = 0; // Динамическая вязкость теплоносителя, Па·с.
        this.reynolds = 0; // Число Рейнольдса.
        this.friction_factor = 0; // Коэффициент трения Darcy.
        this.pressure_loss = 0; // Потери давления в гидравлическом тракте, МПа.
        this.separator_pressure = 6.5;
        this.target_pressure = this.p_in_reactor;
        // Предыдущее давление, МПа.
        this.previous_pressure = this.p_in_reactor;
        // Начальное заполнение первого БС.
        // Рассчитываем ОЗР.
        // Формируем начальные концентрации предшественников.
        for (let i = 0; i < DELAYED_GROUPS.length;i++) {
            this.precursors.push(
                (DELAYED_GROUPS[i].beta / (LAMBDA_PROMPT * DELAYED_GROUPS[i].lambda)) * this.thermal_power);
        }
    }

    update_water_flow(gcn) {
        // переводим м3/ ч в кг/с
        this.water_flow = (gcn["1_n"].g + gcn["2_n"].g + gcn["1_a"].g + gcn["2_a"].g) / 3.6;
    }
    // Обновляет физическое состояние теплоносителя
    // и гидравлические характеристики активной зоны.

     update_ozr(sterg){
        let ozr = 0;
        let k = 0;
        for (let i = 0; i < sterg.length; i++){
            for (let j = 0; j < sterg[i].length; j++){
                if (sterg[i][j] != -1){
                    ozr += sterg[i][j];
                    k += 1;
                }
            }
        }
        this.ozr = ozr /= k
        return this.ozr;
    }

     update_hydraulics(gcn) {
        this.update_water_flow(gcn);
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


    update(gcn, roads, bs1_t, bs2_t) {
        // Рассчитываем температуру входа
        // как расходно-взвешенное среднее температур двух БС.
        this.update_hydraulics(gcn);
        let flow_bs1 = gcn["1_n"].g +  gcn["1_a"].g;
        let flow_bs2 = gcn["2_n"].g + gcn["2_a"].g;
        let total_inlet_flow = flow_bs1 + flow_bs2;
        if (total_inlet_flow > 0) {
            this.temp_in = (bs1_t * flow_bs1 + bs2_t * flow_bs2) / total_inlet_flow;
        }
//        console.log(this.temp_in);
//
        this.rho_void = ALPHA_VOID * (this.void_fraction - BASE_VOID) * 100.0;
        this.rho_fuel = ALPHA_FUEL * (this.fuel_temp - BASE_FUEL_TEMP);
        this.rho_graphite = ALPHA_GRAPHITE * (this.graphite_temp - BASE_GRAPHITE_TEMP);
        this.rho_rods = calculate_rods_reactivity(this.update_ozr(roads)); // Реактивность СУЗ.
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
    }
}
