import Tetrimino from "../Tetrimino";
import {effectiveRoof} from "./Config"
import Rotate from "../Rotate";

export default class Tmino extends Tetrimino{
    constructor() {
        super({
            type:"T",
            Cordinate:[
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof },
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
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