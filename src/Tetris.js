import Block from "./Block"
import CheckCanMove from "./CheckCanMove"
import Rotate from "./Rotate"
import Tetrimino from "./Tetrimino"

// 時間に関する数字は全部ミリ秒

/** コミットメッセージがオーバーしてしまったのでここをみて!!
 * 落ちてくるテトリミノが変化するようにした｡
 * nextを作った｡
 * nextを補充する機能を作った｡
 * 接地面についたときに下ボタンをおしたら固定化する
 */

export default class Tetris {
    Field = []
    autoDropIntervalId = null
    score = 0

    fieldWidth   = 10
    fieldHeight  = 20;

    checkCanMove = new CheckCanMove({
        fieldWidth:this.fieldWidth,
        fieldHeight:this.fieldHeight
    })

    rotater = new Rotate({
        fieldWidth:this.fieldWidth,
        fieldHeight:this.fieldHeight,
        checkCanMove:this.checkCanMove
    })

    tetriminoFactory = new Tetrimino()

    /** 放置してると勝手にブロックが落ちる感覚 */
    autoDropInterval = 1000 //ms

    /** タイマー系 */
    /** 接地面についてから固定までの猶予 */
    graceTimeUntilFixation = 2000 //ms

    /** nextテトリミノ達 */
    nextTetriminos = []

    /** 動かせるブロックたちの座標 と ブロックの種類*/
    tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.I));

    /** 動かす前のブロックの位置 */
    oldTetrimino = structuredClone(this.tetrimino);

    constructor(){
        // 10*10のリストにblockクラスを入れる
        // i:縦
        // n:横
        for (let i = 0; i < this.fieldHeight; i++) {
            let line = [] //横一列の配列
            for (let n = 0; n < this.fieldWidth; n++) {
                line.push(new Block())
            }
            this.Field.push(line)
            line = []
        }

        this.gameStart()

        // for (let index = 4; index <9 ; index++) {
        //     this.Field[index][4].isFill = true
        //     this.Field[index][7].isFill = true
        // }


        // .bind(this)でコールバック内でもthis.が使えるようになる

    }

    /** ゲームスタートの処理 */
    gameStart(){
        // 2巡分追加しないと行けないのでこうなった
        let temp = this.tetriminoFactory.passSet()
        this.nextTetriminos = temp.concat(this.tetriminoFactory.passSet())

        this.startDropping()
        // this.autoDropIntervalId = setInterval(this.autoDrop.bind(this), this.autoDropInterval);
    }

    /** ブロックを落とし始める */
    startDropping(){
        /** 厳密には新しく落とすブロックを描写 */

        /** 落ちてくるのをセット */
        this.tetrimino = this.nextTetriminos.shift()

        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
            this.Field[block.y][block.x].isMoving = true
        }

    }


    /** ボタン押された時の処理たち */
    keyDownUp(){
        // console.log("up");
        // デバック用
        // if (this.checkCanMove.up({
        //         Field:this.Field,
        //         tetrimino:this.tetrimino
        //     })
        // ) {
        //     /** 今の位置を古い情報として保存 */
        //     this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

        //     /** 位置を更新 */
        //     for (let block of this.tetrimino.Coordinate) {
        //         block.y -= 1
        //     }

        //     this.moveTetrimino()
        // }
    }

    keyDownDown(){
        // console.log("down");
        /** 動かせるかどうか確認*/
        if (this.checkCanMove.down({
                Field:this.Field,
                tetrimino:this.tetrimino
            })
        ) {
            // autoDropとやること一緒だからautoDrop関数使う
            this.autoDrop()
        } else {
            /** 動かせないなら固定化 */
            this.immobilization()
        }

    }

    keyDownLeft(){
        // console.log("left");
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
        // console.log("right");
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

    keyDownL(){
        /** 今の位置を古い情報として保存 */
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

        /** Oミノはそもそも回さない */
        if (this.tetrimino.type == "O") {

            // 再描画するだけで早期リターン
            this.moveTetrimino()
            return 
        }

        /** Iミノは回し方が特殊 */
        if (this.tetrimino.type == "I") {
            this.tetrimino = this.rotater.rotation({
                Field:this.Field,
                direction:"counterClockwise",
                tetrimino:this.tetrimino
            })
            this.moveTetrimino()
            return 
        }

        /** 回転した後の位置を更新 */
        this.tetrimino = this.rotater.rotation({
            Field:this.Field,
            direction:"clockwise",
            tetrimino:this.tetrimino
        })
        
        this.moveTetrimino()
    }

    keyDownJ(){

        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

        /** Oミノはそもそも回さない */
        if (this.tetrimino.type == "O") {

            // 再描画するだけで早期リターン
            this.moveTetrimino()
            return 
        }

        /** Iミノは回し方が逆 */
        if (this.tetrimino.type == "I") {
            this.tetrimino = this.rotater.rotation({
                Field:this.Field,
                direction:"clockwise",
                tetrimino:this.tetrimino
            })
            this.moveTetrimino()
            return 
        }

        /** 回転した後の位置を更新 */
        this.tetrimino = this.rotater.rotation({
            Field:this.Field,
            direction:"counterClockwise",
            tetrimino:this.tetrimino
        })
        
        this.moveTetrimino()

    }

    keyDownSpace(){
        // console.log("space");
    }

    autoDrop(){
        // このロジックmoveTetriminoに分けたほうがよい?

        /** 動かせないなら固定化する 
         *  下記のコードは自動落下用
        */
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
            this.Field[block.y][block.x].isMoving = false
        }

        /** 新しい場所に描写 */
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
            this.Field[block.y][block.x].isMoving = true
        }

    }

    /** 動かしているブロックを固定化する */
    immobilization(){
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isMoving = false
        }

        /** 揃っているかを調べる */
        this.isColumnsAligned()
    }

    /** 列が揃っているか */
    isColumnsAligned(){
        /** 列の合計が
         * 0 :空行
         * 10:1列揃っている
         */

        /** 揃った列番号 */
        let alignedRow = []
        
        /** 計算しやすいようにisFillを数値化する  */
        let table = []
        for (let i = 0; i < this.fieldHeight; i++) {
            let line = []
            for (let n = 0; n < this.fieldWidth; n++) {
                line.push(Number(this.Field[i][n].isFill))
            }
            table.push(line)
            line = []
        }

        for (let line of table) {
            /** 配列の中身を全部足す */
            let sum =  line.reduce(function(a,b){return a + b;});

            // index番号を揃った列配列に入れる
            if (sum == 10) {alignedRow.push(table.indexOf(line))}
        }

        console.log("alignedRow: " + JSON.stringify(alignedRow));

        /** 揃った列をスコアとして足す */
        this.score += alignedRow.length
        /** 揃った列を消す */
        for (let lineIndex of alignedRow) {
            for (let block of this.Field[lineIndex]) {
                block.isFill = false
                block.isMoving = false
            }
        }

        /** フィールドを整える */
        this.FieldLeveling(alignedRow)
    }

    /** 列を消したあとの処理 */
    FieldLeveling(alignedRow){
        // 消した列より上の列すべて一段下げたい

        /** 揃った列自体を消してしまう */
        for (let lineIndex of alignedRow){ this.Field.splice(lineIndex, 1); }

        // 演出のために少しだけ待つ
        // sleep処理

        /** 消した分だけ上に加える */
        for (let i = 0; i < alignedRow.length; i++) {
            let line = [] //横一列の配列
            for (let n = 0; n < 10; n++) {
                line.push(new Block())
            }
            this.Field.unshift(line)
            line = []
        }

        /** 補充確認 */
        this.shouldItReplenish()

        /** 新しいブロックを落とす */
        this.startDropping()
    }

    /** nextを補充するかどうか */
    shouldItReplenish(){
        if (this.nextTetriminos.length < 7) {
            this.nextTetriminos = this.nextTetriminos.concat(this.tetriminoFactory.passSet())
        }
    }

    startInterval(){

    }

    deleteInterval(){
        
    }

    resetInterval(){

    }


    /** 描写用の配列を返す */
    display(){
        /** i:縦 */
        /** n:横 */

        let temp = []
        for (let i = 0; i < this.fieldHeight; i++) {
            let line = []
            for (let n = 0; n < this.fieldWidth; n++) {
                line.push(Number(this.Field[i][n].isFill))
            }
            temp.push(line)
            line = []
        }
        return temp
    }

}