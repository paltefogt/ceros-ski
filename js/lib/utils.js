
export class Utils {
    constructor() {
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight;
    }

    loadAssets(assets) {
        const assetPromises = [];
        const loadedAssets = {};
        _.each(assets, function(asset, assetName) {
            const assetImage = new Image();
            const assetDeferred = new $.Deferred();

            assetImage.onload = function() {
                assetImage.width /= 2;
                assetImage.height /= 2;

                loadedAssets[assetName] = assetImage;
                assetDeferred.resolve(loadedAssets);
            };
            assetImage.src = asset;

            assetPromises.push(assetDeferred.promise());
        });

        return $.when.apply($, assetPromises);
    }

    checkIfSkierHitObstacle(skier, obstacles, gameWidth, gameHeight) {
        const self = this;
        const skierRect = skier.getRect(gameWidth, gameHeight);
        const collision = _.find(obstacles, function(obstacle) {
            const obstacleRect = obstacle.getRect();
            return self.intersectRect(skierRect, obstacleRect);
        });

        if(collision) {
            skier.direction = 0;
        }
    };
    intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };
}