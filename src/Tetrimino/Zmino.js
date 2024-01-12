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

    clockwise(clonedField){
        const rotate = new Rotate()
        this.Coordinate = rotate.clockwise({
            clonedField:clonedField,
            Coordinate:this.Coordinate,
            rotationPoint:1
        })
    }

    counterClockwise(clonedField){
        const rotate = new Rotate()
        this.Coordinate = rotate.counterClockwise({
            clonedField:clonedField,
            Coordinate:this.Coordinate,
            rotationPoint:1
        })
    }
}