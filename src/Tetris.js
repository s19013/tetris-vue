import Block from "./Block"
import CheckCanMove from "./CheckCanMove"
import Rotate from "./Rotate"
import Tetrimino from "./Tetrimino"

// 時間に関する数字は全部ミリ秒

export default class Tetris {
    Field = []
    autoDropIntervalId = null
    score = 0

    /** フィールドの横1列の基本の形 */
    baseLine = []

    fieldWidth   = 10
    fieldHeight  = 20
    effectiveHeight = 0

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
    autoDropInterval = 1500 //ms

    /** タイマー系 */
    /** 接地面についてから固定までの猶予 */
    graceTimeUntilFixation = 2000 //ms

    /** nextテトリミノ達 */
    nextTetriminos = []

    /** ホールド */
    holdTetrimino = "none"
    holdLock = false

    /** 動かせるブロックたちの座標 と ブロックの種類*/
    tetrimino = null;

    /** 動かす前のブロックの位置 */
    oldTetrimino = structuredClone(this.tetrimino);

    isGameOver = false

    constructor(){
        // 10*10のリストにblockクラスを入れる

        /** 横1列を生成 */
        // こえを使えば毎度毎度1列を生成する必要がなくなる
        for (let n = 0; n < this.fieldWidth; n++) {
            this.baseLine.push(new Block())
        }

        /** 縦を生成 */
        for (let i = 0; i < this.fieldHeight; i++) {
            this.Field.push(JSON.parse(JSON.stringify(this.baseLine)))
        }

        this.gameStart()

        // this.Field[19][0].isFill = true
        // this.Field[19][1].isFill = true
        // this.Field[19][3].isFill = true
        // this.Field[18][0].isFill = true
        // this.Field[18][1].isFill = true
        // this.Field[18][3].isFill = true
        // this.Field[17][0].isFill = true
        // this.Field[16][0].isFill = true
        // this.Field[16][3].isFill = true
        // this.Field[15][0].isFill = true
        // this.Field[15][1].isFill = true
        // this.Field[15][3].isFill = true
        // this.Field[14][3].isFill = true
        // this.Field[13][3].isFill = true
        // this.Field[13][2].isFill = true
        
        // this.Field[19][9].isFill = true
        // this.Field[19][8].isFill = true
        // this.Field[19][6].isFill = true
        // this.Field[18][9].isFill = true
        // this.Field[18][8].isFill = true
        // this.Field[18][6].isFill = true
        // this.Field[17][9].isFill = true
        // this.Field[16][9].isFill = true
        // this.Field[16][6].isFill = true
        // this.Field[15][9].isFill = true
        // this.Field[15][8].isFill = true
        // this.Field[15][6].isFill = true
        // this.Field[14][6].isFill = true
        // this.Field[13][6].isFill = true
        // this.Field[13][7].isFill = true

        // this.Field[19][9].isFill = true
        // this.Field[19][8].isFill = true
        // this.Field[19][6].isFill = true
        // this.Field[18][9].isFill = true
        // this.Field[18][8].isFill = true
        // this.Field[18][6].isFill = true
        // this.Field[17][9].isFill = true
        // this.Field[17][6].isFill = true
        // this.Field[16][9].isFill = true
        // this.Field[16][8].isFill = true
        // this.Field[16][6].isFill = true
        // this.Field[15][6].isFill = true
        // this.Field[14][6].isFill = true
        // this.Field[14][7].isFill = true

        // this.Field[19][2].isFill = true
        // this.Field[18][2].isFill = true

    }

    /** ゲームスタートの処理 */
    gameStart(){
        // 2巡分追加しないと行けないのでこうなった
        let temp = this.tetriminoFactory.passSet()
        this.nextTetriminos = temp.concat(this.tetriminoFactory.passSet())

        this.startDropping(this.nextTetriminos.shift())
        // this.startInterval()
    }

    /** ブロックを落とし始める */
    startDropping(next){
        /** 厳密には新しく落とすブロックを描写 */

        /** 落ちてくるのをセット */
        this.tetrimino = next

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
        //         Field:JSON.parse(JSON.stringify(this.Field)),
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
                Field:JSON.parse(JSON.stringify(this.Field)),
                tetrimino:this.tetrimino
            })
        ) {
            /** 自動落下のインターバルリセット 
             *  自動落下と重なって2重に落ちるのを防ぐ
            */
            // this.resetInterval()

            this.droppingTheBlock()
        } else {
            /** 動かせないなら固定化 */
            this.immobilization()
        }

    }

    keyDownLeft(){
        // console.log("left");
        /** 動かせるかどうか確認*/
        if (this.checkCanMove.left({
                Field:JSON.parse(JSON.stringify(this.Field)),
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
                Field:JSON.parse(JSON.stringify(this.Field)),
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
                Field:JSON.parse(JSON.stringify(this.Field)),
                direction:"counterClockwise",
                tetrimino:this.tetrimino
            })
            this.moveTetrimino()
            return 
        }

        /** 回転した後の位置を更新 */
        this.tetrimino = this.rotater.rotation({
            Field:JSON.parse(JSON.stringify(this.Field)),
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
                Field:JSON.parse(JSON.stringify(this.Field)),
                direction:"clockwise",
                tetrimino:this.tetrimino
            })
            this.moveTetrimino()
            return 
        }

        /** 回転した後の位置を更新 */
        this.tetrimino = this.rotater.rotation({
            Field:JSON.parse(JSON.stringify(this.Field)),
            direction:"counterClockwise",
            tetrimino:this.tetrimino
        })
        
        this.moveTetrimino()

    }

    keyDownSpace(){
        // ロックがかかっていたら入れ替え不可
        if (!this.holdLock) { this.hold() }
    }

    hold(){
        /** 今の位置を古い情報として保存 */
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

        // ホールドしてるのを取り出す
        let holded = this.holdTetrimino

        // 保存
        this.holdTetrimino = this.tetrimino.type

        /** 最初のホールドだけ動きが違う */
        if (holded == "none") { this.startDropping(this.nextTetriminos.shift()) }
        else {
             if (holded == "O") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.O)) }
             if (holded == "I") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.I)) }
             if (holded == "T") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.T)) }
             if (holded == "S") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.S)) }
             if (holded == "Z") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.Z)) }
             if (holded == "L") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.L)) }
             if (holded == "J") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.J)) }
        }

        this.holdLock = true
        this.moveTetrimino()
    }

    droppingTheBlock(){
        // このロジックmoveTetriminoに分けたほうがよい?

        /** 動かせないなら固定化する 
         *  下記のコードは自動落下用
        */
        if (this.checkCanMove.down({
                Field:JSON.parse(JSON.stringify(this.Field)),
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
            try {
                this.Field[block.y][block.x].isFill = true
                this.Field[block.y][block.x].isMoving = true
            } catch (error) {
                console.log(error);
            }
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

        /** 揃った列の数 */
        let countOfAlignedRow = 0

        for (let line of this.Field) {
            /** 配列の中身を全部足す */
            let sum =  line.reduce((a,b) => {
                return a + Number(b.isFill);
            },0);

            // 揃っていたら消す
            if (sum == 10) { 
                countOfAlignedRow += 1

                // 番号を直接していするのではなく､上から巡に探していって揃っている列のindexを参照するようにした
                this.vanishTheLine(this.Field.indexOf(line))
            }
        }

        /** 揃った列をスコアとして足す */
        this.score += countOfAlignedRow

        /** ゲームオーバーになってないか確認 */
        if (this.checkIsGameOver()) {
            // ゲーム終了
            this.isGameOver = true
            return //このあとの処理はしない
        }

        /** 補充確認 */
        this.shouldItReplenish()

        /** ホールドのロックを解除 */
        this.holdLock = false

        /** 新しいブロックを落とす */
        this.startDropping(this.nextTetriminos.shift())
    }

    /** 列を削除する */
    vanishTheLine(lineIndex){
        /** 揃った列自体を消してしまう */
        this.Field.splice(lineIndex, 1); 

        /** 消した分だけ上に加える */
        this.Field.unshift(JSON.parse(JSON.stringify(this.baseLine)))
    }

    /** nextを補充するかどうか */
    shouldItReplenish(){
        if (this.nextTetriminos.length < 7) {
            this.nextTetriminos = this.nextTetriminos.concat(this.tetriminoFactory.passSet())
        }
    }

    // 
    checkIsGameOver(){
        /** 
         * ゲームオーバーになる条件1
         * {x:3,y:0} ~ {x:6,y:0}
         * {x:3,y:1} ~ {x:6,y:1}
         * の範囲にブロックがある
         */
        for (let index = 3; index < 6; index++) {
            if (this.Field[0][index].isFill) { return true }
            if (this.Field[1][index].isFill) { return true }
        }
        return false
    }

    startInterval(){
        // .bind(this)でコールバック内でもthis.が使えるようになる
        this.autoDropIntervalId = setInterval(this.droppingTheBlock.bind(this), this.autoDropInterval);
    }

    deleteInterval(){
        clearInterval(this.autoDropIntervalId)
    }

    resetInterval(){
        this.deleteInterval()
        this.startInterval()
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