import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import * as Rotate from  "../Rotate"

export default class Imino extends Tetrimino{
    constructor() {
        super({
            type:"I",
            coordinate:[
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
                {x:6,y:effectiveRoof + 1},
            ]
        })
        this.clockwiseTurninDirections = ["down","left","down"]
        this.counterClockwiseTurninDirections = ["down","right","down"]
    }

    clockwise(field){
        // テトリミノが縦の時
        if (this.coordinate.status[0].x == this.coordinate.status[1].x) {
            this.coordinate = Rotate.clockwise({
                field:field,
                coordinate:this.coordinate,
                rotationPoint:1,
                directions:this.clockwiseTurninDirections
            })
        }
        // テトリミノが横の時
        else {
            this.coordinate = Rotate.clockwise({
                field:field,
                coordinate:this.coordinate,
                rotationPoint:2,
                directions:this.clockwiseTurninDirections
            })
        }
    }

    counterClockwise(field){
        // テトリミノが縦の時
        if (this.coordinate.status[0].x == this.coordinate.status[1].x) {
            this.coordinate = Rotate.counterClockwise({
                field:field,
                coordinate:this.coordinate,
                rotationPoint:2,
                directions:this.counterClockwiseTurninDirections
            })
        }
        // テトリミノが横の時
        else {
            this.coordinate = Rotate.counterClockwise({
                field:field,
                coordinate:this.coordinate,
                rotationPoint:1,
                directions:this.counterClockwiseTurninDirections
            })
        }
    }
}