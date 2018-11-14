import {SKIER_SPEED,
    SKIER_SPEED_SCALER_1,
    SKIER_SPEED_SCALER_2,
    SKIER_SPEED_SCALER_3,
    SKIER_SPEED_THRESHOLD_1,
    SKIER_SPEED_THRESHOLD_2,
    EVENTS,
    GAME_HEIGHT, GAME_WIDTH, UTILS} from "../lib/globals.js";

export class Skier {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = SKIER_SPEED;
        this.speedScaler = SKIER_SPEED_SCALER_1;
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
        UTILS.eventEmitter.addListener(EVENTS.INIT_SKIER, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.KEY_LEFT, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.KEY_RIGHT, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.KEY_UP, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.KEY_DOWN, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.SKIER_CRASH, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.GAMEOVER, (event, data) => this.onEvent(event, data));
    }

    onEvent(event, data) {
        switch(event) {
            case EVENTS.INIT_SKIER:
                this.loadAssets();
                break;
            case EVENTS.SKIER_CRASH:
                this.onCrash();
                break;
            case EVENTS.GAMEOVER:
                this.onGameOver();
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

    onGameOver() {
        UTILS.emitEvent(EVENTS.TALLY_SCORE, {rawScore: this.y})
    }
    onCrash() {
        this.direction = 0;
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
        return {
            direction: this.direction,
            skierMapX: this.x,
            skierMapY: this.y
        };
    }
    emitEvent(type, data) {
        UTILS.emitEvent(type, data);
    }

    loadAssets() {
        return UTILS.loadAssets(this.assets)
            .then(loadedAssets => {
                console.log('success loadAssets');
                this.loadedAssets = loadedAssets;
            })
            .catch(err => {
                console.log(`Error loadAssets: ${err}`);
            });
    }
    
    move() {
        switch(this.direction) {
            case 2:
                this.x -= Math.round(this.speed / this.speedScaler);
                this.y += Math.round(this.speed / this.speedScaler);
                this.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
                break;
            case 3:
                this.y += Math.round(this.speed / this.speedScaler);
                this.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
                break;
            case 4:
                this.x += Math.round(this.speed / this.speedScaler);
                this.y += Math.round(this.speed / this.speedScaler);
                this.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
                break;
        }
        if (this.y > 1000 && this.y < SKIER_SPEED_THRESHOLD_1)
            this.speedScaler = SKIER_SPEED_SCALER_2;
        if(this.y > SKIER_SPEED_THRESHOLD_2)
            this.speedScaler = SKIER_SPEED_SCALER_3;
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

    getRect() {
        const skierImage = this.getSkierImage();
        if(!skierImage)
            return;

        return {
            left: this.x + GAME_WIDTH / 2,
            right: this.x + skierImage.width + GAME_WIDTH / 2,
            top: this.y + skierImage.height - 5 + GAME_HEIGHT / 2,
            bottom: this.y + skierImage.height + GAME_HEIGHT / 2
        };
    }

    draw(ctx) {
        const skierImage = this.getSkierImage();
        ctx.drawImage(skierImage, (GAME_WIDTH - skierImage.width) / 2, (GAME_HEIGHT - skierImage.height) / 2, skierImage.width, skierImage.height);
    }
}