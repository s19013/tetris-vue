import Block from "./Block"
import CheckCanMove from "./CheckCanMove"
import Rotate from "./Rotate"
import Tetrimino from "./Tetrimino"
import {levelConfig} from "./Level.js"
import {fieldWidth,fieldHeight,effectiveRoof} from "./Config"
import Score from "./Score.js"
import * as Utils from  './TetrisUtils'
import lodash from 'lodash';

// 時間に関する数字は全部ミリ秒

export default class Tetris {
    Field = []

    autoDropIntervalId = null
    timerId = null
    ojyamaId = null

    level = 1
    countOfLinesVanished = 0

    sleeping = false

    /** 各列の状態 埋まっているブロックの数 */
    rowStatus = []

    /** フィールドの横1列の基本の形 */
    baseLine = []

    // new する奴ら

    checkCanMove = new CheckCanMove()

    rotater = new Rotate({
        checkCanMove:this.checkCanMove
    })

    tetriminoFactory = new Tetrimino(effectiveRoof)

    score = new Score()

    /** 放置してると勝手にブロックが落ちる感覚 */
    autoDropInterval = 2000 //ms

    /** 下からせり上がるまでの時間 */
    ojyamaInterval = 15000 //ms

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
        // rowStatusを全部0で埋める
        for (let index = 0; index < fieldHeight; index++) {
            this.rowStatus.push(0)
        }

        /** 横1列を生成 */
        // これを使えば毎度毎度1ブロックずつを生成する必要がなくなる
        for (let n = 0; n < fieldWidth; n++) {
            this.baseLine.push(new Block())
        }

        /** 縦を生成 */
        for (let i = 0; i < fieldHeight; i++) {
            this.Field.push(lodash.cloneDeep(this.baseLine))
        }

        this.gameStart()
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
        this.ghost = lodash.cloneDeep(this.tetrimino)
        this.saveCurrentPosition()

        // 落ちてくるブロックをフィールドに出現させる
        this.moveTetrimino()
        this.moveGhost()

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
            for (let block of this.tetrimino.Coordinate) { block.x -= 1 }

            this.moveTetrimino()
            this.moveGhost()
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
            for (let block of this.tetrimino.Coordinate) { block.x += 1 }

            this.moveTetrimino()
            this.moveGhost()
        }
    }

    keyDownL(){
        this.saveCurrentPosition()

        /** Oミノはそもそも回さない */
        if (this.tetrimino.type == "O") { return }

        /** Iミノは回し方が特殊 */
        if (this.tetrimino.type == "I") {
            this.tetrimino = this.rotater.counterClockwise({
                Field:lodash.cloneDeep(this.Field),
                tetrimino:this.tetrimino
            })
        } else {
            /** 回転した後の位置を更新 */
            this.tetrimino = this.rotater.clockwise({
                Field:lodash.cloneDeep(this.Field),
                tetrimino:this.tetrimino
            })
        }

        this.moveTetrimino()
        this.moveGhost()
    }

    keyDownJ(){
        this.saveCurrentPosition()

        /** Oミノはそもそも回さない */
        if (this.tetrimino.type == "O") {return }

        /** Iミノは回し方が逆 */
        if (this.tetrimino.type == "I") {
            this.tetrimino = this.rotater.clockwise({
                Field:lodash.cloneDeep(this.Field),
                tetrimino:this.tetrimino
            })
        } else {
            /** 回転した後の位置を更新 */
            this.tetrimino = this.rotater.counterClockwise({
                Field:lodash.cloneDeep(this.Field),
                tetrimino:this.tetrimino
            })
        }

        this.moveTetrimino()
        this.moveGhost()

    }

    keyDownSpace(){
        // ロックがかかっていたら入れ替え不可
        if (!this.holdLock) { this.hold() }
    }

    hold(){
        this.saveCurrentPosition()

        // 古い場所のブロックやゴーストを消しとく
        this.Field = Utils.undisplayGhost({Field:this.Field,ghost:this.oldGhost})

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
        if (holded == "none") { this.dropNextTetrimino() }
        else {
            if (holded == "O") { this.tetrimino = lodash.cloneDeep(this.tetriminoFactory.O) }
            else if (holded == "I") { this.tetrimino = lodash.cloneDeep(this.tetriminoFactory.I) }
            else if (holded == "T") { this.tetrimino = lodash.cloneDeep(this.tetriminoFactory.T) }
            else if (holded == "S") { this.tetrimino = lodash.cloneDeep(this.tetriminoFactory.S) }
            else if (holded == "Z") { this.tetrimino = lodash.cloneDeep(this.tetriminoFactory.Z) }
            else if (holded == "L") { this.tetrimino = lodash.cloneDeep(this.tetriminoFactory.L) }
            else if (holded == "J") { this.tetrimino = lodash.cloneDeep(this.tetriminoFactory.J) }
        }

        // ゴーストも更新
        this.ghost = lodash.cloneDeep(this.tetrimino);

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
        for (let block of this.tetrimino.Coordinate) {
            block.y += 1
        }

        // this.moveGhost() 重くなるしほぼ意味ない
        this.moveTetrimino()
    }

    hardDrop(){
        this.saveCurrentPosition()

        // 何ます動かすかしらべる(スコアで使う)
        let countOfMove = Math.abs(this.ghost.Coordinate[0].y - this.tetrimino.Coordinate[0].y)
        this.score.addScore(countOfMove * 2)

        // ゴーストの位置に移動する
        this.tetrimino = lodash.cloneDeep(this.ghost);

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
        this.Field = Utils.undisplayGhost({Field:this.Field,ghost:this.oldGhost})

        // ghostを動かす
        this.ghost = lodash.cloneDeep(this.tetrimino)

        // どこまでブロックを下ろせるか調べる
        // falseが帰ってくるまで回し続ける
        while (this.checkCanMove.down({
            Field:lodash.cloneDeep(this.Field),
            tetrimino:lodash.cloneDeep(this.ghost)
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
    async immobilization(){
        // movingを外して固定化(動かせなく)する
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isMoving = false
        }
        
        this.Field = Utils.undisplayGhost({Field:this.Field,ghost:this.ghost})

        this.ProcessingAfterImmobilization()
    }

    /** 固定化した後にする処理を全部まとめた */
    async ProcessingAfterImmobilization(){
        this.updateRowStatus()

        /** 揃っているかを調べる */
        let countOfAlignedRow = this.rowStatus.reduce((count,status)=>{
            // 要素がフィールド幅と一緒だった時 -> 1列に全部埋まっている時
            if(status == fieldWidth){ count += 1 } 
            return count
          }, 0)

        /** 揃った列をスコアとして足す */
        this.score.calculation({
            countOfAlignedRow:countOfAlignedRow,
            level:this.level
        })

        /** 消した列を足す */
        this.countOfLinesVanished += countOfAlignedRow

        if (countOfAlignedRow > 0) {
            this.EnableLined()

            // 演出の関係上一旦処理を止める
            this.sleeping = true
            await Utils.sleep(800) 
            this.sleeping = false

            /** 揃っている列を消す */
            this.vanishAlignedRows()

            /** レベル計算 */
            this.calculateLevel()
        }

        /** おじゃまを発動できるか調べる */
        this.checkWhetherToExecuteOjyama()

        /** ゲームオーバーになっているかどうか調べる */
        // trueが帰ってきたら､次のテトリミノを落とさない
        if (this.checkIsItGameOver()) {return }

        // 次のテトリミノを落とす
        this.dropNextTetrimino()
    }

    /** 各列が何マス埋まっているのか確認する */
    updateRowStatus(){
        for (let index = 0; index < fieldHeight; index++) {
            /** 配列の中身を全部足す */
            this.rowStatus[index] = this.Field[index].reduce((a,b) => {
                return a + Number(b.isFill);
            },0);
        }
    }

    // 揃っている列に色を塗る
    EnableLined(){
        for (let index = 0; index < fieldHeight; index++) {
            // 揃っていたらlinedプロパティをtrueにする
            if (this.rowStatus[index] == fieldWidth) { 
                for (const block of this.Field[index]) { block.lined = true } 
            }
        }
    }

    // レベル計算
    calculateLevel(){
        const currentLevel = levelConfig.find(config => this.countOfLinesVanished >= config.threshold);
        this.level = currentLevel.level
        this.autoDropInterval = currentLevel.autoDropInterval
        this.ojyamaInterval = currentLevel.ojyamaInterval
    }

    /** お邪魔を実行するか確認 */
    checkWhetherToExecuteOjyama(){
        if (this.ojyamaCountDown <= 0) {
            // お邪魔発動 
            // シミュレートしないから直接入れて大丈夫なはず
            this.Field = Utils.insertOjyama(this.Field)

            // 時間再設定
            this.ojyamaCountDown = this.ojyamaInterval
        }
    }

    /** ゲームオーバーになってないか確認 */
    checkIsItGameOver(){
        if (
            Utils.gameOverCondition1(lodash.cloneDeep(this.Field)) ||
            Utils.gameOverCondition2(lodash.cloneDeep(this.Field))
            ) {
            // ゲーム終了
            this.isGameOver = true
            this.gameOver()
            return true //ゲームオーバーならこのあとの処理はしない
        }
        return false
    }

    /** 次のテトリミノを落とす */
    dropNextTetrimino(){
        /** 補充確認 */
        this.shouldItReplenish()

        /** ホールドのロックを解除 */
        this.holdLock = false

        /** 新しいブロックを落とす */
        this.startDropping(this.nextTetriminos.shift())
    }

    /** 列を削除する */
    vanishAlignedRows(){
        // 4列以上揃うのはありえないのでループする最大の数を設定
        for (let index = 0; index < 4; index++) {

            // 全部埋まっている行を探す
            let FoundedIndex = this.rowStatus.indexOf(fieldWidth)

            // 見つからなかったら -1が帰ってくるのでそれ以外の値なら良い
            if (FoundedIndex > -1) {
                /** 揃った列自体を消してしまう */
                this.Field.splice(FoundedIndex, 1);

                /** 消した分だけ上に加える */
                this.Field.unshift(lodash.cloneDeep(this.baseLine))

                // rowStatusの情報が古いままだと同じindex番号を削除し続けてしまうから
                // 列を削除したら都度更新する必要がある
                this.updateRowStatus()
            } else { break }
        }
    }

    /** 今の位置を古い情報として保存 */
    saveCurrentPosition(){
        this.oldTetrimino = lodash.cloneDeep(this.tetrimino);
        this.oldGhost = lodash.cloneDeep(this.ghost);
    }

    /** nextを補充するかどうか */
    shouldItReplenish(){
        if (this.nextTetriminos.length < 7) {
            this.nextTetriminos = this.nextTetriminos.concat(this.tetriminoFactory.passSet())
        }
    }

    gameOver(){
        // タイマー止める
        this.stopTimer()
        this.deleteInterval()
        this.deleteOjyamaInterval()

        // スコア集計
        this.score.addScore(this.time * this.level)
    }

    startOjyamaInterval(){
        this.ojyamaId = setInterval(() => {
            if(this.sleeping){ return }
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
}