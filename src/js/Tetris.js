import Field from "./Field.js"
import Ojyama from "./Ojyama.js"
import CheckCanMove from "./CheckCanMove"
import Next from "./Next.js"
import Hold from "./Hold.js"
import Score from "./Score.js"
import GameOverPolicty from "./GameOver/GameOverPolicy.js"
import {levelConfig} from "./Level.js"
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

    checkCanMove = new CheckCanMove()

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
    tetrimino = {}

    /** 動かす前のブロックの位置 */
    oldTetrimino = {}

    /** ゲームオーバー画面をvueで表示させる時に必要 */
    isGameOver = false

    // ゴースト
    ghost = {}
    oldGhost = {}

    constructor(){
        this.Field.generateField()

        this.gameStart()
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
        this.saveCurrentPosition()

        // 落ちてくるブロックをフィールドに出現させる
        this.reRenderTetrimino()
        this.reRenderGhost()

    }


    /** ボタン押された時の処理たち */
    keyDownUp(){
        this.hardDrop()
    }

    keyDownDown(){
        /** 動かせるかどうか確認*/
        if (this.checkCanMove.down({
                Field:lodash.cloneDeep(this.Field),
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
        if (this.checkCanMove.left({
                Field:lodash.cloneDeep(this.Field),
                tetrimino:this.tetrimino
            })
        ) {
            this.saveCurrentPosition()

            /** 位置を更新 */
            this.tetrimino.moveLeft()

            this.reRenderTetrimino()
            this.reRenderGhost()
        }
    }

    keyDownRight(){
        if (this.checkCanMove.right({
                Field:lodash.cloneDeep(this.Field),
                tetrimino:this.tetrimino
            })
        ) {
            this.saveCurrentPosition()

            /** 位置を更新 */
            this.tetrimino.moveRight()

            this.reRenderTetrimino()
            this.reRenderGhost()
        }
    }

    keyDownL(){
        this.saveCurrentPosition()

        this.tetrimino.clockwise(lodash.cloneDeep(this.Field))

        this.reRenderTetrimino()
        this.reRenderGhost()
    }

    keyDownJ(){
        this.saveCurrentPosition()

        this.tetrimino.counterClockwise(lodash.cloneDeep(this.Field))

        this.reRenderTetrimino()
        this.reRenderGhost()

    }

    keyDownSpace(){
        // ロックがかかっていたら入れ替え不可
        if (this.hold.cannotHold) { return  }

        this.saveCurrentPosition()

        // 古い場所のテトリミノやゴーストを消しとく
        this.Field.undisplayTetrimino(this.oldTetrimino)
        this.Field.undisplayGhost(this.oldGhost)

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
        // このロジックreRenderTetriminoに分けたほうがよい?

        /** 動かせないなら固定化する 
         *  下記のコードは自動落下用
        */
        if (this.checkCanMove.down({
                Field:lodash.cloneDeep(this.Field),
                tetrimino:this.tetrimino
            })
            == false
        ) {
            this.immobilization()
            return 
        }

        /** 動かせるようなら下に動かす */
        this.saveCurrentPosition()

        /** 位置を更新 */
        this.tetrimino.moveDown()

        // this.reRenderGhost() 重くなるしほぼ意味ない
        this.reRenderTetrimino()
    }

    hardDrop(){
        this.saveCurrentPosition()

        // 何ます動かすかしらべる(スコアで使う)
        let countOfMove = Math.abs(this.ghost.coordinate.status[0].y - this.tetrimino.coordinate.status[0].y)
        this.score.addScore(countOfMove * 2)

        // ゴーストの位置に移動する
        this.tetrimino = lodash.cloneDeep(this.ghost);

        this.reRenderTetrimino()
        this.reRenderGhost()

        // 固定化
        this.immobilization()
    }

    reRenderTetrimino(){
        /** 古い場所のブロックを消して */
        this.Field.undisplayTetrimino(this.oldTetrimino)

        /** 新しい場所に描写 */
        this.Field.displayTetrimino(this.tetrimino)
    }

    reRenderGhost(){
        /** 古い場所のゴーストを消して */
        this.Field.undisplayGhost(this.oldGhost)

        // ghostを動かすための準備
        this.ghost = lodash.cloneDeep(this.tetrimino)

        // ブロックを限界が来るまで下に動かす
        // falseが帰ってくるまで回し続ける
        while (this.checkCanMove.down({
            Field:lodash.cloneDeep(this.Field),
            tetrimino:lodash.cloneDeep(this.ghost)
        })) {
            // 1つ下に動かす
            this.ghost.moveDown()
        }

        this.Field.displayGhost(this.ghost)
    }

    /** 動かしているブロックを固定化する */
    async immobilization(){
        this.Field.immobilization(this.tetrimino)
        
        this.Field.undisplayGhost(this.ghost)

        this.ProcessingAfterImmobilization()
    }

    /** 固定化した後にする処理を全部まとめた */
    async ProcessingAfterImmobilization(){
        /** 揃っているかを調べる */
        let countOfAlignedRow = this.Field.countAlignedRows()

        /** 揃った列をスコアとして足す */
        this.score.calculation({
            countOfAlignedRow:countOfAlignedRow,
            level:this.level
        })

        /** 消した列の合計に足す */
        this.countOfLinesVanished += countOfAlignedRow

        if (countOfAlignedRow > 0) {
            this.Field.EnableLined()

            // 演出の関係上一旦処理を止める
            this.enableSleeping()
            await this.sleep(800) 
            this.disableSleeping()

            /** 揃っている列を消す */
            this.Field.vanishAlignedRows()

            /** レベル計算 */
            this.calculateLevel()
        }

        /** おじゃまを発動できるか調べて実行 */
        if (this.ojyama.checkWhetherToExecuteOjyama()) {
            this.Field = this.ojyama.insertOjyama(this.Field)
        }

        /** ゲームオーバーになっているかどうか調べる */
        // trueが帰ってきたら､次のテトリミノを落とさずゲームオーバー処理に移る
        if (this.gameOverPolicty.isGameOver(this.Field)) {
            // ゲームオーバー画面を表示させる
            this.isGameOver = true
            this.gameOver()
            return 
        }

        // 次のテトリミノを落とす
        this.dropNextTetrimino()
    }

    // レベル計算
    calculateLevel(){
        const currentLevel = levelConfig.find(config => this.countOfLinesVanished >= config.threshold);
        this.level = currentLevel.level
        this.autoDropInterval = currentLevel.autoDropInterval
        this.ojyama.predeterminedTimeSetter(currentLevel.ojyamaInterval)
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

    /** 今の位置を古い情報として保存 */
    saveCurrentPosition(){
        this.oldTetrimino = lodash.cloneDeep(this.tetrimino);
        this.oldGhost = lodash.cloneDeep(this.ghost);
    }

    gameOver(){

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

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
}