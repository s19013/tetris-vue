import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";

export default class Omino extends Tetrimino{
    constructor() {
        super({
            type:"O",
            coordinate:[
                {x:4,y:effectiveRoof },
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof },
                {x:5,y:effectiveRoof + 1},
            ]
        })
    }

    // 回転する必要がないから即return
    // 使わないけど全員fieldを引数として受け取るから受け取っとく
    clockwise(field){
        return
    }

    // 回転する必要がないから即return
    // 使わないけど全員fieldを引数として受け取るから受け取っとく
    counterClockwise(field){
        return 
    }
}