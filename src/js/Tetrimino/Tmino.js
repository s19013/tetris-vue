import Tetrimino from "./Tetrimino";
import { effectiveRoof } from "../Config";
import * as pushOut from "../PushOut"
import * as helper from "../RotateHelper"

export default class Tmino extends Tetrimino{
    constructor() {
        super({
            type:"T",
            coordinate:[
                {x:3,y:effectiveRoof + 1},
                {x:4,y:effectiveRoof },
                {x:4,y:effectiveRoof + 1},
                {x:5,y:effectiveRoof + 1},
            ]
        })
        this.clockwiseTurninDirections = ["down","left","down"]
        this.counterClockwiseTurninDirections = ["down","right","down"]
        this.useSpin = false
        this.useTSpin = false
        this.useTSpinMini = false
    }

    moveLeft(){
        this.coordinate = this.coordinate.moveLeft()
    }

    moveRight(){
        this.coordinate = this.coordinate.moveRight()
    }

    moveUp(){
        this.coordinate = this.coordinate.moveUp()
    }

    moveDown(){
        this.coordinate = this.coordinate.moveDown()
    }

    clockwise(field){
        this.coordinate = this.rotateTetrimino({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.clockwiseTurninDirections,
            rotateFunction: this.coordinate.clockwise.bind(this.coordinate)
        });
    }

    counterClockwise(field){
        this.coordinate = this.rotateTetrimino({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.counterClockwiseTurninDirections,
            rotateFunction: this.coordinate.counterClockwise.bind(this.coordinate)
        });
    }

    rotateTetrimino({
        field,
        coordinate,
        rotationPoint,
        directions,
        rotateFunction // コールバックというか回す関数を入れる
    }) {
        // 回転実行
        const rotated = rotateFunction({rotationPoint: rotationPoint});
    
        // 補正をかける
        const corrected = pushOut.correction(rotated);
    
        // どのブロックにも被って無いならすぐ返す
        if (field.tetriminoIsNotOverlap(corrected)) { return corrected; }
    
        const turnedIn = helper.turnIn({
            field: field,
            coordinate: corrected,
            directions: directions
        });
    
        // 回し入れ成功ならそれを返す
        if (turnedIn != null) { return turnedIn; }
        
        // 失敗時したら上げる方法を試す｡
        const liftUpded = helper.liftUp({
            field: field,
            coordinate: rotated
        });
    
        // 押上で問題ないならそれを返す
        if (liftUpded != null) { return liftUpded; }
    
        // ここまでやってだめなら初期値を返す
        return coordinate;
    }
    
}