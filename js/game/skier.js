import {
    SKIER_SPEEDS,
    SKIER_SPEED_SCALERS,
    EVENTS,
    GAME_HEIGHT, GAME_WIDTH, UTILS} from "../lib/globals.js";
import {SkierMovementDecorator} from "./skier.movement.decorator.js";

export class Skier {
    constructor() {
        // this.x = 0;
        // this.y = 0;
        // this.speed = SKIER_SPEED;
        // this.speedScaler = SKIER_SPEED_SCALER_1;
        // this.direction = 5;
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
        UTILS.eventEmitter.addListener(EVENTS.GAMEOVER, (event, data) => this.onEvent(event, data));
    }

    onEvent(event, data) {
        switch(event) {
            case EVENTS.GAMEOVER:
                this.onGameOver();
                break;
        }
    }

    onGameOver() {
        UTILS.emitEvent(EVENTS.TALLY_SCORE, {rawScore: this.y})
    }

    init(configJson) {
        return UTILS.loadAssets(this.assets)
            .then(loadedAssets => {
                this.loadedAssets = loadedAssets;
                return fetch(`./js/game/entity.configs/${configJson}.json`)
                    .then(response => response.json())
                    .then(json => {
                        if(json.type !== 'skier')
                            throw 'ERROR skier.init: json is not type skier';
                        this.x = json.x;
                        this.y = json.y;
                        this.direction = json.direction;
                        this.speed = SKIER_SPEEDS[json.speed];
                        this.speedScaler = SKIER_SPEED_SCALERS[json.speedScaler];
                        json.decorators.forEach(decorator => {
                            this.getDecorator(decorator);
                        });
                    });
            })
            .catch(err => {
                console.log(`Error loadAssets: ${err}`);
            });
    }

    getDecorator(name) {
        switch(name) {
            case 'SkierMovementDecorator':
                this.skierMovement = new SkierMovementDecorator(this);
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

    move() {
        this.skierMovement.move();
    }
}