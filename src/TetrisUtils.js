import {fieldWidth,effectiveRoof} from "./Config"



// ゲームオーバー条件1
export function gameOverCondition1(Field){
    // {x:3,y:effectiveRoof} ~ {x:6,y:effectiveRoof}
    // {x:3,y:effectiveRoof - 1} ~ {x:6,y:effectiveRoof - 1}
    // の範囲にブロックがあるかどうか
    for (let index = 3; index < 6; index++) {
        if (Field.status[effectiveRoof][index].isFill) { return true }
        if (Field.status[effectiveRoof - 1][index].isFill) { return true }
    }
    return false
}

// ゲームオーバー条件2
export function gameOverCondition2(Field){
    // 一番上の天井 y = 0~1 の部分にブロックがあるかどうか
    for (let index = 0; index < fieldWidth; index++) {
        if (Field.status[0][index].isFill) { return true }
    }

    return false
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))