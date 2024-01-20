import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import Rotate from "../Rotate";

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
        const rotate = new Rotate()
        this.Coordinate = rotate.clockwise({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:2
        })
    }

    counterClockwise(field){
        const rotate = new Rotate()
        this.Coordinate = rotate.counterClockwise({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:2
        })
    }
}