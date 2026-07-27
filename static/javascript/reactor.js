var THERMAL_POWER_NOMINAL = 3200e6;  // # Вт
var CP_WATER = 4400;  // Дж/(кг*K)
var LH_VAPORIZATION = 1.6e6;  // Дж/кг (Удельная теплота испарения)
var COOLANT_MASS = 150000;  // кг воды в контуре
var FUEL_HEAT_CAPACITY = 2.4e8;  // Дж/K
var GRAPHITE_HEAT_CAPACITY = 8.5e8; // # Дж/K
var GRAPHITE_DIRECT_HEATING = 0.055;  //# 5.5% энергии идет в графит
var BASE_VOID = 0.15;
var BASE_FUEL_TEMP = 270 + 250.0;
var BASE_GRAPHITE_TEMP = 270 + 180.0;
// НЕЙТРОНЫ ТАМ ЧТО ТО КИНЕТИКА
BETA = 0.0065;
LAMBDA_PROMPT = 0.0001;
var DELAYED_GROUPS = [
    {"beta": 0.00021, "lambda": 0.0124},
    {"beta": 0.00140, "lambda": 0.0305},
    {"beta": 0.00125, "lambda": 0.1110},
    {"beta": 0.00255, "lambda": 0.3010},
    {"beta": 0.00074, "lambda": 1.1400},
    {"beta": 0.00035, "lambda": 3.0100},
];

var ALPHA_VOID = 0.00055;
var ALPHA_FUEL = -0.000011;
var ALPHA_GRAPHITE = 0.000005;


class Reactor{
    constructor(){
        this.sterg = [
        [-1, -1, 100, 100, 100, 100, 100, -1, -1],
        [-1, 100, 100, 0, 0, 0, 100, 100, -1],
        [100, 100, 0, 100, 0, 100, 0, 100, 100],
        [100, 0, 100, 0, 0, 0, 100, 0, 100],
        [100, 0, 0, 0, 100, 0, 0, 0, 100],
        [100, 0, 100, 0, 0, 0, 100, 0, 100],
        [100, 100, 0, 100, 0, 100, 0, 100, 100],
        [-1, 100, 0, 0, 0, 0, 0, 100, -1],
        [-1, -1, 100, 100, 100, 100, 100, -1, -1]]
        this.p_in_reactor = 6.5;
        this.direction = 0; // -1 - down 1 - up
        this.chosen = []; // выбранные стержни
        // насосы
        this.gcn = {
            "1_n": new Pump("1_n", 400),
            "2_n": new Pump("2_n", 400),
            "3_n": new Pump("3_n", 100),
            "4_n": new Pump("4_n", 100),
            "1_a": new Pump("1_a", 400),
            "2_a": new Pump("2_a", 400),
            "3_a": new Pump("3_a", 100),
            "4_a": new Pump("4_a", 100),
        }
        this.rdg1 = new Rdg("rdg1");
        this.rdg2 = new Rdg("rdg2"); // Резервные дизель генераторы
        this.t1 = new Turnover("t1");
        this.t2 = new Turnover("t2");
        this.bs1 = new BS(1);
        this.bs2 = new BS(2); //
        this.T_2_H2O = 190; // температура во втором контуре
        this.t_boil = this.get_boiling_point(this.p_in_reactor)
        this.temp_in = 270; // прописать для случая с одним БС
        this.thermal_power = 0e6;
        this.rho_total = 0;
        this.fuel_temp = this.temp_in + 250.0;
        this.graphite_temp = this.temp_in + 180.0;
        this.coolant_temp = this.temp_in;
        this.outlet_temp = this.coolant_temp;
        this.void_fraction = 0.15;
        this.precursors = [];
        this.gcn["1_n"].turn_on_or_down();
        this.gcn["2_n"].turn_on_or_down();
        this.gcn["3_n"].turn_on_or_down();
        this.gcn["1_n"].g = 6000;
        this.gcn["3_n"].g = 1200;
        this.gcn["2_n"].g = 0;
        this.speed_SYZ = 1;
        this.w_e = 0;
        this.ozr = 0;
        this.time = 0;
        this.az = new Az(this); // класс аварийной защиты
        this.pause = false;
        this.update_ozr();
        this.power_lep1 = 20000;
        this.power_lep2 = 20000; // КВТ
        this.rdg1.start_ui();
        for (let i = 0; i < DELAYED_GROUPS.length; i++){
            this.precursors.push((DELAYED_GROUPS[i]["beta"] / (LAMBDA_PROMPT * DELAYED_GROUPS[i]["lambda"])) * this.thermal_power);
        }
        show_mnemo(this);
        start_UI(this);

    }

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
//        ui_direction(this.direction);
    }

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



    set_s_position(i, j, direction){
        if (direction == 1){
            if (this.sterg[i][j] - this.speed_SYZ >= 0){
                this.sterg[i][j] -= this.speed_SYZ;
            }
        } else {
            if (this.sterg[i][j] + this.speed_SYZ <= 100){
                this.sterg[i][j] += this.speed_SYZ;
            }
        }
        show_mnemo_i_j(this.sterg[i][j], i, j)
    }

    set_speed_SYZ(speed){
        this.speed_SYZ = speed;
        ui_speed_SYZ(speed);
    }

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

    chosen_add(i, j){
        chosen(i, j, true);
        this.chosen.push([i, j]);
        socket.emit("method_send", {"room": room_id, "function": "chosen_add_show", "i": i, "j": j});

    }

    chosen_delete(i2){
        chosen(this.chosen[i2][0], this.chosen[i2][1], false);
        this.chosen.splice(i2, 1);

        }


     get_boiling_point(p_mpa){
        return 179.9 + p_mpa * 14.3;
    }

    calculate_rods_reactivity(){
        let rad = Math.PI * (this.ozr / 100.0);
        let eff = 0.5 * (1.0 - Math.cos(rad));
        return 0.018 * (0.52 - eff);
    }

    calculate_power_use(){
        let w_use = {
            1: {"w": this.rdg1.power_e, "consumer":[]},
            2: {"w": this.rdg2.power_e, "consumer":[]},
            3: {"w": this.power_lep1, "consumer":[]},
            4: {"w": this.power_lep1, "consumer":[]}
         }
         var k = Object.keys(this.gcn);
         for (i = 0; i < k.length; i++){
            w_use[this.gcn[k[i]].source_power]["w"] -= this.gcn[k[i]].w_e;
            w_use[this.gcn[k[i]].source_power]["consumer"].push(k[i]);
        }
        return w_use;
    }

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

     update(){
        if (this.pause) {
            return;
        }
        this.time += 1;
         this.update_ozr();
         this.az.update();
         if (this.az.az_run){
            this.direction = 0;
         }
         this.rdg1.update();
         this.rdg2.update();
         var k = Object.keys(this.gcn);
        for (i = 0; i < k.length; i++){
            this.gcn[k[i]].update();
        }
         this.temp_in = (this.bs1.T_H2O * (this.gcn["1_n"].g + this.gcn["1_a"].g) + this.bs2.T_H2O * (this.gcn["2_n"].g + this.gcn["2_a"].g)) / ((this.gcn["1_n"].g + this.gcn["2_n"].g + this.gcn["1_a"].g + this.gcn["2_a"].g));
         this.rho_void = ALPHA_VOID * (this.void_fraction - BASE_VOID) * 100.0;
         this.rho_fuel = ALPHA_FUEL * (this.fuel_temp - BASE_FUEL_TEMP);
        this.rho_graphite = ALPHA_GRAPHITE * (this.graphite_temp - BASE_GRAPHITE_TEMP);
        this.rho_rods = this.calculate_rods_reactivity();
        if (this.fuel_temp > 2400.0){
            this.rho_fuel *= 0.1;
        }
        let water_flow = (this.gcn["1_n"].g + this.gcn["2_n"].g + this.gcn["1_a"].g + this.gcn["2_a"].g) / 3.6;
        this.rho_total = this.rho_rods + this.rho_void + this.rho_fuel + this.rho_graphite;
         // 2. НЕЙТРОННАЯ КИНЕТИКА (Интегрирование лавины)
        let dt = 0.001;
        for (let _ = 0; _ < 1000; _++){
            let delayed_sum = 0;
            for (let i = 0; i < DELAYED_GROUPS.length; i++){
                delayed_sum += DELAYED_GROUPS[i]["lambda"] * this.precursors[i];
            }
            let dP_dt = ((this.rho_total - BETA) / LAMBDA_PROMPT) * this.thermal_power + delayed_sum;
            this.thermal_power += dP_dt * dt;
            if (this.thermal_power < 1e4){
                this.thermal_power = 1e4;
            }
            for (let i = 0; i < DELAYED_GROUPS.length; i++){
                let dC_dt = (DELAYED_GROUPS[i]["beta"] / LAMBDA_PROMPT) * this.thermal_power - DELAYED_GROUPS[i]["lambda"] * this.precursors[i];
                this.precursors[i] += dC_dt * dt;
             }
         }

        // 3. ТЕПЛООБМЕН (При экстремальном перегреве теплосъем деградирует)

        let heat_transfer_coeff = 3.1e6;
        if (this.fuel_temp > 2000.0){
            heat_transfer_coeff = 0.5e6;
        }
        let heat_to_water = (this.fuel_temp -this.coolant_temp) * heat_transfer_coeff;

        // Нагрев урана и графита
        this.fuel_temp += ((this.thermal_power * (1.0 - GRAPHITE_DIRECT_HEATING) - heat_to_water) / FUEL_HEAT_CAPACITY);
        let graphite_heat_from_fuel = (this.fuel_temp - this.graphite_temp) * 1.8e5;
        this.graphite_temp += ((this.thermal_power * GRAPHITE_DIRECT_HEATING + graphite_heat_from_fuel) / GRAPHITE_HEAT_CAPACITY);

        // 4. ТЕРМОДИНАМИКА ТЕПЛОНОСИТЕЛЯ (Расход и Давление — строгие константы)
        let coolant_heating = heat_to_water / (COOLANT_MASS * CP_WATER);
        let coolant_cooling = ((this.coolant_temp - this.temp_in) * water_flow / COOLANT_MASS);
        this.coolant_temp += (coolant_heating - coolant_cooling);

        // Выходная температура
        this.outlet_temp = this.temp_in + (heat_to_water / (water_flow * CP_WATER));
        let target_void = 0.0;
        // Фазовый переход
        if (this.outlet_temp > this.t_boil){
            let excess_heat = (this.outlet_temp - this.t_boil) * water_flow * CP_WATER
            target_void = Math.min(1.0, excess_heat / (water_flow * LH_VAPORIZATION + 1e5))
            this.outlet_temp = this.t_boil + (this.outlet_temp - this.t_boil) * 0.05;
            }
        // Сглаживание инерции пара
        this.void_fraction += (target_void - this.void_fraction) * 0.4;
         if (this.direction != 0){
            for (let i = 0; i < this.chosen.length; i++){
                this.set_s_position(this.chosen[i][0], this.chosen[i][1], this.direction);
            }
         }
         if ( this.t1.direction != 0){
             this.t1.set_g_max();
        }
        if ( this.t2.direction != 0){
             this.t2.set_g_max();
        }
         this.bs1.update(this.gcn["1_n"].g, this.gcn["3_n"].g, this.void_fraction, this.T_2_H2O, this.outlet_temp, this.t1.g_max, this.gcn["1_a"].g, this.gcn["3_a"].g,);
          this.bs2.update(this.gcn["2_n"].g, this.gcn["4_n"].g, this.void_fraction, this.T_2_H2O, this.outlet_temp,  this.t1.g_max, this.gcn["2_a"].g, this.gcn["4_a"].g);
         this.t1.update(this.bs1.m_sep, this.p_in_reactor);
         this.t2.update(this.bs2.m_sep, this.p_in_reactor);
         this.update_electrical();
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

    update(){
        this.az.update();
         if (this.az.az_run){
            this.direction = 0;
         }
    }
}
