import * as pushOut from "./PushOut";
import lodash from "lodash";
export default class RotateHelper{
    //note: 引数で受け取るのがオブジェクト型だったのでこのような形にする必要があった｡
    moveUp(coordinate){
        const moved = coordinate.map(block => {
                return {x:block.x,y:block.y -= 1 }
            }
        );
        return moved
    }

    moveDown(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x,y:block.y += 1}
        });
        return moved
    }

    moveLeft(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x -= 1,y:block.y}
        });
        return moved
    }

    moveRight(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x += 1,y:block.y}
        });
        return moved
    }

    // 回転入れ
    turnIn({field, coordinate, directions}) {
        // directionには関数名が入っていてそのまま関数を使えるらしい｡
        // jsならではの方法?

        let returnValue = lodash.cloneDeep(coordinate)
        for (const helper of directions) {
          const moved = helper(returnValue)
          const corrected = pushOut.correction(moved)
          returnValue = corrected
          if (field.tetriminoIsNotOverlap(returnValue)) { return returnValue; }
        }
        // すべての方向で移動できなかった場合、失敗フラグを返す
        // 一般的にnullを返すのは良くないらしいが､失敗フラグとしてnullを使うのは良いらしい｡
        return null
    }

    // 上に上げる
    liftUp({field,coordinate}) {
        // 最大2回まで上げる
        let returnValue = lodash.cloneDeep(coordinate)
        for (let index = 0; index < 2; index++) {
            const moved = this.moveUp(returnValue)
            const corrected = pushOut.correction(moved);
            returnValue = corrected
            if (field.tetriminoIsNotOverlap(returnValue)) { return returnValue; }
        }
        // すべての方向で移動できなかった場合、失敗フラグを返す
        // 一般的にnullを返すのは良くないらしいが､失敗フラグとしてnullを使うのは良いらしい｡
        return null
    }
}
