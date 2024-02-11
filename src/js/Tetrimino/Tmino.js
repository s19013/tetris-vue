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
        this.tSpinMini = false
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
        this.tSpinMini = false
    }

    addDirectionOfMino(){
        this.directionOfMino += 1
        if (this.directionOfMino > 4) { this.directionOfMino = 1 }
    }

    subDirectionOfMino(){
        this.directionOfMino -= 1
        if (this.directionOfMino < 1) { this.directionOfMino = 4 }
    }

    clockwise(field){
        // tspinminiができるか調べとく
        this.canTspinMini({
            field:field,
            coordinate:this.coordinate,
            recessedPart:3,
            protrudingPart:0,
            vector:-1
        })
        console.log(this.tSpinMini);
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
        // tspinminiができるか調べとく
        this.canTspinMini({
            field:field,
            coordinate:this.coordinate,
            recessedPart:0,
            protrudingPart:3,
            vector:+1
        })

        console.log(this.tSpinMini);
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

        // 回転実行
        const rotated = rotateFunction({rotationPoint: rotationPoint});

        // 補正をかける
        const corrected = pushOut.correction(rotated);
    
        // どのブロックにも被って無いならすぐ返す
        if (field.tetriminoIsNotOverlap(corrected)) {
            this.isTspin({field:field,coordinate:corrected})
            return corrected; 
        }
    
        const turnedIn = helper.turnIn({
            field: field,
            coordinate: corrected,
            directions: directions
        });
    
        // 回し入れ成功ならそれを返す
        if (turnedIn != null) {
            this.isTspin({field:field,coordinate:turnedIn})
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
    
    isTspin({field,coordinate}){
        let count = 0
        if (this.directionOfMino % 2 == 1) {
            count = this.directionOfMinoIsOdd({field:field,coordinate:coordinate})
        } 
        else {
            count = this.directionOfMinoIsEven({field:field,coordinate:coordinate})
        }

        if (count >= 3) { this.tSpin = true }
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

    // 向きが横だった場合
    directionOfMinoIsOdd({field,coordinate}){
        let count = 0

        // フィールドの外かどうか
        if (this.isRoofOrFloor((coordinate.status[0].y) + 1)) { count += 1 }
        else {
            // ブロックがあるか
            if (field.status[(coordinate.status[0].y) + 1][coordinate.status[0].x]) {count += 1}
        }

        if (this.isRoofOrFloor((coordinate.status[0].y) - 1)){ count += 1 }
        else {
            if (field.status[(coordinate.status[0].y) - 1][coordinate.status[0].x]) {count += 1}
        }

        if (this.isRoofOrFloor((coordinate.status[3].y) + 1)){ count += 1 }
        else {
            if (field.status[(coordinate.status[3].y) + 1][coordinate.status[3].x]) {count += 1}
        }

        if (this.isRoofOrFloor((coordinate.status[3].y) - 1)){ count += 1 }
        else {
            if (field.status[(coordinate.status[3].y) - 1][coordinate.status[3].x]) {count += 1}
        }

        return count
    }

    // 向きが縦だった場合
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

    canTspinMini({
        field,
        coordinate,
        recessedPart,  // 出っ張ってない部分
        protrudingPart,  // 出っ張ってる部分
        vector  // 動かすベクトル､ついでにかべがあるべき場所
    }){
        // 向きが規定の方向以外だったら即返す
        if (this.directionOfMino != 1) { return }

        // 最底辺ではTspinminiができないので即返す
        // 前のif文でdirectionOfMino == 1であるのが確定したため,0,2,3が一番下
        if (coordinate.status[0].y == fieldHeight - 1) { return }

        // 出っ張ってない部分と中央の下にブロックがなかったら即返す
        if(field.status[(coordinate.status[recessedPart].y) + 1][coordinate.status[recessedPart].x] == false){return}
        if(field.status[(coordinate.status[2].y) + 1][coordinate.status[2].x] == false){return}

        // 出っ張っている部分の上下が埋まっていたら即返す
        if(field.status[(coordinate.status[protrudingPart].y) + 1][coordinate.status[protrudingPart].x] ){return}
        if(field.status[(coordinate.status[protrudingPart].y) - 1][coordinate.status[protrudingPart].x] ){return}

        // 出っ張っている部分の隣とその上下が埋まってなかったら即返す
        if (this.isWall((coordinate.status[protrudingPart].x) + vector)) {
            // この場所が壁だとわかった｡
            // その上下も壁なのでTspinminiフラグをonにしても良い
            this.tSpinMini = true
            return 
        }
        
        if(field.status[(coordinate.status[protrudingPart].y)][(coordinate.status[protrudingPart].x) + vector] == false ){return}
        if(field.status[(coordinate.status[protrudingPart].y) + 1][(coordinate.status[protrudingPart].x) + vector] == false ){return}
        if(field.status[(coordinate.status[protrudingPart].y) - 1][(coordinate.status[protrudingPart].x) + vector] == false ){return}

        // ここまできたということはTスピンミニができるということ
        this.tSpinMini = true
    }
}