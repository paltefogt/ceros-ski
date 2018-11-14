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
        UTILS.eventEmitter.addListener(EVENTS.GAMEOVER, (event, data) => this.onEvent(event, data));
    }

    onEvent(event, data) {
        switch(event) {
            case EVENTS.INIT_SKIER:
                this.loadAssets();
                break;
            case EVENTS.GAMEOVER:
                this.onGameOver();
                break;
        }
    }

    onGameOver() {
        UTILS.emitEvent(EVENTS.TALLY_SCORE, {rawScore: this.y})
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