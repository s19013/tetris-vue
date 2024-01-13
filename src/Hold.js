import Imino from "./Tetrimino/Imino.js";
import Tmino from "./Tetrimino/Tmino.js";
import Omino from "./Tetrimino/Omino.js";
import Smino from "./Tetrimino/Smino.js";
import Zmino from "./Tetrimino/Zmino.js";
import Lmino from "./Tetrimino/Lmino.js";
import Jmino from "./Tetrimino/Jmino.js";
import Tetrimino from "./Tetrimino/Tetrimino.js";

export default class Hold {
    constructor() {
        this.holdingTetrimino = null
        this.cannotHold = false
    }

    /** 保管 */
    doHold(tetrimino) {
         this.holdingTetrimino = tetrimino.type 
    }

    /** 保管しているものを取り出す */
    takeOut(){
        // ホールドに鍵をかける(取り出しができるのは1回だけ)
        // わざわざ外から呼び出す必要がないからここで鍵をかける
        this.lock()

        // 最初だけはプロパティがnullのTetriminoクラスを返す
        if (this.holdingTetrimino == null) {return new Tetrimino({type:null,Coordinate:null})}
        if (this.holdingTetrimino == "O") { return new Omino() }
        if (this.holdingTetrimino == "I") { return new Imino() }
        if (this.holdingTetrimino == "T") { return new Tmino() }
        if (this.holdingTetrimino == "S") { return new Smino() }
        if (this.holdingTetrimino == "Z") { return new Zmino() }
        if (this.holdingTetrimino == "L") { return new Lmino() }
        if (this.holdingTetrimino == "J") { return new Jmino() }
    }

    lock(){this.cannotHold = true}

    unlock(){ this.cannotHold = false}
}