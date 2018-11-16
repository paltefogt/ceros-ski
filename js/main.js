import {Game} from "./game/game.js";

$(document).ready(function() {
    const game = new Game();
    game.initGame()
        .then(() => {
            console.log('SUCCESS initGame');
        })
        .catch(err => {
            console.log('ERROR initGame');
            console.log(err);
        });
});