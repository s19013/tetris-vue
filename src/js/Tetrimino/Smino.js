import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import Clockwise from "../Clockwise"
import CounterClockwise from "../CounterClockwise"

export default class Smino extends Tetrimino{
    constructor() {
        super({
            type:"S",
            Coordinate:[
                {x:5,y:effectiveRoof },
                {x:4,y:effectiveRoof },
                {x:4,y:effectiveRoof + 1},
                {x:3,y:effectiveRoof + 1},
            ]
        })
    }

    clockwise(field){
        this.Coordinate = (new Clockwise()).rotate({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:1
        })
    }

    counterClockwise(field){
        this.Coordinate = (new CounterClockwise()).rotate({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:1
        })
    }
}