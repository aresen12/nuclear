class BS{
    constructor(number){
        this.number = number;
        this.h_braban_s = 10;
        this.v_inBS = 67;
        this.T_H2O = 270;
        this.m_sep = 0;
        this.work = false;
        this.grafiti = new BSGrafiti(`bs${this.number}`, this.number);
        this.condition = {"1": false, "2": false, "3": false, "4": false};
        this.p = 6.5;
    }

    update(g_gnc, g_pen, pr, T_2_H2O, T_PVS, max_g1, a_gcn, a_pen, time){
        this.v_inBS -= (g_gnc + a_gcn) / 3600; // m3
        let m_bs = this.v_inBS * 1000; // кг
        this.m_sep = (g_gnc + a_gcn) * pr; // т / ч
        let m_k = ((g_gnc + a_gcn)   - (g_gnc + a_gcn)  * pr) / 3.6; // кг / с
        let m_gnc2 = (g_pen + a_pen) / 3.6; // кг
        if (this.m_sep > max_g1){
            this.m_sep = max_g1;
            m_k += (this.m_sep - max_g1) / 3.6;
        }
        this.v_inBS += m_k / 1000 + (g_pen + a_pen) / 3600;
        this.T_H2O = (m_bs * this.T_H2O + m_k * T_PVS + m_gnc2 * T_2_H2O) / (m_bs + m_k + m_gnc2);
        if (this.v_inBS <= 0){
            this.v_inBS = 0;
            re.gcn[`${this.number}_n`].broken = true;
//            re.gcn[`${this.number}_n`].g = 0;
        }
        this.h_braban_s = this.v_inBS;
//        console.log(this.m_sep, m_k, g_gnc1 / 3600, m_gnc2);
//        Math.sqrt(Math.abs((25 - Math.sqrt(39.0625 - 4 * (this.v_inBS / 66)* (this.v_inBS / 66))) / 2));
        this.grafiti.init_UI(this.condition, time);
        this.p = get_saturation_pressure(this.T_H2O);
    }


    level_down(){
        this.v_inBS -= 0.25;
        this.h_braban_s = this.v_inBS;
    }

    turn_or_down(){
        this.work = !this.work;
//        ui_power(`APP_${this.id_turnover}_s`, this.work)
    }
}


// Возвращает давление насыщения воды
// при заданной температуре.
function get_saturation_pressure(temperature_c) {
    var temperature = temperature_c;
    // Табличные значения для рабочего диапазона.
    var table = [
        [151.8, 0.50],
        [179.9, 1.00],
        [212.4, 2.00],
        [233.9, 3.00],
        [250.4, 4.00],
        [263.9, 5.00],
        [275.6, 6.00],
        [280.9, 6.50],
        [284.7, 6.87],
        [285.8, 7.00],
        [295.0, 8.00],
        [303.3, 9.00],
        [311.0, 10.00],
        [324.6, 12.00],
        [337.7, 14.00],
        [349.5, 16.00],
        [358.9, 18.00],
        [365.8, 20.00],
        [373.0, 22.00]
    ];
    if (temperature <= table[0][0]) {
        return table[0][1];
    }
    for (var i = 1; i < table.length; i++) {
        if (temperature <= table[i][0]) {
            var t1 = table[i - 1][0];
            var p1 = table[i - 1][1];
            var t2 = table[i][0];
            var p2 = table[i][1];
            var fraction = (temperature - t1) / (t2 - t1);
            return (p1 + fraction * (p2 - p1));
        }
    }
    return table[table.length - 1][1];
}
