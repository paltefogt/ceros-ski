import {
    PLACE_OBSTACLE_ODDS_1,
    PLACE_OBSTACLE_ODDS_2,
    PLACE_OBSTACLE_ODDS_3,
    SKIER_SPEED_SCALERS,
    SKIER_SPEED_THRESHOLDS,
    EVENTS,
    UTILS
} from "../lib/globals.js";

export class SkierMovementDecorator {
    constructor (entity) {
        this.entity = entity;

        UTILS.eventEmitter.addListener(EVENTS.KEY_LEFT, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.KEY_RIGHT, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.KEY_UP, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.KEY_DOWN, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.SKIER_CRASH, (event, data) => this.onEvent(event, data));
    }

    move() {
        switch(this.entity.direction) {
            case 2:
                this.entity.x -= Math.round(this.entity.speed / this.entity.speedScaler);
                this.entity.y += Math.round(this.entity.speed / this.entity.speedScaler);
                UTILS.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
                break;
            case 3:
                this.entity.y += Math.round(this.entity.speed / this.entity.speedScaler);
                UTILS.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
                break;
            case 4:
                this.entity.x += Math.round(this.entity.speed / this.entity.speedScaler);
                this.entity.y += Math.round(this.entity.speed / this.entity.speedScaler);
                UTILS.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
                break;
        }
        if (this.entity.y > 1000 && this.entity.y < SKIER_SPEED_THRESHOLDS.SKIER_SPEED_THRESHOLD_1)
            this.entity.speedScaler = SKIER_SPEED_SCALERS.SKIER_SPEED_SCALER_2;
        if(this.entity.y > SKIER_SPEED_THRESHOLDS.SKIER_SPEED_THRESHOLD_2)
            this.entity.speedScaler = SKIER_SPEED_SCALERS.SKIER_SPEED_SCALER_3;
    }

    onEvent(event, data) {
        switch(event) {
            case EVENTS.SKIER_CRASH:
                this.onCrash();
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

    onCrash() {
        this.entity.direction = 0;
    }
    onKeyLeft() {
        if(this.entity.direction === 1) {
            this.entity.x -= this.entity.speed;
            UTILS.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
        }
        else {
            this.entity.direction === 0 ? this.entity.direction = 1 : --this.entity.direction;
        }
    }
    onKeyRight() {
        if(this.entity.direction === 5) {
            this.entity.x += this.entity.speed;
            UTILS.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
        }
        else {
            this.entity.direction === 0 ? this.entity.direction = 5 : ++this.entity.direction;
        }
    }
    onKeyUp() {
        if(this.entity.direction === 1 || this.entity.direction === 5) {
            this.entity.y -= this.entity.speed;
            UTILS.emitEvent(EVENTS.PLACE_NEW_OBSTACLE, this.getNewObstacleData());
        }
    }
    onKeyDown() {
        this.entity.direction = 3;
    }

    getNewObstacleData() {
        let odds;
        switch(this.entity.speedScaler) {
            case SKIER_SPEED_SCALERS.SKIER_SPEED_SCALER_1:
                odds = PLACE_OBSTACLE_ODDS_1;
                break;
            case SKIER_SPEED_SCALERS.SKIER_SPEED_SCALER_2:
                odds = PLACE_OBSTACLE_ODDS_2;
                break;
            case SKIER_SPEED_SCALERS.SKIER_SPEED_SCALER_3:
                odds = PLACE_OBSTACLE_ODDS_3;
                break;
        }
        return {
            direction: this.entity.direction,
            skierMapX: this.entity.x,
            skierMapY: this.entity.y,
            odds: odds
        };
    }
}