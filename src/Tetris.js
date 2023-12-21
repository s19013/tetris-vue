import Block from "./Block"
import CheckCanMove from "./CheckCanMove"
import Rotate from "./Rotate"
import Tetrimino from "./Tetrimino"
import Ojyama from "./Ojyama"

// 時間に関する数字は全部ミリ秒

export default class Tetris {
    Field = []
    autoDropIntervalId = null
    timerId = null
    ojyamaId = null
    score = 0
    level = 1
    countOfLinesVanished = 0

    /** jsの最大整数値 */
    maxScore = 9000000000000000

    /** 4列消し */
    isTetris = false

    /** 連続消し */
    ren = 0

    /** 連続4列消し */
    back2back = false

    /** フィールドの横1列の基本の形 */
    baseLine = []

    fieldWidth   = 10
    fieldHeight  = 30
    /** ユーザーから見える天井(上からの数字) */
    effectiveRoof = 10 

    checkCanMove = new CheckCanMove({
        fieldWidth:this.fieldWidth,
        fieldHeight:this.fieldHeight
    })

    rotater = new Rotate({
        fieldWidth:this.fieldWidth,
        fieldHeight:this.fieldHeight,
        checkCanMove:this.checkCanMove
    })

    ojyamaFactory = new Ojyama(this.fieldWidth)

    tetriminoFactory = new Tetrimino(this.effectiveRoof)

    /** 放置してると勝手にブロックが落ちる感覚 */
    autoDropInterval = 2000 //ms

    /** 下からせり上がるまでの時間 */
    ojyamaInterval = 10000 //ms

    /** ゲームを初めてからの時間 */
    time = 0

    /** お邪魔が発動するまでのカウントダウン */
    ojyamaCountDown = this.ojyamaInterval

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

    // ゴースト
    ghost = null
    oldGhost = null

    constructor(){
        /** 横1列を生成 */
        // これを使えば毎度毎度1ブロックずつを生成する必要がなくなる
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

    }

    /** ゲームスタートの処理 */
    gameStart(){
        // 2巡分追加しないと行けないのでこうなった
        let temp = this.tetriminoFactory.passSet()
        this.nextTetriminos = temp.concat(this.tetriminoFactory.passSet())

        this.startDropping(this.nextTetriminos.shift())
        this.startInterval()
        this.startTimer()
        this.startOjyamaInterval()
    }

    /** ブロックを落とし始める */
    startDropping(next){
        /** 厳密には新しく落とすブロックを描写 */

        /** 落ちてくるのをセット */
        this.tetrimino = next
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino))
        this.ghost = JSON.parse(JSON.stringify(this.tetrimino))
        this.oldGhost = JSON.parse(JSON.stringify(this.tetrimino))

        // 落ちてくるブロックをフィールドに出現させる
        this.moveTetrimino()
        this.moveGhost()

    }


    /** ボタン押された時の処理たち */
    keyDownUp(){
        this.hardDrop()
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

            this.addScore(1)


            this.droppingTheBlock()
        } else {
            /** 動かせないなら固定化 */
            this.immobilization()
        }

    }

    keyDownLeft(){
        /** 動かせるかどうか確認*/
        if (this.checkCanMove.left({
                Field:JSON.parse(JSON.stringify(this.Field)),
                tetrimino:this.tetrimino
            })
        ) {
            /** 今の位置を古い情報として保存 */
            this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));
            this.oldGhost = JSON.parse(JSON.stringify(this.ghost));

            /** 位置を更新 */
            for (let block of this.tetrimino.Coordinate) { block.x -= 1 }

            this.moveTetrimino()
            this.moveGhost()
        }
    }

    keyDownRight(){
        if (this.checkCanMove.right({
                Field:JSON.parse(JSON.stringify(this.Field)),
                tetrimino:this.tetrimino
            })
        ) {
            /** 今の位置を古い情報として保存 */
            this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));
            this.oldGhost = JSON.parse(JSON.stringify(this.ghost));

            /** 位置を更新 */
            for (let block of this.tetrimino.Coordinate) { block.x += 1 }

            this.moveTetrimino()
            this.moveGhost()
        }
    }

    keyDownL(){
        /** 今の位置を古い情報として保存 */
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));
        this.oldGhost = JSON.parse(JSON.stringify(this.ghost));

        /** Oミノはそもそも回さない */
        if (this.tetrimino.type == "O") {

            // 再描画するだけで早期リターン
            this.moveTetrimino()
            this.moveGhost()
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
            this.moveGhost()
            return
        }

        /** 回転した後の位置を更新 */
        this.tetrimino = this.rotater.rotation({
            Field:JSON.parse(JSON.stringify(this.Field)),
            direction:"clockwise",
            tetrimino:this.tetrimino
        })
        this.moveTetrimino()
        this.moveGhost()
    }

    keyDownJ(){

        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));
        this.oldGhost = JSON.parse(JSON.stringify(this.ghost));

        /** Oミノはそもそも回さない */
        if (this.tetrimino.type == "O") {

            // 再描画するだけで早期リターン
            this.moveTetrimino()
            this.moveGhost()
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
            this.moveGhost()
            return 
        }

        /** 回転した後の位置を更新 */
        this.tetrimino = this.rotater.rotation({
            Field:JSON.parse(JSON.stringify(this.Field)),
            direction:"counterClockwise",
            tetrimino:this.tetrimino
        })
        this.moveTetrimino()
        this.moveGhost()

    }

    keyDownSpace(){
        // ロックがかかっていたら入れ替え不可
        if (!this.holdLock) { this.hold() }
    }

    hold(){
        /** 今の位置を古い情報として保存 */
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));
        this.oldGhost = JSON.parse(JSON.stringify(this.ghost));

        // 古い場所のブロックやゴーストを消しとく
        for (let block of this.oldGhost.Coordinate) {
            this.Field[block.y][block.x].ghost = false
        }

        for (let block of this.oldTetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = false
            this.Field[block.y][block.x].isMoving = false
        }

        // ホールドしてるのを取り出す
        let holded = this.holdTetrimino

        // 保存
        this.holdTetrimino = this.tetrimino.type

        // swichだと長いのでひたすらifで良いと思う
        /** 最初のホールドだけ動きが違う */
        if (holded == "none") { this.startDropping(this.nextTetriminos.shift()) }
        else {
            if (holded == "O") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.O)) }
            else if (holded == "I") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.I)) }
            else if (holded == "T") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.T)) }
            else if (holded == "S") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.S)) }
            else if (holded == "Z") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.Z)) }
            else if (holded == "L") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.L)) }
            else if (holded == "J") { this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.J)) }
        }

        // ゴーストも更新
        this.ghost = JSON.parse(JSON.stringify(this.tetrimino));

        this.holdLock = true
        this.moveTetrimino()
        this.moveGhost()
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
        this.oldGhost = JSON.parse(JSON.stringify(this.ghost));

        /** 位置を更新 */
        for (let block of this.tetrimino.Coordinate) {
            block.y += 1
        }

        // this.moveGhost() 重くなるしほぼ意味ない
        this.moveTetrimino()
    }

    hardDrop(){
        /** 今の位置を古い情報として保存 */
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));
        this.oldGhost = JSON.parse(JSON.stringify(this.ghost));


        // 何ます動かすかしらべる(スコアで使う)
        let countOfMove = Math.abs(this.ghost.Coordinate[0].y - this.tetrimino.Coordinate[0].y)
        this.addScore(countOfMove * 2)

        // ゴーストの位置に移動する
        this.tetrimino = JSON.parse(JSON.stringify(this.ghost));

        this.moveTetrimino()
        this.moveGhost()

        // 固定化
        this.immobilization()
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

    moveGhost(){
        /** 古い場所のゴーストを消して */
        for (let block of this.oldGhost.Coordinate) {
            this.Field[block.y][block.x].ghost = false
        }

        // ghostを動かす
        this.ghost = JSON.parse(JSON.stringify(this.tetrimino))
        // falseが帰ってくるまで回し続ける
        while (this.checkCanMove.down({
            Field:JSON.parse(JSON.stringify(this.Field)),
            tetrimino:JSON.parse(JSON.stringify(this.ghost))
        })) {
            // 1つ下に動かす
            // foreachだと負担かかるかもだから
            this.ghost.Coordinate[0].y += 1
            this.ghost.Coordinate[1].y += 1
            this.ghost.Coordinate[2].y += 1
            this.ghost.Coordinate[3].y += 1
        }


        /** 新しい場所に描写 */
        for (let block of this.ghost.Coordinate) {
            this.Field[block.y][block.x].ghost = true
        }
    }

    /** 動かしているブロックを固定化する */
    immobilization(){
        // movingを外して固定化(動かせなく)する
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isMoving = false
        }
        
        // ゴーストを消す
        for (let block of this.ghost.Coordinate) {
            this.Field[block.y][block.x].ghost = false
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
        this.scoreCalculation(countOfAlignedRow)

        /** 消した列を足す */
        this.countOfLinesVanished += countOfAlignedRow

        /** レベル */
        this.checkLevel()

        /** お邪魔 */
        if (this.ojyamaCountDown <= 0) {
            this.triggeringOjyama()

            // 時間再設定
            this.ojyamaCountDown = this.ojyamaInterval
        }

        /** ゲームオーバーになってないか確認 */
        if (this.checkIsGameOver()) {
            // ゲーム終了
            this.isGameOver = true
            this.gameOver()
            return //このあとの処理はしない
        }

        /** 補充確認 */
        this.shouldItReplenish()

        /** ホールドのロックを解除 */
        this.holdLock = false

        /** 新しいブロックを落とす */
        this.startDropping(this.nextTetriminos.shift())
    }

    /** 計算 */
    scoreCalculation(countOfAlignedRow){

        // 揃った列の数

        /** 一列も揃ってない時はさっさと返す */
        if (countOfAlignedRow == 0) {
            this.back2back = false
            this.ren = 0
            return 
        }

        this.addScore(countOfAlignedRow * countOfAlignedRow * this.level * 10)

        if (countOfAlignedRow == 4) {
            this.isTetris = true

            // これは表示用なので数秒たったら消す
            setTimeout(()=> {
                this.isTetris = false
            },2000) ;
        }

        // b2b
        // this.addScore(50 * this.level)

        // ren
        this.addScore(this.ren * 10 * this.level)
        
        // renを加える
        this.ren += 1

    }

    /** スコアを加える
     * オーバーフローしないように処理するため別関数
     */
    addScore(ScoreToAdd=0){
        try {
            this.score += ScoreToAdd
            // 限界値超えないように
            if (this.score >= this.maxScore) { this.score = this.maxScore }


        } catch (error) {
            console.log(error);

            // おそらくエラーが起きるのはオーバーフローした時だと思うので最大値設定
            this.score = this.maxScore
        }
    }

    /** 列を削除する */
    vanishTheLine(lineIndex){
        /** 揃った列自体を消してしまう */
        this.Field.splice(lineIndex, 1); 

        /** 消した分だけ上に加える */
        this.Field.unshift(JSON.parse(JSON.stringify(this.baseLine)))
    }

    // お邪魔発動
    triggeringOjyama(){
        /** 一番上を消してしまう 
         * 縦のマス数が増えないように
        */
        this.Field.splice(0, 1); 

        this.Field.push(JSON.parse(JSON.stringify(this.ojyamaFactory.createOjyama())))
    }

    /** nextを補充するかどうか */
    shouldItReplenish(){
        if (this.nextTetriminos.length < 7) {
            this.nextTetriminos = this.nextTetriminos.concat(this.tetriminoFactory.passSet())
        }
    }

    // 
    checkIsGameOver(){
        /** ゲームオーバーになる条件2
         * 一番上の天井 y = 0の部分にブロックがある
         */

        for (let index = 0; index < this.fieldWidth; index++) {
            if (this.Field[0][index].isFill) { return true }
        }

        /** 
         * ゲームオーバーになる条件2
         * {x:3,y:this.effectiveRoof} ~ {x:6,y:this.effectiveRoof}
         * {x:3,y:this.effectiveRoof - 1} ~ {x:6,y:this.effectiveRoof - 1}
         * の範囲にブロックがある
         */
        for (let index = 3; index < 6; index++) {
            if (this.Field[this.effectiveRoof][index].isFill) { return true }
            if (this.Field[this.effectiveRoof - 1][index].isFill) { return true }
        }
        return false
    }

    gameOver(){
        // タイマー止める
        this.stopTimer()
        this.deleteInterval()
        this.deleteOjyamaInterval()

        // スコア集計
        this.addScore(this.time * this.level)
    }

    startOjyamaInterval(){
        this.ojyamaId = setInterval(() => {
            this.ojyamaCountDown -= 100 //ms
        },100)
    }

    deleteOjyamaInterval(){
        clearInterval(this.ojyamaId)
    }

    startTimer(){
        // 1秒ごと
        this.timerId = setInterval(() => {
            this.time += 1
        },1000)
    }

    stopTimer(){ clearInterval(this.timerId) }

    startInterval(){
        // .bind(this)でコールバック内でもthis.が使えるようになる
        this.autoDropIntervalId = setInterval(this.droppingTheBlock.bind(this), this.autoDropInterval);
    }

    deleteInterval(){ clearInterval(this.autoDropIntervalId) }

    resetInterval(){
        this.deleteInterval()
        this.startInterval()
    }

    /** レベル計測 
     *  1000ms秒ずつ短くしたいけど良い書き方が思い浮かばない
     * 単純に書くと効果が重複するし
    */
    checkLevel(){
        if (this.countOfLinesVanished >= 270) { 
            this.level = 10
            this.autoDropInterval = 1100
            this.ojyamaInterval = 6000
            return 
        }

        if (this.countOfLinesVanished >= 216) { 
            this.level = 9
            this.autoDropInterval = 1200
            this.ojyamaInterval = 7000
            return 
        }

        if (this.countOfLinesVanished >= 168) { 
            this.level = 8
            this.autoDropInterval = 1300
            this.ojyamaInterval = 8000
            return
        }

        if (this.countOfLinesVanished >= 126) { 
            this.level = 7
            this.autoDropInterval = 1400
            this.ojyamaInterval = 9000
            return
        }

        if (this.countOfLinesVanished >= 90) { 
            this.level = 6
            this.autoDropInterval = 1500
            this.ojyamaInterval = 10000
            return
        }

        if (this.countOfLinesVanished >= 60) { 
            this.level = 5
            this.autoDropInterval = 1600
            this.ojyamaInterval = 11000
            return
        }

        if (this.countOfLinesVanished >= 36) { 
            this.level = 4
            this.autoDropInterval = 1700
            this.ojyamaInterval = 12000
            return
        }

        if (this.countOfLinesVanished >= 18) { 
            this.level = 3
            this.autoDropInterval = 1800
            this.ojyamaInterval = 13000
            return
        }

        if (this.countOfLinesVanished >= 6) { 
            this.level = 2
            this.autoDropInterval = 1900
            this.ojyamaInterval = 14000
            return
        }
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