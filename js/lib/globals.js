import {Utils} from "./utils.js";

export const SKIER_SPEEDS = {
    SKIER_SPEED: 10
};
export const SKIER_SPEED_THRESHOLDS = {
    SKIER_SPEED_THRESHOLD_1: 5000,
    SKIER_SPEED_THRESHOLD_2: 10000
};
export const SKIER_SPEED_SCALERS = {
    SKIER_SPEED_SCALER_1: 2.5,
    SKIER_SPEED_SCALER_2: 1.5,
    SKIER_SPEED_SCALER_3: 1
};
export const SKIER_SPEED_THRESHOLD_1 = 5000;
export const SKIER_SPEED_THRESHOLD_2 = 10000;
export const SKIER_SPEED_SCALER_1 = 2.5;
export const SKIER_SPEED_SCALER_2 = 1.5;
export const SKIER_SPEED_SCALER_3 = 1;
export const PLACE_OBSTACLE_ODDS_1 = 8;
export const PLACE_OBSTACLE_ODDS_2 = 4;
export const PLACE_OBSTACLE_ODDS_3 = 1;
export const SCORE_THRESHOLD_1 = 5;
export const SCORE_THRESHOLD_2 = 20;
export const SCORE_VALUE_1 = 100;
export const SCORE_VALUE_2 = 200;
export const SCORE_VALUE_3 = 300;
export const CRASH_LIMIT = 3;
export const EVENTS = {
    INIT_SKIER: 'initSkier',
    INIT_SKIER_COMPLETE: 'initSkierComplete',
    GAME_INIT_COMPLETE: 'gameInitComplete',
    PLACE_NEW_OBSTACLE: 'placeNewObstacle',
    SKIER_CRASH: 'skierCrash',
    TALLY_SCORE: 'tallyScore',
    SHOW_SCORE: 'showScore',
    SCORE_LIST_RETRIEVED: 'scoreListRetrieved',
    GAMEOVER: 'gameover',
    KEY_LEFT: 'keyLeft',
    KEY_RIGHT: 'keyRight',
    KEY_UP: 'keyUp',
    KEY_DOWN: 'keyDown',
};
export const SCORE_URL = 'https://dbae2oep6a.execute-api.us-east-1.amazonaws.com/dev/ski-game/score';
export const GAME_WIDTH = window.innerWidth;
export const GAME_HEIGHT = window.innerHeight;
export const UTILS = new Utils();