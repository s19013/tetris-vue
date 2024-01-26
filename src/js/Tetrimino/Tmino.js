import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import * as Rotate from  "../Rotate"

export default class Tmino extends Tetrimino{
    constructor() {
        super({
            type:"T",
            coordinate:[
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof },
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
            ]
        })
        this.clockwiseTurninDirections = ["down","left","down"]
        this.counterClockwiseTurninDirections = ["down","right","down"]
    }

    clockwise(field){
        this.coordinate = Rotate.clockwise({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.clockwiseTurninDirections
        })
    }

    counterClockwise(field){
        this.coordinate = Rotate.counterClockwise({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.counterClockwiseTurninDirections
        })
    }
}