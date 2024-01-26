import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import * as Rotate from  "../Rotate"

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
        this.turninDirections = ["down","down"]
    }

    clockwise(field){
        this.coordinate = Rotate.clockwise({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.turninDirections
        })
    }

    counterClockwise(field){
        this.coordinate = Rotate.counterClockwise({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.turninDirections
        })
    }
}