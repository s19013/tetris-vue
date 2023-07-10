import Block from "./Block"
import CheckCanMove from "./CheckCanMove"
import Rotate from "./Rotate"
import Tetrimino from "./Tetrimino"

// 時間に関する数字は全部ミリ秒

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
        fieldHeight:this.fieldHeight
    })

    tetriminoFactory = new Tetrimino()

    /** 放置してると勝手にブロックが落ちる感覚 */
    autoDropInterval = 1000 //ms

    /** タイマー系 */
    /** 接地面についてから固定までの猶予 */
    graceTimeUntilFixation = 2000 //ms


    /** 動かせるブロックたちの座標 と ブロックの種類*/
    tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.T));

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

        // 適当に色を塗ってみる
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
            this.Field[block.y][block.x].moving = true
        }
        this.Field[8][0].isFill = true
        this.Field[8][9].isFill = true


        // .bind(this)でthis.が使えるようになる
        this.autoDropIntervalId = setInterval(this.autoDrop.bind(this), this.autoDropInterval);
        

    }

    /** ボタン押された時の処理たち */
    keyDownUp(){
        // console.log("up");
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
        // とりあえず今は回転だけしたい
        // ぶつかるとかそういうのは後回し

        /** 今の位置を古い情報として保存 */
        this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

        this.tetrimino = this.rotater.rotation({
            Field:this.Field,
            direction:"clockwise",
            tetrimino:this.tetrimino
        })

        /** 回転した後の位置を更新 */
        // this.tetrimino.Coordinate.forEach((block,index) => {
        //     this.tetrimino.Coordinate[index]
        //     = this.blockRotate.clockwise({
        //         rotationPoint:this.tetrimino.Coordinate[1],
        //         beforeRotation:block
        //     })
        // })

        
        // for (let block of this.tetrimino.Coordinate){
            
        //     this.blockRotate.clockwise({
        //         rotationPoint:this.tetrimino.Coordinate[1],
        //         beforeRotation:block
        //     })
        // }

        console.log("this.tetrimino.Coordinate: " + JSON.stringify(this.tetrimino.Coordinate));
        
        this.moveTetrimino()
    }

    keyDownJ(){

    }

    keyDownSpace(){
        // console.log("space");
    }

    autoDrop(){
        /** 動かせないなら固定化する */
        // このロジックmoveTetriminoに分けたほうがよい?
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
            this.Field[block.y][block.x].moving = false
        }

        /** 新しい場所に描写 */
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
            this.Field[block.y][block.x].moving = true
        }

    }

    /** 動かしているブロックを固定化する */
    immobilization(){
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].moving = false
        }


        /** 新しいブロックを生成 */
        this.tetrimino = JSON.parse(JSON.stringify(this.tetriminoFactory.T));
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
                block.moving = false
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