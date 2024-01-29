import Field from "./Field.js"
import Ojyama from "./Ojyama.js"
import CheckCanMove from "./CheckCanMove"
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
    tetrimino = new Tetrimino({type:"none",coordinate:[{x:null,y:null}]})

    /** ゲームオーバー画面をvueで表示させる時に必要 */
    isGameOver = false

    // ゴースト
    ghost = {}

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

        // 落ちてくるブロックをフィールドに出現させる
        this.reRenderGhost()

    }


    /** ボタン押された時の処理たち */
    keyDownUp(){
        this.hardDrop()
    }

    keyDownDown(){
        /** 動かせるかどうか確認*/
        if (this.checkCanMove.down({
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
        if (this.checkCanMove.left({
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
        if (this.checkCanMove.right({
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
        // このロジックreRenderTetriminoに分けたほうがよい?

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

        /** 位置を更新 */
        this.tetrimino.moveDown()
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
        while (this.checkCanMove.down({
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
        // 固定化したテトリミノはフィールドクラスに情報を渡したのでもう表示しなくて良い
        // だからここでリセットする
        // そしてリセットしないと揃ったアニメーションが阻害される

        // 今は問題がないが､描写関連でエラーがでたらおそらくここが問題だと思う
        this.tetrimino = new Tetrimino({type:"none",coordinate:[{x:null,y:null}]})
        this.ghost = new Tetrimino({type:"none",coordinate:[{x:null,y:null}]})


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
            // 演出の関係上一旦処理を止める
            await this.sleep(800) 

            /** 揃っている列を消す */
            this.Field.vanishAlignedRows()

            /** レベル計算 */
            this.calculateLevel()
        }

        /** おじゃまを発動できるか調べて実行 */
        if (this.ojyama.checkWhetherToExecuteOjyama()) {
            this.Field = this.ojyama.insertOjyama(this.Field)
            // おじゃまブロックの挿入後に短い遅延を入れることで、ゲームプレイの流れを自然にする
            await this.sleep(600)
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

    async sleep(ms){
        this.enableSleeping()
        await new Promise(resolve => setTimeout(resolve, ms))
        this.disableSleeping()
    }
}