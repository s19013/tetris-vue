import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import Clockwise from "../ClockwiseHelper"
import CounterClockwise from "../CounterClockwiseHelper"

export default class Smino extends Tetrimino{
    constructor() {
        super({
            type:"S",
            coordinate:[
                {x:5,y:effectiveRoof },
                {x:4,y:effectiveRoof },
                {x:4,y:effectiveRoof + 1},
                {x:3,y:effectiveRoof + 1},
            ]
        })
        this.turninDirections = [this.coordinate.moveDown,this.coordinate.moveDown]
    }

    clockwise(field){
        this.coordinate = (new Clockwise()).rotate({
            field:field,
            type:this.type,
            coordinate:this.coordinate,
            rotationPoint:2
        })
    }

    counterClockwise(field){
        this.coordinate = (new CounterClockwise()).rotate({
            field:field,
            type:this.type,
            coordinate:this.coordinate,
            rotationPoint:2
        })
    }
}