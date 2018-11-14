import {EVENTS, SCORE_URL, UTILS} from "../lib/globals.js";

export class ScoreKeeper {
    constructor() {
        this.score = 0;
        this.crashCount = 0;

        // event listeners
        UTILS.eventEmitter.addListener(EVENTS.SKIER_CRASH, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.INCREMENT_SCORE, (event, data) => this.onEvent(event, data));
    }

    onEvent(event, data) {
        switch(event) {
            case EVENTS.SKIER_CRASH:
                this.onCrash();
                break;
            case EVENTS.INCREMENT_SCORE:
                this.incrementScore(data.pointsToAdd);
                break;
        }
    }

    onCrash() {
        this.crashCount < 3 ? ++this.crashCount : UTILS.emitEvent(EVENTS.GAMEOVER);
    }

    incrementScore(pointsToAdd) {
        this.score += pointsToAdd;
    }

    saveScore() {
        const payload = JSON.stringify({score: 120});
        $.post( SCORE_URL, payload, function( data ) {
            console.log(data);
        })
    }

    getScores() {
        $.get( SCORE_URL, function( data ) {
            const scores = JSON.parse(data).sort((a,b) => {
                return a.score - b.score;
            }).reverse();
        });
    }
}