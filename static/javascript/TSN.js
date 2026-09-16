class TSN{
    constructor(){
        this.w_e = 0;
        this.n = 3000; // частота

    }

    update(t1_e, t2_e, t1_obr, t2_obr){
        this.w_e = 0;
        if (t2_obr == this.n){
            this.w_e += t2_e;
        }
        if (t1_obr == this.n){
            this.w_e += t1_e;
        }
    }
}