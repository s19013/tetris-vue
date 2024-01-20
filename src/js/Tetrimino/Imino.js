import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import Clockwise from "../Clockwise"
import CounterClockwise from "../CounterClockwise"

export default class Imino extends Tetrimino{
    constructor() {
        super({
            type:"I",
            Coordinate:[
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
                {x:6,y:effectiveRoof + 1},
            ]
        })
    }

    clockwise(field){
        // テトリミノが縦の時
        if (this.Coordinate[0].x == this.Coordinate[1].x) {
            this.Coordinate = (new Clockwise()).rotate({
                field:field,
                type:this.type,
                Coordinate:this.Coordinate,
                rotationPoint:1
            })
        }
        // テトリミノが横の時
        else {
            this.Coordinate = (new Clockwise()).rotate({
                field:field,
                type:this.type,
                Coordinate:this.Coordinate,
                rotationPoint:2
            })
        }
    }

    counterClockwise(field){
        // テトリミノが縦の時
        if (this.Coordinate[0].x == this.Coordinate[1].x) {
            this.Coordinate = (new CounterClockwise()).rotate({
                field:field,
                type:this.type,
                Coordinate:this.Coordinate,
                rotationPoint:2
            })
        }
        // テトリミノが横の時
        else {
            this.Coordinate = (new CounterClockwise()).rotate({
                field:field,
                type:this.type,
                Coordinate:this.Coordinate,
                rotationPoint:1
            })
        }
    }
}