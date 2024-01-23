import * as pushOut from "./PushOut";
import lodash from "lodash";
export default class RotateHelper{
    //note: 引数で受け取るのがオブジェクト型だったのでこのような形にする必要があった｡
    moveUp(coordinate){
        const moved = coordinate.map(block => {
                return {x:block.x,y:block.y -= 1 }
            }
        );
        return pushOut.correction(moved);
    }

    moveDown(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x,y:block.y += 1}
        });
        return pushOut.correction(moved)
    }

    moveLeft(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x -= 1,y:block.y}
        });
        return pushOut.correction(moved)
    }

    moveRight(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x += 1,y:block.y}
        });
        return pushOut.correction(moved)
    }

    // 回転入れ
    turnIn({field, coordinate, directions}) {
        // directionには関数名が入っていてそのまま関数を使えるらしい｡
        // jsならではの方法?
        let moved = lodash.cloneDeep(coordinate)
        for (const helper of directions) {
          moved = helper(moved);
          if (field.tetriminoIsNotOverlap(moved)) { return moved; }
        }
        // すべての方向で移動できなかった場合、失敗フラグを返す
        // 一般的にnullを返すのは良くないらしいが､失敗フラグとしてnullを使うのは良いらしい｡
        return null
    }

    // 上に上げる
    liftUp({field,coordinate}) {
        // 最大2回まで上げる
        let moved = lodash.cloneDeep(coordinate)
        for (let index = 0; index < 2; index++) {
            moved = this.moveUp(moved)
            if (field.tetriminoIsNotOverlap(moved)) { return moved; }
        }
        // すべての方向で移動できなかった場合、失敗フラグを返す
        // 一般的にnullを返すのは良くないらしいが､失敗フラグとしてnullを使うのは良いらしい｡
        return null
    }
}
