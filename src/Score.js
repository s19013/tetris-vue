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

    /** 計算 */
    calculation({countOfAlignedRow,level}){

        /** 一列も揃ってない時はさっさと返す */
        if (countOfAlignedRow == 0) {
            this.back2back = false
            this.ren = 0
            return 
        }

        this.addScore(countOfAlignedRow * countOfAlignedRow * level * 10)

        if (countOfAlignedRow == 4) {
            this.isTetris = true

            // これは表示用なので数秒たったら消す
            setTimeout(()=> {
                this.isTetris = false
            },2000) ;
        }

        // b2b
        // this.addScore(50 * level)

        // ren
        this.addScore(this.ren * 10 * level)
        
        // renを加える
        this.ren += countOfAlignedRow
    }
}