import {BaseObject} from "./base.object";

export class SkierObject extends BaseObject {
    constructor(x, y) {
        super(x, y);
        this.direction = 5;
        this.speed = 0;
        this.skierCrash = 'img/skier_crash.png';
        this.skierLeft = 'img/skier_left.png';
        this.skierLeftDown = 'img/skier_left_down.png';
        this.skierDown = 'img/skier_down.png';
        this.skierRightDown = 'img/skier_right_down.png';
        this.skierRight = 'img/skier_right.png';
    }
    
    move() {
        switch(this.direction) {
            case 2:
                this.x -= Math.round(this.speed / 1.4142);
                this.y += Math.round(this.speed / 1.4142);

                placeNewObstacle(this.direction);
                break;
            case 3:
                this.y += this.speed;

                placeNewObstacle(this.direction);
                break;
            case 4:
                this.x += this.speed / 1.4142;
                this.y += this.speed / 1.4142;

                placeNewObstacle(this.direction);
                break;
        }
    }
}