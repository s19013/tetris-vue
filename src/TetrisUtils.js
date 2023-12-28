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
    Field.shift();

    // お邪魔の列を一番うしろに消す
    Field.push(lodash.cloneDeep(createOjyama()))
    return Field
}

// ゲームオーバー条件1
export function gameOverCondition1(Field){
    // {x:3,y:effectiveRoof} ~ {x:6,y:effectiveRoof}
    // {x:3,y:effectiveRoof - 1} ~ {x:6,y:effectiveRoof - 1}
    // の範囲にブロックがあるかどうか
    for (let index = 3; index < 6; index++) {
        if (Field[effectiveRoof][index].isFill) { return true }
        if (Field[effectiveRoof - 1][index].isFill) { return true }
    }
    return false
}

// ゲームオーバー条件2
export function gameOverCondition2(Field){
    // 一番上の天井 y = 0~1 の部分にブロックがあるかどうか
    for (let index = 0; index < fieldWidth; index++) {
        if (Field[0][index].isFill) { return true }
    }

    return false
}

// シミュレートしなくても直接参照でも大丈夫なはず
export function undisplayGhost({Field,ghost}){
    for (let block of ghost.Coordinate) {
        Field[block.y][block.x].ghost = false
    }
    
    return Field
}

