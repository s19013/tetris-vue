import {fieldWidth} from "./Config"
import lodash from 'lodash';
import Block from "./Block"

export default class Ojyama{
    createOjyama(){
        let hole = Math.floor(Math.random() * fieldWidth)
    
        let row = []
        for (let n = 0; n < fieldWidth; n++) {
            if (hole == n) { row.push(new Block()) }
            else {row.push(new Block(true))}
        }
    
        return row
    }
    
    insertOjyama(Field){
        /** 一番上を消してしまう 
         * 縦のマス数が規定の数を超えないように
        */
        Field.status.shift();
    
        // お邪魔の列を一番うしろに消す
        Field.status.push(lodash.cloneDeep(this.createOjyama()))
        return Field
    }
}