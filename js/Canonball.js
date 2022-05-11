class Canonball {
    constructor(x, y) {
        var options = {
            isStatic: true
        }
        this.speed = 0.05;
        this.trajectory = [];
        this.r = 30;
        this.body = Bodies.circle(x, y, this.r, options);
        this.img = loadImage("assets/cannonball.png");
        this.animation = [this.img];
        this.isSink = false;
        World.add(world, this.body);
    }
    animate() {
        this.speed += 0.05;
    }

    shoot() {
        var newAngle = cannon.angle - 28;
        newAngle = newAngle * (3.14 / 180);
        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        Matter.Body.setStatic(this.body, false);
        Matter.Body.setVelocity(this.body, {
            x: velocity.x * (180 / 3.14),
            y: velocity.y * (180 / 3.14)
        });
    }
    removeBalls(index) {
        Matter.Body.setVelocity(balls[index].body, { x: 0, y: 0 });
        this.isSink = true;
        this.animation = waterSplashAnimation;
        this.speed = 0.05;
        this.r = 150;
        setTimeout(() => {
            World.remove(world, balls[index].body);
            delete balls[index];
        }, 1000);
    }
    display() {
        var angle = this.body.angle;
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);

        if (this.isSink) {
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            imageMode(CENTER);
            image(this.animation[index], 0, 0, this.r, this.r);
            pop();

        } else {
            push();
            imageMode(CENTER);
            image(this.img, pos.x, pos.y, this.r, this.r);
            pop();
        }

        if (this.body.velocity.x > 0 && this.body.position.x > 300) {
            var position = [this.body.position.x, this.body.position.y];
            this.trajectory.push(position);
        }
        for (let i = 0; i < this.trajectory.length; i++) {
            image(this.img, this.trajectory[i][0], this.trajectory[i][1], 5, 5);

        }

    }
}