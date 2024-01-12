import Tetrimino from "../Tetrimino";
import {effectiveRoof} from "./Config"
import Rotate from "../Rotate";

export default class Omino extends Tetrimino{
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

    // 回転する必要がないから即return
    // 使わないけど全員Fieldを引数として受け取るから受け取っとく
    clockwise(Field){
        return
    }

    // 回転する必要がないから即return
    // 使わないけど全員Fieldを引数として受け取るから受け取っとく
    counterClockwise(Field){
        return 
    }
}