import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import Rotate from "../Rotate";

export default class Zmino extends Tetrimino{
    constructor() {
        super({
            type:"Z",
            Coordinate:[
                {x:5,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof },
                {x:3,y:effectiveRoof },
            ]
        })
    }

    clockwise(Field){
        const rotate = new Rotate()
        this.Coordinate = rotate.clockwise({
            Field:Field,
            Coordinate:this.Coordinate,
            rotationPoint:1
        })
    }

    counterClockwise(Field){
        const rotate = new Rotate()
        this.Coordinate = rotate.counterClockwise({
            Field:Field,
            Coordinate:this.Coordinate,
            rotationPoint:1
        })
    }
}