import {fieldWidth} from "./Config"
export default class Rule2{
    isGameOver(Field){
        // 一番上の天井 y = 0~1 の部分にブロックがあるかどうか
        for (let index = 0; index < fieldWidth; index++) {
            if (Field.status[0][index].isFill) { return true }
        }
    
        return false
    }
}