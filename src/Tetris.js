import Block from "./Block"
import CheckCanMove from "./CheckCanMove"

// 時間に関する数字は全部ミリ秒

export default class Tetris {
    checkCanMove = new CheckCanMove()

    Field = []
    autoDropIntervalId = null

    /** 放置してると勝手にブロックが落ちる感覚 */
    autoDropInterval = 1000 //ms

    /** タイマー系 */
    /** 接地面についてから固定までの猶予 */
    graceTimeUntilFixation = 2000 //ms


    /** 動かせるブロックたちの座標 と ブロックの種類*/
    tetrimino = {
        type:"T",
        Coordinate:[
            {x:4,y:0},
            {x:4,y:1},
            {x:5,y:0},
            {x:5,y:1},
        ]

        // T
        // {x:3,y:1},
        // {x:4,y:1},
        // {x:4,y:0},
        // {x:5,y:1},
    }

    /** 動かす前のブロックの位置 */
    oldTetrimino = structuredClone(this.tetrimino);

    constructor(){
        // 10*10のリストにblockクラスを入れる
        // i:縦
        // n:横
        for (let i = 0; i < 10; i++) {
            let line = [] //横一列の配列
            for (let n = 0; n < 10; n++) {
                line.push(new Block())
            }
            this.Field.push(line)
            line = []
        }

        // 適当に色を塗ってみる
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
        }
        this.Field[8][0].isFill = true
        this.Field[8][9].isFill = true

        // .bind(this)でthis.が使えるようになる
        // this.autoDropIntervalId = setInterval(this.autoDrop.bind(this), this.autoDropInterval);

    }

    /** ボタン押された時の処理たち */
    keyDownUp(){
        console.log("up");
    }

    keyDownDown(){
        console.log("down");
        /** 動かせるかどうか確認*/
        if (this.checkCanMove.down({
                Field:this.Field,
                tetrimino:this.tetrimino
            })
        ) {
            /** 今の位置を古い情報として保存 */
            this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

            /** 位置を更新 */
            for (let block of this.tetrimino.Coordinate) {
                block.y += 1
            }

            this.moveTetrimino()
        }
    }

    keyDownLeft(){
        console.log("left");
        /** 動かせるかどうか確認*/
        if (this.checkCanMove.left({
                Field:this.Field,
                tetrimino:this.tetrimino
            })
        ) {
            /** 今の位置を古い情報として保存 */
            this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

            /** 位置を更新 */
            for (let block of this.tetrimino.Coordinate) {
                block.x -= 1
            }

            this.moveTetrimino()
        }
    }

    keyDownRight(){
        console.log("right");
        if (this.checkCanMove.right({
                Field:this.Field,
                tetrimino:this.tetrimino
            })
        ) {
            /** 今の位置を古い情報として保存 */
            this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

            /** 位置を更新 */
            for (let block of this.tetrimino.Coordinate) {
                block.x += 1
            }
            this.moveTetrimino()
        }
    }

    keyDownSpace(){
        console.log("space");
    }

    autoDrop(){
        console.log("drop");
        /** 動かせないなら固定化する */
        if (this.checkCanMove.down({
            Field:this.Field,
            tetrimino:this.tetrimino
            })
            == false
        ) {
            this.immobilization()
            return 
        }

        /** 動かせるようなら下に動かす */
        /** 今の位置を古い情報として保存 */
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

        /** 位置を更新 */
        for (let block of this.tetrimino.Coordinate) {
            block.y += 1
        }

        this.moveTetrimino()
    }

    moveTetrimino(){
        /** 古い場所のブロックを消して */
        for (let block of this.oldTetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = false
        }
        /** 新しい場所に描写 */
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
        }

    }

    immobilization(){
        /** 揃っているかを調べる */
        console.log("immobilization");


        /** 新しいブロックを生成 */
        this.tetrimino = {
            type:"T",
            Coordinate:[
                {x:4,y:0},
                {x:4,y:1},
                {x:5,y:0},
                {x:5,y:1},
            ]
        }
    }


    /** 描写用の配列を返す */
    display(){
        /** i:縦 */
        /** n:横 */

        let temp = []
        for (let i = 0; i < 10; i++) {
            let line = []
            for (let n = 0; n < 10; n++) {
                line.push(Number(this.Field[i][n].isFill))
            }
            temp.push(line)
            line = []
        }
        return temp
    }

}