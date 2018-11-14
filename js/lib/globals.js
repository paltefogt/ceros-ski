import {Utils} from "./utils.js";

export const SKIER_SPEED = 8;
export const SKIER_SPEED_SCALER = 8;
export const EVENTS = {
    INIT_SKIER: 'initSkier',
    INIT_SKIER_COMPLETE: 'initSkierComplete',
    GAME_INIT_COMPLETE: 'gameInitComplete',
    PLACE_NEW_OBSTACLE: 'placeNewObstacle',
    SKIER_CRASH: 'skierCrash',
    INCREMENT_SCORE: 'incrementScore',
    GAMEOVER: 'gameover',
    KEY_LEFT: 'keyLeft',
    KEY_RIGHT: 'keyRight',
    KEY_UP: 'keyUp',
    KEY_DOWN: 'keyDown'
};
export const SCORE_URL = 'https://dbae2oep6a.execute-api.us-east-1.amazonaws.com/dev/ski-game/score';
export const GAME_WIDTH = window.innerWidth;
export const GAME_HEIGHT = window.innerHeight;
export const UTILS = new Utils();