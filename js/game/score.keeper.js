import {EVENTS, SCORE_URL, UTILS, CRASH_LIMIT} from "../lib/globals.js";

export class ScoreKeeper {
    constructor() {
        this.score = 0;
        this.crashCount = 0;

        // event listeners
        UTILS.eventEmitter.addListener(EVENTS.SKIER_CRASH, (event, data) => this.onEvent(event, data));
        UTILS.eventEmitter.addListener(EVENTS.TALLY_SCORE, (event, data) => this.onEvent(event, data));

    }

    onEvent(event, data) {
        switch(event) {
            case EVENTS.SKIER_CRASH:
                this.onCrash();
                break;
            case EVENTS.TALLY_SCORE:
                this.tallyScore(data.rawScore);
                break;
        }
    }

    onCrash() {
        ++this.crashCount;
        if (this.crashCount === CRASH_LIMIT)
            UTILS.emitEvent(EVENTS.GAMEOVER);
    }

    tallyScore(rawScore) {
        let times = Math.floor(rawScore / 100);
        const remain = rawScore % 100;

        _.times(times, n => {
            if(n === 0)
                this.score += 100;
            if(n > 0 && n <= 3)
                this.score += 200;
            if(n > 3)
                this.score += 300;
        });
        this.score += remain;
        UTILS.emitEvent(EVENTS.SHOW_SCORE, {score: this.score});
        this.saveScore()
            .then(res => {
                this.getScores();
            })
            .catch(err => {
                console.log('ERROR saveScore');
                console.log(err);
            });
    }

    saveScore() {
        const payload = JSON.stringify({score: this.score});
        const defer = new $.Deferred();
        $.post( SCORE_URL, payload, function( data ) {
            console.log(data);
            defer.resolve(data);
        });
        return defer.promise();
    }

    getScores() {
        $.get( SCORE_URL, function( data ) {
            UTILS.emitEvent(EVENTS.SCORE_LIST_RETRIEVED, {scores: JSON.parse(data)});
        });
    }
}