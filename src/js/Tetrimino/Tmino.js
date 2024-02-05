import Tetrimino from "./Tetrimino";
import {fieldHeight,fieldWidth,effectiveRoof} from "../Config";
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
        this.tSpin = false
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
        this.tSpin = false
    }

    addDirectionOfMino(){
        this.directionOfMino += 1
        if (this.directionOfMino > 4) { this.directionOfMino = 1 }
    }

    subDirectionOfMino(){
        this.directionOfMino -= 1
        if (this.directionOfMino < 1) { this.directionOfMino = 4 }
    }

    is3CornersFill({field,coordinate}){
        let count = 0
        if (this.directionOfMino % 2 == 1) {
            count = this.directionOfMinoIsOdd({field:field,coordinate:coordinate})
        } 
        else {
            count = this.directionOfMinoIsEven({field:field,coordinate:coordinate})
        }

        console.log("count",count);
        if (count >= 3) { this.tSpin = true }
        console.log("useTSpin",this.tSpin);
    }

    // 指定した場所フィールドの外(壁の中にめり込む)かどうか調べる
    // 引数の適切な名前が思いつかない
    isWall(point){
        if (point < 0) { return true }  // 左壁
        if (point >= fieldWidth) {return true} // 右壁
        return false
    }

    // 指定した場所フィールドの外(床の中､天井にめり込む)かどうか調べる
    // 引数の適切な名前が思いつかない
    isRoofOrFloor(point){
        if (point < 0) { return true }  // 天井
        if (point >= fieldHeight) {return true}  // 床
        return false
    }

    directionOfMinoIsOdd({field,coordinate}){
        let count = 0

        // フィールドの外かどうか
        if (this.isRoofOrFloor((coordinate.status[0].y) + 1)) { count += 1 }
        else {
            // ブロックがあるか
            console.log("[",(coordinate.status[0].y) + 1,coordinate.status[0].x,"]",field.status[(coordinate.status[0].y) + 1][coordinate.status[0].x]);
            if (field.status[(coordinate.status[0].y) + 1][coordinate.status[0].x]) {count += 1}
        }

        if (this.isRoofOrFloor((coordinate.status[0].y) - 1)){ count += 1 }
        else {
            console.log("[",(coordinate.status[0].y) - 1,coordinate.status[0].x,"]",field.status[(coordinate.status[0].y) - 1][coordinate.status[0].x]);
            if (field.status[(coordinate.status[0].y) - 1][coordinate.status[0].x]) {count += 1}
        }

        if (this.isRoofOrFloor((coordinate.status[3].y) + 1)){ count += 1 }
        else {
            console.log("[",(coordinate.status[3].y) + 1,coordinate.status[3].x,"]",field.status[(coordinate.status[3].y) + 1][coordinate.status[3].x]);
            if (field.status[(coordinate.status[3].y) + 1][coordinate.status[3].x]) {count += 1}
        }

        if (this.isRoofOrFloor((coordinate.status[3].y) - 1)){ count += 1 }
        else {
            console.log("[",(coordinate.status[3].y) - 1,coordinate.status[3].x,"]",field.status[(coordinate.status[3].y) - 1][coordinate.status[3].x]);
            if (field.status[(coordinate.status[3].y) - 1][coordinate.status[3].x]) {count += 1}
        }

        return count
    }

    directionOfMinoIsEven({field,coordinate}){
        let count = 0

        // フィールドの外かどうか
        if (this.isWall((coordinate.status[0].x) + 1)) { count += 1 }
        else {
            // ブロックがあるか
            if (field.status[coordinate.status[0].y][(coordinate.status[0].x) + 1]) {count += 1}
        }

        if (this.isWall((coordinate.status[0].x) - 1)) { count += 1 }
        else {
            if (field.status[coordinate.status[0].y][(coordinate.status[0].x) - 1]) {count += 1}
        }

        if (this.isWall((coordinate.status[3].x) + 1)) { count += 1 }
        else {
            if (field.status[coordinate.status[3].y][(coordinate.status[3].x) + 1]) {count += 1}
        }

        if (this.isWall((coordinate.status[3].x) - 1)) { count += 1 }
        else {
            if (field.status[coordinate.status[3].y][(coordinate.status[3].x) - 1]) {count += 1}
        }

        return count
    }

    clockwise(field){
        this.coordinate = this.rotateTetrimino({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.clockwiseTurninDirections,
            rotateFunction: this.coordinate.clockwise.bind(this.coordinate),
            directionOfMinoFunction:this.addDirectionOfMino.bind(this)
        });
    }

    counterClockwise(field){
        this.coordinate = this.rotateTetrimino({
            field:field,
            coordinate:this.coordinate,
            rotationPoint:2,
            directions:this.counterClockwiseTurninDirections,
            rotateFunction: this.coordinate.counterClockwise.bind(this.coordinate),
            directionOfMinoFunction:this.subDirectionOfMino.bind(this)
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
        console.log("rotated",this.directionOfMino);

        // 回転実行
        const rotated = rotateFunction({rotationPoint: rotationPoint});

    
        // 補正をかける
        const corrected = pushOut.correction(rotated);
    
        // どのブロックにも被って無いならすぐ返す
        if (field.tetriminoIsNotOverlap(corrected)) {
            this.is3CornersFill({field:field,coordinate:corrected})
            return corrected; 
        }
    
        const turnedIn = helper.turnIn({
            field: field,
            coordinate: corrected,
            directions: directions
        });
    
        // 回し入れ成功ならそれを返す
        if (turnedIn != null) {
            this.is3CornersFill({field:field,coordinate:turnedIn})
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
        console.log("reset",this.directionOfMino);

        return coordinate;
    }
    
}