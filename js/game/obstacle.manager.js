import {Obstacle} from "./obstacle.js";
import {EVENTS, GAME_WIDTH, GAME_HEIGHT, UTILS} from "../lib/globals.js";

export class ObstacleManager {
    constructor() {
        UTILS.eventEmitter.addListener(EVENTS.PLACE_NEW_OBSTACLE, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.SKIER_CRASH, (event, data) => this.onEvent(event, data));

        this.obstacleTypes = [
            'tree',
            'treeCluster',
            'rock1',
            'rock2'
        ];
        this.assets = {
            tree: 'img/tree_1.png',
            treeCluster: 'img/tree_cluster.png',
            rock1: 'img/rock_1.png',
            rock2: 'img/rock_2.png',
        };
        this.loadedAssets = {};

        this.obstacles = [];
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

    onEvent(event, data) {
        switch(event) {
            case EVENTS.PLACE_NEW_OBSTACLE:
                this.placeNewObstacle(data.direction, data.skierMapX, data.skierMapY, data.odds);
                break;
            case EVENTS.SKIER_CRASH:
                this.onSkierCrash(data.obstacleIndex);
                break;
        }
    }

    onSkierCrash(obstacleIndex) {
        this.obstacles.splice(obstacleIndex, 1);
    }
    placeInitialObstacles() {
        const self = this;
        const numberObstacles = Math.ceil(_.random(5, 7) * (GAME_WIDTH / 800) * (GAME_HEIGHT / 500));

        const minX = -50;
        const maxX = GAME_WIDTH + 50;
        const minY = GAME_HEIGHT / 2 + 100;
        const maxY = GAME_HEIGHT + 50;

        for(let i = 0; i < numberObstacles; i++) {
            this.placeRandomObstacle(minX, maxX, minY, maxY);
        }

        this.obstacles = _.sortBy(this.obstacles, obstacle => {
            const obstacleImage = self.loadedAssets[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    }

    drawObstacles(ctx, skierMapX, skierMapY) {
        const self = this;
        const newObstacles = [];
        _.each(this.obstacles, function(obstacle) {
            const obstacleImage = self.loadedAssets[obstacle.type];
            const x = obstacle.x - skierMapX - obstacleImage.width / 2;
            const y = obstacle.y - skierMapY - obstacleImage.height / 2;

            if(x < -100 || x > GAME_WIDTH + 50 || y < -100 || y > GAME_HEIGHT + 50) {
                return;
            }

            ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
        });

        this.obstacles = newObstacles;
    }

    placeNewObstacle(direction, skierMapX, skierMapY, odds) {
        const shouldPlaceObstacle = _.random(1, odds);
        if(shouldPlaceObstacle !== odds) {
            return;
        }

        const leftEdge = skierMapX;
        const rightEdge = skierMapX + GAME_WIDTH;
        const topEdge = skierMapY;
        const bottomEdge = skierMapY + GAME_HEIGHT;

        switch(direction) {
            case 1: // left
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    };

    placeRandomObstacle(minX, maxX, minY, maxY) {
        const obstacleIndex = _.random(0, this.obstacleTypes.length - 1);
        const type = this.obstacleTypes[obstacleIndex];
        const img = this.loadedAssets[type];
        const position = this.calculateOpenPosition(minX, maxX, minY, maxY);
        const newObstacle = new Obstacle(type, img, position.x, position.y);
        this.obstacles.push(newObstacle);
    }

    calculateOpenPosition(minX, maxX, minY, maxY) {
        const x = _.random(minX, maxX);
        const y = _.random(minY, maxY);

        const foundCollision = _.find(this.obstacles, function(obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if(foundCollision) {
            return this.calculateOpenPosition(minX, maxX, minY, maxY);
        }
        else {
            return {
                x: x,
                y: y
            }
        }
    }
}