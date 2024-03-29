export default class Score{
    constructor() {
        /** jsの最大整数値 */
        this.maxScore = 900000000000000

        this.score = 0

        /** 連続消し */
        this.ren = 0

        // 通常消しの得点
        this.points = [0,100,300,500,800]

        // Tスピンの得点
        this.tspinPoints = [400,800,1200,1600]

        // パーフェクトクリア得点
        this.PerfectClearPoints = [800,1000,1800,2000]

        /** 連続特殊消しトリガー */
        this.back2back = false

        // 描写用 コールバック関数を収納する
        /** 4列消し */
        this.enableIsTetris = null

        /** 連続特殊消し */
        this.enableIsB2B = null

        /** パフェクリ */
        this.enableIsPerfectClear = null

        /** Tスピン */
        this.enableIsTspin = null

        this.setTspinType = null

        // Tスピンで消した数で表示するラベル
        this.TspinTypeLabels = ["","Single","Double","Triple"]
    }

    setCallbacks({
        enableIsTetris,
        enableIsB2B,
        enableIsTspin,
        enableIsPerfectClear,
        setTspinType
    }){
        this.enableIsTetris = enableIsTetris
        this.enableIsB2B = enableIsB2B
        this.enableIsTspin = enableIsTspin
        this.enableIsPerfectClear = enableIsPerfectClear
        this.setTspinType = setTspinType
    }

    /** スコアを加える
     * オーバーフローしないように処理するため別関数
     */
    addScore(ScoreToAdd=0){
        // aiが提示してくれたやり方をさいよう
            // ScoreToAddが数値であることを確認するためにtypeofを使用する
            // Math.min関数を使用して、this.scoreにScoreToAddを加算した結果がthis.maxScoreを超えないようにする。
         if (typeof ScoreToAdd === 'number') { this.score = Math.min(this.score + ScoreToAdd, this.maxScore); } 
         else { console.error('Invalid score addition: ', ScoreToAdd); }
    }

    scoreCalculater({base,level,bonus=0}){
        // (基本スコア+RENスコア)*レベル*BackToBack+追加スコア
        // b2b成立時1.5倍 不成立時1倍

        // 追加スコアはまだ未実装

        let b2bCorrection = 1
        if (this.back2back) { b2bCorrection = 1.5 }

        this.addScore((base+this.ren)*level*b2bCorrection + bonus)
    }

    // Tスピン用
    // フラグ引数は良くないというけどほとんどやること同じなんだもん
    TspinCalculation({countOfAlignedRows,level,tSpinMini=false}){
        if (tSpinMini) { this.setTspinType("mini") }
        else { this.setTspinType(this.TspinTypeLabels[countOfAlignedRows]) }
        this.enableIsTspin()

        if (countOfAlignedRows == 0) { 
            this.resetRen()
            this.back2back = false
            return
        }

        this.scoreCalculater({
            base:this.tspinPoints[countOfAlignedRows],
            level:level,
            bonus:tSpinMini ? 100 : 0
        })

        // renを加える
        this.ren += countOfAlignedRows

        // b2b発動は最後
        // フロントにb2bを表示するのはすでにb2bが発動してる時
        if (this.back2back) { this.enableIsB2B() }
        this.back2back = true
    }
    // 他のミノ用
    calculation({countOfAlignedRows,level}){
        if (countOfAlignedRows == 0) {
            this.resetRen() 
            return
        }

        this.scoreCalculater({
            base:this.points[countOfAlignedRows],
            level:level
        })

        // renを加える
        this.ren += countOfAlignedRows

        // b2b発動は消した後
        if (countOfAlignedRows == 4) {
            // フロントにb2bを表示するのはすでにb2bが発動してる時
            if (this.back2back) { this.enableIsB2B() }
            this.back2back = true
            this.enableIsTetris()
        } 
        else { this.back2back = false}
    }

    // パフェクリ用の計算
    perfectClearCalculation(countOfAlignedRows){
        this.enableIsPerfectClear()
        this.addScore(this.PerfectClearPoints[countOfAlignedRows])
    }

    resetRen(){ this.ren = 0 }
}