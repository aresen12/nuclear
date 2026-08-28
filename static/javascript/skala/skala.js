class Skala{
    constructor(){
        this.time = 0;
        this.last_data = {"thermal_power" : 0, "period_power": 0};
        this.thermal_power_g = new Grafi("power", 1, 1e-7* 0.7);
        this.speed_power_g = new Grafi("period_power", 1, 3, 0.5);
        this.speed_power_g.draw_line(this.speed_power_g.canvas.height / 200);
        this.c_e = [];
        this.red_e = [];
    }

    update(){
        this.time += 1;
    }

    load_data(data){

        this.last_data = data;
        let c_e = [];
        if (data["thermal_power"] / 1e6 > 3200){
            c_e.push("alert_power_q");
        }
        if (data["ozr_ar"] > 50 & data["period_power"] > 0){
             c_e.push("m_ozr_ar");
        }
        if (data["ozr"] < 5.78){
             c_e.push("m_ozr");
        }
        if (data["t1"]["obr"] > 3000){
             c_e.push("alert_high_turnovers1");
        }
        if (data["t2"]["obr"] > 3000){
            c_e.push("alert_high_turnovers2");
        }
        if (data["t1"]["w_e"] > 500){
            c_e.push("alert_high_e_power_t1");
        }
        if (data["t2"]["w_e"] > 500){
            my_alert("alert_high_e_power_t2");
            flag = true;
            c_e.push("alert_high_e_power_t2");
        }
        if (data["t1"]["broken"]){
            c_e.push("error_t1");
        }
        if (data["t1"]["broken"]){
            c_e.push("error_t2");
        }
        if (data["T_2_H2O"] >= 260){
            c_e.push("alert_high_temperature2");
        }
        if (data["bs1"]["T_H2O"] > 271){
            c_e.push("alert_high_temperatureBS1");
        }
        if (data["bs2"]["T_H2O"] > 271){
            c_e.push("alert_high_temperatureBS2");
        }
        if (data["bs1"]["v_inBS"] >= 70){
            if (data["bs1"]["v_inBS"] >= 74){
                c_e.push("level_down1");
            }
            c_e.push("h_high_water_level_BS1");
        }
        if (data["bs2"]["v_inBS"] >= 70){
            if (data["bs2"]["v_inBS"] >= 74){
                c_e.push("level_down2");
            }
            c_e.push("h_high_water_level_BS2");
        }
        if(this.az_5){
            my_alert("alert_az_5");
            flag = true;
            c_e.push("alert_az_5");
        }
         if(data["az_b"]){
            c_e.push("alert_baz");
        }
        if(data["az_1"]){
            c_e.push("alert_az_1");
        }
        if(data["az_2"]){
            c_e.push("alert_az_2");
        }
        if (data["bs1"]["v_inBS"] < 66){
            c_e.push("h_lower_water_level_BS1");
        }
        if (data["bs2"]["v_inBS"] < 66){
            c_e.push("h_lower_water_level_BS2");
        }
        if (data["rho_total"] > 0.00055){
            c_e.push("high_rho_total");
        }
        for (let i = 0; i < this.c_e.length; i++){
            if (!c_e.includes(this.c_e[i])){
                save_error(`сигнал снят \n ${errors_list[this.c_e[i]]}`);
            }
        }
        for (let i = 0; i < c_e.length; i++){
            if (!this.c_e.includes(c_e[i])){
                save_error(`${errors_list[c_e[i]]}`);
            }
        }


        this.c_e = c_e;
    }

}




