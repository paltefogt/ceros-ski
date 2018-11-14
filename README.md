# Ski Game
### Bug Fix
I found the bug - it was in setupKeyHandler, when pressing the left arrow. If the skier had just crashed, the direction would be 0, and it was being blindly decremented. The resulted in a direction of -1, which is invalid.

### Refactor
The entire codebase was refactored into classes. I implemented an observable pattern to handle events. I also created a globals file for configuration and a utility class to handle some general functionality.

### New Features
I added the following:
 - The game is hosted on S3 at: http://ceros-ski-game.s3-website-us-east-1.amazonaws.com/
 - An endgame state - it is gameover if you hit three obstacles
 - Keeping score - score is based on how far down the mountain you have gone. You get increasing amounts of points as you get further down
 - The skier gets faster as you get further down the mountain
 - Score display and persistance - Scores are displayed on gameover. I wrote a small microservice using AWS Lambda and Api Gateway to store scores in DynamoDB
 - Game reset - the game can be reset by pressing the "Enter" key