// gameOverRuleっていうインターフェースがあると良いんだろうけどjsだからそんなの無い｡
import {effectiveRoof} from "./Config"

export default class Rule1{
    isGameOver(Field) {
        // {x:3,y:effectiveRoof} ~ {x:6,y:effectiveRoof}
        // {x:3,y:effectiveRoof - 1} ~ {x:6,y:effectiveRoof - 1}
        // の範囲にブロックがあるかどうか
        for (let index = 3; index < 6; index++) {
            if (Field.status[effectiveRoof][index].isFill) { return true }
            if (Field.status[effectiveRoof - 1][index].isFill) { return true }
        }
        return false
    }
}
