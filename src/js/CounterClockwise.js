
import PushOut from "./PushOut";
import RotateHelper from "./RotateHelper";

export default class Clockwise{
    constructor() {
        this.helper = new RotateHelper()
    }

    rotate({
        field,
        type,
        Coordinate,
        rotationPoint
    }){
        // 回転実行
        const rotated = this.calculation({
            coordinate:Coordinate,
            rotationPoint:rotationPoint
        })
    
        // 補正をかける
        const corrected =  (new PushOut()).correction(rotated)
    
        // どのブロックにも被って無いならすぐ返す
        if (field.tetriminoIsNotOverlap(corrected)) { return corrected }
    
        let turnedIn = {}
        if (type == "S" || type == "Z") { 
            // 下に最大2回移動し、それでもだめなら上に最大2回移動する
            turnedIn = this.turnIn(
                field, corrected, [this.helper.moveDown, this.helper.moveDown, this.helper.moveUp, this.helper.moveUp]
            );
        }
        else {
            // 下､右､下に移動してみて、それでもだめなら上に最大2回移動する
            turnedIn = this.turnIn(
                field, corrected, [this.helper.moveDown, this.helper.moveRight,this.helper.moveDown,this.helper.moveUp, this.helper.moveUp]
            );
        }
    
        // 回し入れ失敗なら
        if (turnedIn[0].x == "none") { return Coordinate }
        return turnedIn
    }
    
    turnIn(field, coordinate, directions) {
        // directionには関数名が入っていてそのまま関数を使えるらしい｡
        // jsならではの方法?
        for (const direction of directions) {
          const moved = direction(coordinate);
          if (field.tetriminoIsNotOverlap(moved)) { return moved; }
        }
        // すべての方向で移動できなかった場合、失敗フラグを返す
        return [{ x: "none", y: "none" }];
      }
    
    /** すべてのブロックを計算して返す */
    calculation({
        coordinate,
        rotationPoint
    }) {
        return coordinate.map(
            block => {
            return this.equation({
                rotationPoint:coordinate[rotationPoint],
                beforeRotation:block
            })
        })
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
