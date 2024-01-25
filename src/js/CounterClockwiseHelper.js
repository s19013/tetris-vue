
import * as pushOut from "./PushOut";
import RotateHelper from "./RotateHelper";
import lodash from "lodash";
import Coordinate from "./Tetrimino/Coordinate"

export default class CounterClockwiseHelper{
    constructor() {
        this.helper = new RotateHelper()
    }

    rotate({
        field,
        type,
        coordinate,
        rotationPoint
    }){
        // 回転実行
        const rotated = this.calculation({
            coordinate:coordinate,
            rotationPoint:rotationPoint
        })
    
        // 補正をかける
        const corrected =  pushOut.correction(rotated)
    
        // どのブロックにも被って無いならすぐ返す
        if (field.tetriminoIsNotOverlap(corrected)) { return corrected }

        // 回し入れ時移動する方向
        let directions = []

        // 下に最大2回移動し、それでもだめなら上に最大2回移動する
        if (type == "S" || type == "Z") { directions = ["moveDown", "moveDown"] }
        // 下､左､下に移動してみて、それでもだめなら上に最大2回移動する
        else { directions = ["moveDown","moveRight","moveDown"] }

        const turnedIn = this.helper.turnIn(
            {
                field:field,
                coordinate:corrected,
                directions:directions
            }
        );
    
        // 回し入れ成功ならそれを返す
        if (turnedIn != null ) { return turnedIn  }
        
        // 失敗時したら上げる方法を試す｡
        // 最初の回転したを入れるのは仕様
        const liftUpded = this.helper.liftUp({
            field:field,
            coordinate:rotated
        })

        // 押上で問題ないならそれを返す
        if (liftUpded != null ) { return liftUpded  }

        // ここまでやってだめなら初期値を返す
        return coordinate
    }
    
    /** すべてのブロックを計算して返す */
    calculation({
        coordinate,
        rotationPoint
    }) {
        const clonedCoordinate = lodash.cloneDeep(coordinate)
        const calculated = clonedCoordinate.status.map(
            block => {
            return this.equation({
                rotationPoint:clonedCoordinate.status[rotationPoint],
                beforeRotation:block
            })
        })

        return  new Coordinate(calculated)
    }
    
    /** 回転前点{a,b} 回転点 {c,d} */
    /** X = (a - c)cos𝜃 - (b - d)sin𝜃 + c */
    /** Y = (a - c)sin𝜃 + (b - d)cos𝜃 + d */
    
    // Math.cosとかはなんかややこしいし､今回は90度しか使わないので使わない
    /** cos90 = 0 
     *  SIN90 = 1
     */
    /** 計算式(ブロック単体) */
    equation({
        rotationPoint,
        beforeRotation
    }){
        let afterRotation = {x:0,y:0}
        afterRotation.x = 
            (beforeRotation.x - rotationPoint.x) * 0
            -
            (beforeRotation.y - rotationPoint.y) * -1
            + 
            rotationPoint.x
    
        afterRotation.y =
            (beforeRotation.x - rotationPoint.x) * -1
            +
            (beforeRotation.y - rotationPoint.y) * 0
            +
            rotationPoint.y
    
        return afterRotation
    }
}
