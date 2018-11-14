import {Skier} from "./skier.js";
import {EVENTS, GAME_WIDTH, GAME_HEIGHT, UTILS} from "../lib/globals.js";
import {ObstacleManager} from "./obstacle.manager.js";
import {ScoreKeeper} from "./score.keeper.js";

export class Game {
    constructor() {
        this.canvas = $('<canvas></canvas>')
            .attr('width', GAME_WIDTH * window.devicePixelRatio)
            .attr('height', GAME_HEIGHT * window.devicePixelRatio)
            .css({
                width: GAME_WIDTH + 'px',
                height: GAME_HEIGHT + 'px'
            });
        $('body').append(this.canvas);
        this.ctx = this.canvas[0].getContext('2d');

        // event listeners
        UTILS.eventEmitter.addListener(EVENTS.GAME_INIT_COMPLETE, (event, data) => this.onEvent(event, data));

        // game objects
        this.skier = new Skier(0, 0);
        this.obstacleManager = new ObstacleManager();
        this.scoreKeeper = new ScoreKeeper();
        this.scoreKeeper.getScores();
    }

    // 0 = crash
    // 1 = left
    // 2 = left down
    // 3 = down
    // 4 = right down
    // 5 = right
    setupKeyhandler() {
        const self = this;

        $(window).keydown(function(event) {
            switch(event.which) {
                case 37: // left
                    UTILS.emitEvent(EVENTS.KEY_LEFT);
                    event.preventDefault();
                    break;
                case 39: // right
                    UTILS.emitEvent(EVENTS.KEY_RIGHT);
                    event.preventDefault();
                    break;
                case 38: // up
                    UTILS.emitEvent(EVENTS.KEY_UP);
                    event.preventDefault();
                    break;
                case 40: // down
                    UTILS.emitEvent(EVENTS.KEY_DOWN);
                    event.preventDefault();
                    break;
            }
        });
    };

    initGame() {
        const self = this;
        this.setupKeyhandler();
        this.skier.loadAssets()
            .then(() => self.obstacleManager.loadAssets())
            .then(() => {
                self.obstacleManager.placeInitialObstacles(GAME_WIDTH, GAME_HEIGHT);
                UTILS.emitEvent(EVENTS.GAME_INIT_COMPLETE);
            })
            .catch(err => {
                console.log('ERROR initGame');
                console.log(err);
            });
    };

    gameLoop() {
        this.ctx.save();
        // Retina support
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.clearCanvas();

        this.skier.move();

        UTILS.checkIfSkierHitObstacle(this.skier, this.obstacleManager.obstacles);

        this.skier.draw(this.ctx, GAME_WIDTH, GAME_HEIGHT);

        this.obstacleManager.drawObstacles(this.ctx, this.skier.x, this.skier.y, GAME_WIDTH, GAME_HEIGHT);

        this.ctx.restore();
        requestAnimationFrame(this.gameLoop.bind(this));
    };

    onEvent(event, data) {
        switch(event) {
            case EVENTS.GAME_INIT_COMPLETE:
                console.log('GAME_INIT_COMPLETE');
                this.gameLoop();
                break;
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    };
}