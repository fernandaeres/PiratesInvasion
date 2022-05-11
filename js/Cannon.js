class Cannon{
    constructor(x,y,width,height,angle){
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.angle = angle;
        this.cannonimg = loadImage("assets/canon.png");
        this.baseimg = loadImage("assets/cannon_base.png");
    }
    display(){
        console.log(this.angle);
        if (keyIsDown(RIGHT_ARROW) && this.angle <65) {
           this.angle += 1; 
        }
        if (keyIsDown(LEFT_ARROW) && this.angle >-36) {
            this.angle -= 1;
        }
        //cano do canhão
        push();
        translate(this.x,this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.cannonimg,0,0,this.w,this.h);
        pop();
        //base do canhão
        image(this.baseimg,70,20,200,200)
    }
}