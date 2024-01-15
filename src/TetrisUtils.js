import Block from "./Block"
import {fieldWidth,effectiveRoof} from "./Config"
import lodash from 'lodash';
export function createOjyama(){
    let hole = Math.floor(Math.random() * fieldWidth)

    let line = []
    for (let n = 0; n < fieldWidth; n++) {
        if (hole == n) { line.push(new Block()) }
        else {line.push(new Block(true))}
    }

    return line
}

export function insertOjyama(Field){
    /** 一番上を消してしまう 
     * 縦のマス数が増えないように
    */
    Field.status.shift();

    // お邪魔の列を一番うしろに消す
    Field.status.push(lodash.cloneDeep(createOjyama()))
    return Field
}

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