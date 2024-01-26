import * as pushOut from "./PushOut";
import lodash from "lodash";

    // 回転入れ
    export function turnIn({field, coordinate, directions}) {
        // directionには関数名が入っていてそのまま関数を使えるらしい｡
        // jsならではの方法?

        let returnValue = lodash.cloneDeep(coordinate)
        for (const direction of directions) {
            // ひどい書き方だが後で修正できると思うので今はこれで
            let moved = null
            if (direction === "down") { moved = returnValue.moveDown() }
            if (direction === "left") { moved = returnValue.moveLeft() }
            if (direction === "right") { moved = returnValue.moveRight() }
            const corrected = pushOut.correction(moved)
            returnValue = corrected
            if (field.tetriminoIsNotOverlap(returnValue)) { return returnValue; }
        }
        // すべての方向で移動できなかった場合、失敗フラグを返す
        // 一般的にnullを返すのは良くないらしいが､失敗フラグとしてnullを使うのは良いらしい｡
        return null
    }

    // 上に上げる
    export function liftUp({field,coordinate}) {
        // 最大2回まで上げる
        let returnValue = lodash.cloneDeep(coordinate)
        for (let index = 0; index < 2; index++) {
            const moved = returnValue.moveUp()
            const corrected = pushOut.correction(moved);
            returnValue = corrected
            if (field.tetriminoIsNotOverlap(returnValue)) { return returnValue; }
        }
        // すべての方向で移動できなかった場合、失敗フラグを返す
        // 一般的にnullを返すのは良くないらしいが､失敗フラグとしてnullを使うのは良いらしい｡
        return null
    }
