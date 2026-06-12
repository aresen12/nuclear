class BS{
    constructor(number){
        this.number = number;
        this.h_braban_s = 10;
        this.v_inBS = 67;
        this.T_H2O = 270;
        this.m_sep = 0;
        this.work = false;
    }

    update(g_gnc1, g_gnc2, pr, T_2_H2O, T_PVS, max_g1){
        this.v_inBS -= g_gnc1 / 3600; // m3
        let m_bs = this.v_inBS * 1000; // кг
        this.m_sep = g_gnc1 * pr; // т / ч
        let m_k = (g_gnc1  - g_gnc1 * pr) / 3.6; // кг / с
        let m_gnc2 = g_gnc2 / 3.6; // кг
        if (this.m_sep > max_g1){
            this.m_sep = max_g1;
            m_k += (this.m_sep - max_g1) / 3.6;
        }
        this.v_inBS += m_k / 1000 + g_gnc2 / 3600;
        this.T_H2O = (m_bs * this.T_H2O + m_k * T_PVS + m_gnc2 * T_2_H2O) / (m_bs + m_k + m_gnc2);
        if (this.v_inBS <= 0){
            this.v_inBS = 0;
            re.gcn[`${this.number}_n`].broken = true;
//            re.gcn[`${this.number}_n`].g = 0;
        }
        this.h_braban_s = this.v_inBS;
//        console.log(this.m_sep, m_k, g_gnc1 / 3600, m_gnc2);
//        Math.sqrt(Math.abs((25 - Math.sqrt(39.0625 - 4 * (this.v_inBS / 66)* (this.v_inBS / 66))) / 2));

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