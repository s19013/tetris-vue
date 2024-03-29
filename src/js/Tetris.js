import Field from "./Field.js"
import Ojyama from "./Ojyama.js"
import * as checkCanMove from "./CheckCanMove"
import Next from "./Next.js"
import Hold from "./Hold.js"
import Score from "./Score.js"
import GameOverPolicty from "./GameOver/GameOverPolicy.js"
import {levelConfig} from "./Level.js"
import Tetrimino from "./Tetrimino/Tetrimino.js"
import lodash from 'lodash';


// 時間に関する数字は全部ミリ秒

export default class Tetris {
    autoDropIntervalId = 0
    timerId = 0
    level = 1
    countOfLinesVanished = 0

    sleeping = false

    // new する奴ら
    Field = new Field()

    ojyama = new Ojyama()

    /** nextテトリミノ達 */
    next = new Next()

    score = new Score()

    /** ホールド */
    hold = new Hold()

    /** ゲームオーバー条件たち */
    gameOverPolicty = new GameOverPolicty()

    /** 放置してると勝手にブロックが落ちる感覚 */
    autoDropInterval = 2000 //ms

    /** ゲームを初めてからの時間 */
    time = 0

    /** 動かせるブロックたちの座標 と ブロックの種類*/
    tetrimino = new Tetrimino({type:"none",coordinate:[{x:null,y:null}]})

    // ゴースト
    ghost = new Tetrimino({type:"none",coordinate:[{x:null,y:null}]})

    /** ゲームオーバー画面をvueで表示させる時に必要 */
    isGameOver = false

    // 
    init(){
        this.Field.generateField()
    }

    /** ゲームスタートの処理 */
    gameStart(){
        this.startDropping(this.next.getNextTetrimino())
        this.startInterval()
        this.startTimer()
        this.ojyama.startInterval()
    }

    /** ブロックを落とし始める */
    startDropping(next){
        /** 厳密には新しく落とすブロックを描写 */

        /** 落ちてくるのをセット */
        this.tetrimino = next
        this.ghost = lodash.cloneDeep(this.tetrimino)

        // 落ちてくるブロックをフィールドに出現させる
        this.reRenderGhost()

    }


    /** ボタン押された時の処理たち */
    keyDownUp(){
        this.hardDrop()
    }

    keyDownDown(){
        /** 動かせるかどうか確認*/
        if (checkCanMove.down({
                Field:this.Field,
                tetrimino:this.tetrimino
            })
        ) {
            /** 自動落下のインターバルリセット 
             *  自動落下と重なって2重に落ちるのを防ぐ
            */
            this.resetInterval()

            this.score.addScore(1)


            this.droppingTheBlock()
        } else {
            /** 動かせないなら固定化 */
            this.immobilization()
        }

    }

    keyDownLeft(){
        /** 動かせるかどうか確認*/
        if (checkCanMove.left({
                Field:this.Field,
                tetrimino:this.tetrimino
            })
        ) {
            /** 位置を更新 */
            this.tetrimino.moveLeft()

            this.reRenderGhost()
        }
    }

    keyDownRight(){
        if (checkCanMove.right({
                Field:this.Field,
                tetrimino:this.tetrimino
            })
        ) {
            /** 位置を更新 */
            this.tetrimino.moveRight()

            this.reRenderGhost()
        }
    }

    keyDownL(){
        this.tetrimino.clockwise(this.Field)
        this.reRenderGhost()
    }

    keyDownJ(){
        this.tetrimino.counterClockwise(this.Field)
        this.reRenderGhost()

    }

    keyDownSpace(){
        // ロックがかかっていたら入れ替え不可
        if (this.hold.cannotHold) { return  }

        // ホールドしてるのを取り出す
        let tetriminoTakenOut = this.hold.takeOut()

        // 保存
        this.hold.doHold(this.tetrimino)

        /** 最初だけは保存だけして次のテトリミノ落とす*/
        if (tetriminoTakenOut.type === "none") {
            /** 新しいブロックを落とす */
            this.startDropping(this.next.getNextTetrimino())
        } else {
            // 取り出したのを落とす
            this.startDropping(tetriminoTakenOut)
        }
    }

    droppingTheBlock(){
        if (checkCanMove.down({
            Field:this.Field,
            tetrimino:this.tetrimino
        })
        ) {
            /** 位置を更新 */
            this.tetrimino.moveDown()
            return 
        }

        /** 動かせないなら固定化する */
        this.immobilization()
    }

    hardDrop(){
        // 何ます動かすかしらべる(スコアで使う)
        let countOfMove = Math.abs(this.ghost.coordinate.status[0].y - this.tetrimino.coordinate.status[0].y)
        this.score.addScore(countOfMove * 2)

        // ゴーストの位置に移動する
        this.tetrimino = lodash.cloneDeep(this.ghost);
        this.reRenderGhost()

        // 固定化
        this.immobilization()
    }

    reRenderGhost(){
        // ghostを動かすための準備
        this.ghost = lodash.cloneDeep(this.tetrimino)

        // ブロックを限界が来るまで下に動かす
        // falseが帰ってくるまで回し続ける
        while (checkCanMove.down({
            Field:this.Field,
            tetrimino:this.ghost
        })) {
            // 1つ下に動かす
            this.ghost.moveDown()
        }
    }

    /** 動かしているブロックを固定化する */
    async immobilization(){
        this.Field.immobilization(this.tetrimino)
        this.ProcessingAfterImmobilization()
    }

    /** 固定化した後にする処理を全部まとめた */
    // 今は適切な分け方がわからない
    async ProcessingAfterImmobilization(){
        /** 揃っているかを調べる */
        const countOfAlignedRows = this.Field.countAlignedRows()

        // スコア計算
        this.scoreCalculation(countOfAlignedRows)

        /** 消した列の合計に足す */
        this.countOfLinesVanished += countOfAlignedRows

        /** レベル計算 */
        this.calculateLevel(countOfAlignedRows)

        // 固定化したテトリミノはフィールドクラスに情報を渡したのでもう表示しなくて良い
        // だからここでリセットする
        // そしてリセットしないと揃ったアニメーションが阻害される

        // 今は問題がないが､描写関連でエラーがでたらおそらくここが問題だと思う
        this.resetTetrimino()
        this.resetGhost()

        // 揃ってる列があるなら消す
        await this.vanishAlignedRows(countOfAlignedRows)

        // パフェクリしてるか調べる
        if (this.Field.isPerfectClear()) {
            this.score.perfectClearCalculation(countOfAlignedRows)
        }

        // 状況によってはおじゃま発動を発動させる
        await this.insertOjyama()

        /** ゲームオーバーになっているかどうか調べる */
        // trueが帰ってきたら､次のテトリミノを落とさずゲームオーバー処理に移る
        if (this.gameOverPolicty.isGameOver(this.Field)) {
            this.gameOver()
            return 
        }

        // 次のテトリミノを落とす
        this.dropNextTetrimino()
    }

    resetTetrimino(){
        this.tetrimino = new Tetrimino({type:"none",coordinate:[{x:null,y:null}]})
    }

    resetGhost(){
        this.ghost = new Tetrimino({type:"none",coordinate:[{x:null,y:null}]})
    }

    // スコア計算
    scoreCalculation(countOfAlignedRows){
        // 以下の3つのパターンがある
        // * そもそもTミノじゃない
        // * TみのでTスピンが成立してる
        // * TミノだけどTスピンじゃなかった
        
        if (this.tetrimino.type != "T") {
            this.score.calculation({countOfAlignedRows:countOfAlignedRows,level:this.level})
            return
        }

        // Tスピンminiかどうか調べる
        if (this.tetrimino.tSpinMini) {
            this.score.TspinCalculation({countOfAlignedRows:countOfAlignedRows,level:this.level,tSpinMini:true})
            return
        }
        
        // Tスピンかどうか調べる
        if (this.tetrimino.tSpin) {
            this.score.TspinCalculation({countOfAlignedRows:countOfAlignedRows,level:this.level})
            return
        }

        // TミノだけどTスピンじゃなかった時
        this.score.calculation({countOfAlignedRows:countOfAlignedRows,level:this.level})
    }

    // レベル計算
    calculateLevel(countOfAlignedRows){
        // 揃ってる列が1つも無いなら動かす必要がない
        if (countOfAlignedRows === 0) {return }

        const currentLevel = levelConfig.find(config => this.countOfLinesVanished >= config.threshold);
        this.level = currentLevel.level
        this.autoDropInterval = currentLevel.autoDropInterval
        this.ojyama.predeterminedTimeSetter(currentLevel.ojyamaInterval)
    }

    async vanishAlignedRows(countOfAlignedRows){
        if (countOfAlignedRows === 0) { return }

        // 演出の関係上一旦処理を止める
        await this.sleep(800) 

        /** 揃っている列を消す */
        this.Field.vanishAlignedRows()
    }

    async insertOjyama(){
        /** おじゃまを発動できるか調べて実行 */
        if (this.ojyama.checkWhetherToExecuteOjyama()) {
            this.Field = this.ojyama.insertOjyama(this.Field)
            // おじゃまブロックの挿入後に短い遅延を入れることで、ゲームプレイの流れを自然にする
            await this.sleep(600)
        }
    }

    /** 次のテトリミノを落とす */
    dropNextTetrimino(){
        /** 補充確認 */
        this.next.checkWhetherToReplenish()

        /** ホールドのロックを解除 */
        this.hold.unlock()

        /** 新しいブロックを落とす */
        this.startDropping(this.next.getNextTetrimino())
    }

    gameOver(){
        // Vueの方でゲームオーバー画面を表示させたりするのに必要
        this.isGameOver = true

        // タイマー止める
        this.stopTimer()
        this.deleteInterval()
        this.ojyama.deleteInterval()

        // スコア集計
        this.score.addScore(this.time * this.level)
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
        this.autoDropIntervalId = setInterval(() => {
            if(this.sleeping){ return }
            this.droppingTheBlock()
        }, this.autoDropInterval);
    }

    deleteInterval(){ clearInterval(this.autoDropIntervalId) }

    resetInterval(){
        this.deleteInterval()
        this.startInterval()
    }

    enableSleeping(){
        this.sleeping = true
        this.ojyama.enableSleeping()
    }
    disableSleeping(){
        this.sleeping = false
        this.ojyama.disableSleeping()
    }

    async sleep(ms){
        this.enableSleeping()
        await new Promise(resolve => setTimeout(resolve, ms))
        this.disableSleeping()
    }
}