class BS{
    constructor(number){
        this.number = number;
        this.h_braban_s = 10;
        this.v_inBS = 66;
        this.T_H2O = 80;
        this.m_sep = 0;
        this.work = false;
    }

    update(g_gnc1, g_gnc2, g, T_2_H2O, T_PVS){
//    g_gnc1 = g_gnc1+g_gnc2+ g_аgnc1
        this.v_inBS -= g_gnc1;
        let m_bs = this.v_inBS * 1000;
        this.m_sep = g * 1438 / 9375;
        let m_k = (g - this.m_sep) * 1000 / 3600;
        let m_gnc2 = g_gnc2 * 1000 / 3600;
        this.v_inBS += m_k / 1000 + g_gnc2;
        this.T_H2O = (m_bs * this.T_H2O - m_k * T_PVS + m_gnc2 * T_2_H2O) / (m_bs - m_k + m_gnc2);
        this.h_braban_s = Math.sqrt(Math.abs((6.25 - Math.sqrt(39.0625 - 4 * (this.v_inBS / 33)* (this.v_inBS / 33))) / 2));
    }

    turn_or_down(){
        this.work = !this.work;
//        ui_power(`APP_${this.id_turnover}_s`, this.work)
    }
}