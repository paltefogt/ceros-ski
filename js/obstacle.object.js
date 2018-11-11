import {BaseObject} from "./base.object";

export class ObstacleObject extends BaseObject {
    constructor(x,y) {
        super(x,y);
        this.type = '';
        this.obstacleTypes = [
            'tree',
            'treeCluster',
            'rock1',
            'rock2'
        ];
        this.obstacleImages = {
            tree: 'img/tree_1.png',
            treeCluster: 'img/tree_cluster.png',
            rock1: 'img/rock_1.png',
            rock2: 'img/rock_2.png',
        };
    }
}