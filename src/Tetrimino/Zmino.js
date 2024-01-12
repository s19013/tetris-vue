import Tetrimino from "../Tetrimino";
import {effectiveRoof} from "./Config"
import Rotate from "../Rotate";

export default class Zmino extends Tetrimino{
    constructor() {
        super({
            type:"Z",
            Cordinate:[
                {x:5,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof },
                {x:3,y:effectiveRoof },
            ]
        })
    }

    clockwise(Field){
        const rotate = new Rotate()
        this.Cordinate = rotate.clockwise({
            Field:Field,
            Cordinate:this.Cordinate,
            rotationPoint:1
        })
    }

    counterClockwise(Field){
        const rotate = new Rotate()
        this.Cordinate = rotate.counterClockwise({
            Field:Field,
            Cordinate:this.Cordinate,
            rotationPoint:1
        })
    }
}