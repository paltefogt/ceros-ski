import {SKIER_SPEED, SKIER_SPEED_SCALER, EVENTS} from "../lib/config.js";
import {Utils} from "../lib/utils.js";

export class Skier {
    constructor(subject, x, y) {
        this.subject = subject;

        this.x = x;
        this.y = y;
        this.speed = SKIER_SPEED;
        this.speedScaler = SKIER_SPEED_SCALER;
        this.direction = 5;
        this.assets = {
            skierCrash: 'img/skier_crash.png',
            skierLeft: 'img/skier_left.png',
            skierLeftDown: 'img/skier_left_down.png',
            skierDown: 'img/skier_down.png',
            skierRightDown: 'img/skier_right_down.png',
            skierRight: 'img/skier_right.png'
        };
        this.loadedAssets = {};

        // event listeners
        this.subject.addListener(EVENTS.INIT_SKIER, (event, data) => this.onEvent(event, data));
        this.subject.addListener(EVENTS.KEY_LEFT, (event, data) => this.onEvent(event, data));
        this.subject.addListener(EVENTS.KEY_RIGHT, (event, data) => this.onEvent(event, data));
        this.subject.addListener(EVENTS.KEY_UP, (event, data) => this.onEvent(event, data));
        this.subject.addListener(EVENTS.KEY_DOWN, (event, data) => this.onEvent(event, data));
    }

    onEvent(event, data) {
        switch(event) {
            case EVENTS.INIT_SKIER:
                this.loadAssets();
                break;
            case EVENTS.KEY_LEFT:
                this.onKeyLeft();
                break;
            case EVENTS.KEY_RIGHT:
                this.onKeyRight();
                break;
            case EVENTS.KEY_UP:
                this.onKeyUp();
                break;
            case EVENTS.KEY_DOWN:
                this.onKeyDown();
                break;
        }
    }

    onKeyLeft() {
        if(this.direction === 1) {
            this.x -= this.speed;
            this.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
        }
        else {
            this.direction === 0 ? this.direction = 1 : --this.direction;
        }
    }
    onKeyRight() {
        if(this.direction === 5) {
            this.x += this.speed;
            this.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
        }
        else {
            this.direction === 0 ? this.direction = 5 : ++this.direction;
        }
    }
    onKeyUp() {
        if(this.direction === 1 || this.direction === 5) {
            this.y -= this.speed;
            this.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
        }
    }
    onKeyDown() {
        this.direction = 3;
    }

    getNewObstacleData() {
        const utils = new Utils();
        return {
            direction: this.direction,
            skierMapX: this.x,
            skierMapY: this.y,
            gameWidth: utils.gameWidth,
            gameHeight: utils.gameHeight
        };
    }
    emitEvent(type, data) {
        this.subject.emit(type, data);
    }

    loadAssets() {
        const utils = new Utils();
        return utils.loadAssets(this.assets)
            .then(loadedAssets => {
                console.log('success loadAssets');
                this.loadedAssets = loadedAssets;
            })
            .catch(err => {
                console.log(`Error loadAssets: ${err}`);
            });
    }
    
    move() {
        const utils = new Utils();
        //direction, skierMapX, skierMapY, gameWidth, gameHeight
        const data = {
            direction: this.direction,
            skierMapX: this.x,
            skierMapY: this.y,
            gameWidth: utils.gameWidth,
            gameHeight: utils.gameHeight
        };
        switch(this.direction) {
            case 2:
                this.x -= Math.round(this.speed / this.speedScaler);
                this.y += Math.round(this.speed / this.speedScaler);
                this.subject.emit(EVENTS.PLACE_NEW_OBSTACLE, data);
                break;
            case 3:
                this.y += Math.round(this.speed / this.speedScaler);
                this.subject.emit(EVENTS.PLACE_NEW_OBSTACLE, data);
                break;
            case 4:
                this.x += Math.round(this.speed / this.speedScaler);
                this.y += Math.round(this.speed / this.speedScaler);
                this.subject.emit(EVENTS.PLACE_NEW_OBSTACLE, data);
                break;
        }
    }

    getSkierAsset() {
        let skierAssetName = '';
            switch(this.direction) {
                case 0:
                    skierAssetName = 'skierCrash';
                    break;
                case 1:
                    skierAssetName = 'skierLeft';
                    break;
                case 2:
                    skierAssetName = 'skierLeftDown';
                    break;
                case 3:
                    skierAssetName = 'skierDown';
                    break;
                case 4:
                    skierAssetName = 'skierRightDown';
                    break;
                case 5:
                    skierAssetName = 'skierRight';
                    break;
            }
            return skierAssetName;
        };
    getSkierImage() {
        return this.loadedAssets[this.getSkierAsset()];
    }

    getRect(gameWidth, gameHeight) {
        const skierImage = this.getSkierImage();
        return {
            left: this.x + gameWidth / 2,
            right: this.x + skierImage.width + gameWidth / 2,
            top: this.y + skierImage.height - 5 + gameHeight / 2,
            bottom: this.y + skierImage.height + gameHeight / 2
        };
    }

    draw(ctx) {
        const utils = new Utils();
        const skierImage = this.getSkierImage();
        ctx.drawImage(skierImage, (utils.gameWidth - skierImage.width)/2, (utils.gameHeight - skierImage.height)/2, skierImage.width, skierImage.height);
    }
}