class BSGrafiti extends Grafi{
    constructor(id_canvas, id_bs){
        super(id_canvas);
        this.background_color = "green";
        this.scale_x = 1;
        this.scale_y = 1;
        this.id_bs = id_bs;
        this.line_width = 2;
//        this.init_UI();
    }

    draw_circle(){
    this.context.beginPath();
     this.context.strokeStyle = "green";
    this.context.arc(95, 60, 20, 0, 2 * Math.PI);
    this.context.stroke();
    }

    draw_text(text, x, y){
        this.context.save();
        this.context.rotate(180 * Math.PI / 180);
        this.context.scale(-1, 1);
        this.context.font = '10px Arial';
        this.context.fillStyle = this.background_color;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(text, x, y);
        this.context.stroke();
        this.context.restore();
    }

    init_UI(condition, time){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw_circle();
        // на ТГ
        this.draw(78, 92, 120, 100);
        this.draw(92, 92, 120, 140);
        //
        this.draw(42, 30, 120, 100);
        this.draw(42, 30, 70, 85);
        if(condition["1"]){
            if (time % 2 == 0){
                this.draw(40, 40, 70, 40, "red");
            }
        } else {
            this.draw(40, 40, 70, 40);
        }
        if(condition["2"] ){
            if (time % 2 == 0){
                this.draw(20, 20, 70, 30, "red");
            }
        } else {
            this.draw(20, 20, 70, 30);
        }
        this.draw(20, 40, 70, 70);
        // ПН
        if(condition["3"]){
            if (time % 2 == 0){
            this.draw(40, 40, 150, 120, "red");
            }
        } else {
            this.draw(40, 40, 150, 120);
        }
        // АПН
        if(condition["4"]){
            if (time % 2 == 0){
                this.draw(20, 20, 165, 120, "red");
             }
        } else {
            this.draw(20, 20, 165, 120);
        }
        this.draw(20, 40, 120, 120);
        this.draw_text(`БС${this.id_bs}`, 95, -60);
        this.draw_text(`ГЦН${this.id_bs}`, 40, -58);
        this.draw_text(`АГЦН${this.id_bs}`, 50, -5);
        this.draw_text(`АПН${this.id_bs}`, 140, -5);
        this.draw_text(`ПЭН${this.id_bs}`, 132, -50);
        this.draw_circle2(25, 18);
        this.draw_circle2(35, 40);
        this.draw_circle2(155, 40);
        this.draw_circle2(170, 20);
    }

    draw_circle2(x, y){
        this.context.beginPath();
     this.context.strokeStyle = "green";
    this.context.ellipse(x, y, 10, 5, 90 * Math.PI / 180, 0, 2 * Math.PI);
    this.context.stroke();
    }
}