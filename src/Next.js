import Imino from "./Tetrimino/Imino.js";
import Tmino from "./Tetrimino/Tmino.js";
import Omino from "./Tetrimino/Omino.js";
import Smino from "./Tetrimino/Smino.js";
import Zmino from "./Tetrimino/Zmino.js";
import Lmino from "./Tetrimino/Lmino.js";
import Jmino from "./Tetrimino/Jmino.js";

export default class Next{
    constructor(){
        this.list = this.getShuffledArray()
    }

    // initialize(){}

    /** シャッフルライブラリが無いので自作するしかない */
    // aiがFisher-Yatesシャッフルアルゴリズムが一番効率的だから使えっていうからそうしてみる
    shuffle(array) {
        // 配列の最後の要素から順に、現在の要素とそれより前の位置にあるランダムな位置の要素を交換。
        for (let i = array.length - 1; i > 0; i--) {
            // 自分より前の要素を適当に選ぶ
            const j = Math.floor(Math.random() * (i + 1));
            // 交換
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // シャッフルした1巡分を返す
    getShuffledArray(){
        let base = [new Imino(),new Tmino(),new Omino(),new Smino(),new Zmino(),new Lmino(),new Jmino]
        return this.shuffle(base) 
    }

    // 次落とすテトリミノを渡す
    getNextTetrimino(){
        return this.list.shift()
    }

    /** nextを補充するかどうか */
    checkWhetherToReplenish(){
        if (this.list.length < 7) {
            // スプレッド構文ではエラーがでた｡why?
            this.list = this.list.concat(this.getShuffledArray())
        }
    }
}