import Tetrimino from "../Tetrimino";
import {effectiveRoof} from "./Config"
import Rotate from "../Rotate";

export default class Jmino extends Tetrimino{
    constructor() {
        super({
            type:"L",
            Cordinate:[
                {x:5,y:effectiveRoof },
                {x:5,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:3,y:effectiveRoof + 1},
            ]
        })
    }

    clockwise(Field){
        const rotate = new Rotate()
        this.Cordinate = rotate.clockwise({
            Field:Field,
            Cordinate:this.Cordinate,
            rotationPoint:2
        })
    }

    counterClockwise(Field){
        const rotate = new Rotate()
        this.Cordinate = rotate.counterClockwise({
            Field:Field,
            Cordinate:this.Cordinate,
            rotationPoint:2
        })
    }
}