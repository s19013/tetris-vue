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
        this.directionOfMino = 1
        this.useSpin = false
        this.useTSpin = false
    }

    moveLeft(){
        this.disableFlags()
        this.coordinate = this.coordinate.moveLeft()
    }

    moveRight(){
        this.disableFlags()
        this.coordinate = this.coordinate.moveRight()
    }

    moveUp(){
        this.disableFlags()
        this.coordinate = this.coordinate.moveUp()
    }

    moveDown(){
        this.disableFlags()
        this.coordinate = this.coordinate.moveDown()
    }

    disableFlags(){
        this.useSpin = false
        this.useTSpin = false
    }

    addDirectionOfMino(){
        this.directionOfMino += 1
        if (this.directionOfMino > 4) { this.directionOfMino = 1 }
    }

    subDirectionOfMino(){
        this.directionOfMino -= 1
        if (this.directionOfMino < 1) { this.directionOfMino = 4 }
    }

    is3CornersFill(field){
        let count = 0
        if (this.directionOfMino % 2 == 1) {
            count = this.directionOfMinoIsOdd(field)
        } 
        else {
            count = this.directionOfMinoIsEven(field)
        }

        if (count > 3) { this.useTSpin = true }
    }

    directionOfMinoIsOdd(field){
        let count = 0
        if (field[(this.coordinate[0].y) + 1][this.coordinate[0].x]) {count += 1}
        if (field[(this.coordinate[0].y) - 1][this.coordinate[0].x]) {count += 1}
        if (field[(this.coordinate[4].y) + 1][this.coordinate[4].x]) {count += 1}
        if (field[(this.coordinate[4].y) - 1][this.coordinate[4].x]) {count += 1}
        
        return count
    }

    directionOfMinoIsEven(field){
        let count = 0
        if (field[this.coordinate[0].y][(this.coordinate[0].x) + 1]) {count += 1}
        if (field[this.coordinate[0].y][(this.coordinate[0].x) - 1]) {count += 1}
        if (field[this.coordinate[4].y][(this.coordinate[4].x) + 1]) {count += 1}
        if (field[this.coordinate[4].y][(this.coordinate[4].x) - 1]) {count += 1}
        
        return count
    }

    clockwise(field){
        this.coordinate = this.rotateTetrimino({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.clockwiseTurninDirections,
            rotateFunction: this.coordinate.clockwise.bind(this.coordinate),
            directionOfMinoFunction:this.addDirectionOfMino()
        });
    }

    counterClockwise(field){
        this.coordinate = this.rotateTetrimino({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.counterClockwiseTurninDirections,
            rotateFunction: this.coordinate.counterClockwise.bind(this.coordinate),
            directionOfMinoFunction:this.subDirectionOfMino()
        });
    }

    rotateTetrimino({
        field,
        coordinate,
        rotationPoint,
        directions,
        rotateFunction, // コールバックというか回す関数を入れる
        directionOfMinoFunction, // directionOfMinoFunctionを増減させる関数
    }) {
        // 回転できなかったときに使う
        const oldDirectionOfMino = this.directionOfMino

        // directionOfMinoFunctionを増減させる
        directionOfMinoFunction()

        // 回転実行
        const rotated = rotateFunction({rotationPoint: rotationPoint});

    
        // 補正をかける
        const corrected = pushOut.correction(rotated);
    
        // どのブロックにも被って無いならすぐ返す
        if (field.tetriminoIsNotOverlap(corrected)) {
            this.is3CornersFill(field)
            return corrected; 
        }
    
        const turnedIn = helper.turnIn({
            field: field,
            coordinate: corrected,
            directions: directions
        });
    
        // 回し入れ成功ならそれを返す
        if (turnedIn != null) {
            this.is3CornersFill(field)
            return turnedIn; 
        }
        
        // 失敗時したら上げる方法を試す｡
        const liftUpded = helper.liftUp({
            field: field,
            coordinate: rotated
        });
    
        // 押上で問題ないならそれを返す
        if (liftUpded != null) { return liftUpded; }
    
        // ここまでやってだめなら初期値を返す

        // directionOfMinoを回転前に戻す
        this.directionOfMino = oldDirectionOfMino

        return coordinate;
    }
    
}