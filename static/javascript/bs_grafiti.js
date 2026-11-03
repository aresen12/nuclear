class BSGrafiti extends Grafi{
    constructor(id_canvas, id_bs, left=false){
        super(id_canvas);
        this.background_color = "green";
        this.scale_x = 1;
        this.scale_y = 1;
        this.id_bs = id_bs;
        this.line_width = 2;
        this.left = left;
        this.last_data = {"1": false, "2": false, "3": false, "4": false};
        this.context.font = '10px Arial';
        if(left){
           this.context.scale(-1, 1);
           this.context.translate(-this.canvas.width, 0 );
        }
//        this.init_UI();
    }

    draw_circle(){
        this.context.beginPath();
        this.context.strokeStyle = "green";
        this.context.arc(160, 60, 20, 0, 2 * Math.PI);
        this.context.stroke();
    }

    draw_text(text, x, y, color="green"){
        this.context.save();
        if (!this.left){
            this.context.scale(-1, 1);
            this.context.rotate(180 * Math.PI / 180);
        } else{
             this.context.rotate(180 * Math.PI / 180);
             x*= -1;
        }
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.stroke();
        this.context.restore();
    }

    init_UI(condition, time){
//        if (condition == this.last_data){
//            for (let i = 1; i < 5; i++){
//                if (condition[`${i}`]){
//                    break;
//                }
//            }
//            return;
//        }
        this.last_data = condition;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw_circle();
        // на ТГ
        this.draw(78, 92, 190, 160);
        this.draw(92, 92, 270, 190);
        //
        this.draw(42, 30, 190, 160);
        this.draw(42, 30, 135, 160);

//
        this.draw(85, 55, 30, 30, "blue");
        this.draw(95, 90, 85, 85);
        this.draw(78, 92, 85, 154);
// Турбина
        this.draw(70, 97, 270, 270);
        this.draw(70, 97, 340, 340);
        this.draw(97, 97, 270, 340);
        this.draw(70, 70, 270, 340);
//        this.draw(42, 30, 135, 160);
        if(condition["1"]){
            if (time % 2 == 0){
                this.draw(40, 40, 135, 95, "red");
                this.draw(90, 40, 20, 20, "red");
                this.draw(40, 40, 20, 85, "red");
                this.draw(90, 90, 20, 85, "red");
            }
        } else {
            this.draw(40, 40, 135, 95);
            this.draw(90, 40, 20, 20);
            this.draw(40, 40, 20, 85);
            this.draw(90, 90, 20, 85);
        }
        if(condition["2"] ){
            if (time % 2 == 0){
                this.draw(20, 20, 135, 85, "red");
                this.draw(95, 20, 10, 10, "red");
                this.draw(20, 20, 10, 75, "red");
                this.draw(95, 95, 10, 85, "red");
            }
        } else {
            this.draw(20, 20, 135, 85);
            this.draw(95, 20, 10, 10);
            this.draw(20, 20, 10, 75);
            this.draw(95, 95, 10, 85);
        }
        this.draw(20, 40, 135, 135);
        // ПН
        if(condition["3"]){
            if (time % 2 == 0){
            this.draw(40, 40, 190, 235, "red");
            }
        } else {
            this.draw(40, 40, 190, 235);
        }
        // АПН
        if(condition["4"]){
            if (time % 2 == 0){
                this.draw(20, 20, 190, 255, "red");
             }
        } else {
            this.draw(20, 20, 190, 255);
        }
        this.draw(20, 40, 190, 190);

        this.draw_text(`БС${this.id_bs}`, 160, -60);
        this.draw_text(`ГЦН${this.id_bs}`, 85, -58);
        this.draw_text(`АГЦН${this.id_bs}`, 65, -5);
        this.draw_text(`АПН${this.id_bs}`, 240, -5);
        this.draw_text(`ПЭН${this.id_bs}`, 222, -50);
        this.draw_text(`Турбина${this.id_bs}`, 302, -85);
        if (!this.left){
            this.draw_text(`ТОР`, 12, -70, "white");

        } else {
            this.draw_text(`РЕАК`, 12, -70, "white");
        }
        this.draw_circle2(80, 18);
        this.draw_circle2(90, 40);
        this.draw_circle2(240, 40);
        this.draw_circle2(260, 20);
    }

    draw_circle2(x, y){
        this.context.beginPath();
     this.context.strokeStyle = "green";
    this.context.ellipse(x, y, 10, 5, 90 * Math.PI / 180, 0, 2 * Math.PI);
    this.context.stroke();
    }
}