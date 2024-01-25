import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import Clockwise from "../ClockwiseHelper"
import CounterClockwise from "../CounterClockwiseHelper"

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
        this.clockwiseTurninDirections = [this.coordinate.moveDown,this.coordinate.moveLeft,this.coordinate.moveDown]
        this.counterClockwiseTurninDirections = [this.coordinate.moveDown,this.coordinate.moveRight,this.coordinate.moveDown]
    }

    clockwise(field){
        // テトリミノが縦の時
        if (this.coordinate.status[0].x == this.coordinate.status[1].x) {
            this.coordinate = (new Clockwise()).rotate({
                field:field,
                type:this.type,
                coordinate:this.coordinate,
                rotationPoint:1
            })
        }
        // テトリミノが横の時
        else {
            this.coordinate = (new Clockwise()).rotate({
                field:field,
                type:this.type,
                coordinate:this.coordinate,
                rotationPoint:2
            })
        }
    }

    counterClockwise(field){
        // テトリミノが縦の時
        if (this.coordinate.status[0].x == this.coordinate.status[1].x) {
            this.coordinate = (new CounterClockwise()).rotate({
                field:field,
                type:this.type,
                coordinate:this.coordinate,
                rotationPoint:2
            })
        }
        // テトリミノが横の時
        else {
            this.coordinate = (new CounterClockwise()).rotate({
                field:field,
                type:this.type,
                coordinate:this.coordinate,
                rotationPoint:1
            })
        }
    }
}