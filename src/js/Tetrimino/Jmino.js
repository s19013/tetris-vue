import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import Clockwise from "../Clockwise"
import CounterClockwise from "../CounterClockwise"


export default class Jmino extends Tetrimino{
    constructor() {
        super({
            type:"J",
            Coordinate:[
                {x:3,y:effectiveRoof },
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
            ]
        })
    }

    clockwise(field){
        this.Coordinate = (new Clockwise()).rotate({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:2
        })
    }

    counterClockwise(field){
        this.Coordinate = (new CounterClockwise()).rotate({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:2
        })
    }
}