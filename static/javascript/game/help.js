class Helper{
    constructor(reactor){
        this.r = reactor;
        this.active_f = false;
    }

    check(){
        if (this.active_f){
            this.update();
        }
    }

    active(){
        this.active_f = !this.active_f;
    }

}


class Viyr extends Helper{
    update(){

    }
}


class Viyb extends Helper{
    update(){
        let bs1_s = this.r.bs1.v_inBS - this.r.bs1.l_v;
        let bs2_s = this.r.bs2.v_inBS - this.r.bs2.l_v;
//        let bs2_pv = reactor.gcn["4_n"].g + reactor.gcn["4_a"].g;
//        let bs1_pv = reactor.gcn["3_n"].g + reactor.gcn["3_a"].g;
console.log(bs1_s);
        if (this.r.bs1.v_inBS < 68 && bs1_s < 0){
             if (!this.r.gcn["3_n"].broken){
                if (this.r.gcn["3_n"].work){
                    this.r.gcn["3_n"].g += 100;
                } else {
                    this.r.gcn["3_n"].turn_on_or_down();
                }
            } else if (!this.r.gcn["3_a"].broken){
                if (this.r.gcn["3_a"].work){
                    this.r.gcn["3_a"].g += 100;
                } else {
                    this.r.gcn["3_a"].turn_on_or_down();
                }
            }
        } else if (this.r.bs1.v_inBS > 72 && bs1_s > 0){
            if (!this.r.gcn["3_n"].broken){
                if (this.r.gcn["3_n"].work && this.r.gcn["3_n"].g > 100){
                    this.r.gcn["3_n"].g -= 100;
                } else {
                    this.r.gcn["3_n"].turn_on_or_down();
                }
            } else if (!this.r.gcn["3_a"].broken){
                if (this.r.gcn["3_a"].work && this.r.gcn["3_a"].g > 100){
                    this.r.gcn["3_a"].g -= 100;
                } else {
                    this.r.gcn["3_a"].turn_on_or_down();
                }
            }
        }


        if (this.r.bs2.v_inBS < 68 && bs2_s < 0){
            if (!this.r.gcn["4_n"].broken){
                if (this.r.gcn["4_n"].work){
                    this.r.gcn["4_n"].g += 100;
                } else {
                    this.r.gcn["4_n"].turn_on_or_down();
                }
            } else if (!this.r.gcn["4_a"].broken){
                if (this.r.gcn["4_a"].work){
                    this.r.gcn["4_a"].g += 100;
                } else {
                    this.r.gcn["4_a"].turn_on_or_down();
                }
            }
        } else if (this.r.bs2.v_inBS > 72 && bs2_s > 0){
            if (!this.r.gcn["4_n"].broken){
                if (this.r.gcn["4_n"].work && this.r.gcn["4_n"].g > 100){
                    this.r.gcn["4_n"].g -= 100;
                } else {
                    this.r.gcn["4_n"].turn_on_or_down();
                }
            } else if (!this.r.gcn["4_a"].broken){
                if (this.r.gcn["4_a"].work && this.r.gcn["4_a"].g > 100){
                    this.r.gcn["4_a"].g -= 100;
                } else {
                    this.r.gcn["4_a"].turn_on_or_down();
                }
            }
        }
    }
}

class Viyt extends Helper{
    update(){

    }
}