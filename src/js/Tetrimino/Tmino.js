import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import {rotate as clockwise} from "../Clockwise"
import {rotate as counterClockwise} from "../CounterClockwise"

export default class Tmino extends Tetrimino{
    constructor() {
        super({
            type:"T",
            Coordinate:[
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof },
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
            ]
        })
    }

    clockwise(field){
        this.Coordinate = clockwise({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:2
        })
    }

    counterClockwise(field){
        this.Coordinate = counterClockwise({
            field:field,
            type:this.type,
            Coordinate:this.Coordinate,
            rotationPoint:2
        })
    }
}