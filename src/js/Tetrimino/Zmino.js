import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import * as Rotate from  "../Rotate"

export default class Zmino extends Tetrimino{
    constructor() {
        super({
            type:"Z",
            coordinate:[
                {x:5,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof },
                {x:3,y:effectiveRoof },
            ]
        })
        this.turninDirections = ["down","down"]
    }

    clockwise(field){
        this.coordinate = Rotate.clockwise({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:1,
            directions:this.turninDirections
        })
    }

    counterClockwise(field){
        this.coordinate = Rotate.counterClockwise({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:1,
            directions:this.turninDirections
        })
    }
}