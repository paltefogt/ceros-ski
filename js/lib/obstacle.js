export class Obstacle {
    constructor(type, img, x, y) {
        this.type = type;
        this.img = img;
        this.x = x;
        this.y = y;
    }
    getRect() {
        return {
            left: this.x,
            right: this.x + this.img.width,
            top: this.y + this.img.height - 5,
            bottom: this.y + this.img.height
        };
    }
}