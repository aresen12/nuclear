class Grafi{
    constructor(id_canvas, scale_x, scale_y, y=1){
        this.canvas = document.getElementById(id_canvas);
//        this.canvas.style.backgroundColor = "white";
        this.context = this.canvas.getContext("2d");
        this.context.translate(0, this.canvas.height * y);
        this.context.scale(1, -1);
        this.context.stroke();
        this.scale_x = scale_x;
        this.scale_y = scale_y;
        this.background_color = "#b4241b";
        this.line_width = 2;
    }

    draw(new_data, last_data, time, last_time, color=this.background_color){
        this.context.beginPath();
        this.context.moveTo(last_time, new_data * this.scale_y);
        this.context.lineTo(time, last_data * this.scale_y);
        this.context.lineWidth = this.line_width;
        this.context.strokeStyle = color;
        if (time * this.scale_x >= this.canvas.width){
            this.context.translate(this.canvas.width * 0.25, 0);
        }
         this.context.stroke();
    }

    draw_line(y){
        this.context.beginPath();
        this.context.moveTo(this.canvas.width, y);
        this.context.lineTo(0, y);
        this.context.lineWidth = 1;
        this.context.strokeStyle = "#0000ff";
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
        console.log("test")

    }
}