import Tetrimino from "../Tetrimino";
import { effectiveRoof } from "../Config";
import Rotate from "../Rotate";

export default class Imino extends Tetrimino{
    constructor() {
        super({
            type:"I",
            Cordinate:[
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
                {x:6,y:effectiveRoof + 1},
            ]
        })
    }

    clockwise(Field){
        const rotate = new Rotate()
        // テトリミノが縦の時
        if (this.Cordinate[0].x == this.Cordinate[1].x) {
            this.Cordinate = rotate.clockwise({
                Field:Field,
                Cordinate:this.Cordinate,
                rotationPoint:1
            })
        }
        // テトリミノが横の時
        else {
            this.Cordinate = rotate.counterClockwise({
                Field:Field,
                Cordinate:this.Cordinate,
                rotationPoint:2
            })
        }
    }

    counterClockwise(Field){
        const rotate = new Rotate()
        // テトリミノが縦の時
        if (this.Cordinate[0].x == this.Cordinate[1].x) {
            this.Cordinate = rotate.counterClockwise({
                Field:Field,
                Cordinate:this.Cordinate,
                rotationPoint:2
            })
        }
        // テトリミノが横の時
        else {
            this.Cordinate = rotate.clockwise({
                Field:Field,
                Cordinate:this.Cordinate,
                rotationPoint:1
            })
        }
    }
}