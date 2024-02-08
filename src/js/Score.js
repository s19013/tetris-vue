export default class Score{
    constructor() {
        /** jsの最大整数値 */
        this.maxScore = 900000000000000

        this.score = 0

        /** 4列消し */
        this.isTetris = false

        /** 連続消し */
        this.ren = 0

        /** 連続4列消し */
        this.back2back = false

        // 通常消しの得点
        this.points = [0,100,300,500,800]

        // Tスピンの得点
        this.tspinPoints = [400,800,1200,1600]

        // パーフェクトクリア得点
        this.PerfectClearPoints = [800,1000,1800,2000]
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

    scoreCalculater({base,level}){
        // (基本スコア+RENスコア)*レベル*BackToBack+追加スコア
        // b2b成立時1.5倍 不成立時1倍

        // 追加スコアはまだ未実装

        let b2bCorrection = 1
        if (this.back2back) { b2bCorrection = 1.5 }

        this.addScore((base+this.ren)*level*b2bCorrection)
    }

    // Tスピン用
    TspinCalculation({countOfAlignedRows,level}){
        if (countOfAlignedRows == 0) { this.disableFlags() }

        this.scoreCalculater({
            base:this.tspinPoints[countOfAlignedRows],
            level:level
        })

        // renを加える
        this.ren += countOfAlignedRows

        if (countOfAlignedRows > 0) { this.back2back = true }
    }

    // 他のミノ用
    calculation({countOfAlignedRows,level}){
        if (countOfAlignedRows == 0) { this.disableFlags() }

        this.scoreCalculater({
            base:this.points[countOfAlignedRows],
            level:level
        })

        // renを加える
        this.ren += countOfAlignedRows

        // b2b発動は消した後
        if (countOfAlignedRows == 4) {
            this.back2back = true
            this.enableIsTetrisFlag()
        }
    }

    disableFlags(){
        this.back2back = false
        this.ren = 0
    }

    enableIsTetrisFlag(){
        this.isTetris = true
        // これは表示用なので数秒たったら消す
        setTimeout(()=> {
            this.isTetris = false
        },2000) ;
    }
}