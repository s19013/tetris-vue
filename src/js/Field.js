import Block from "./Block"
import {fieldWidth,fieldHeight} from "./Config"
import lodash from 'lodash';
export default class Field {
    constructor() {
        /** フィールド自体の状態 */
        this.status = []
        /** 各列の状態 埋まっているブロックの数 */
        this.rowStatus = []

        this.initialize()
    }

    initialize(){
        this.updateRowStatus() // これで一番最初は全部0になるから全部0で埋めるコードがいらなくなる
    }

    /** 横1列を生成 */
    generateRow(){
        let row = []
        for (let n = 0; n < fieldWidth; n++) {
            row.push(new Block())
        }
        return row
    }

    generateField(){
        // 沢山使うからキャッシュを作っとく?
        let row = this.generateRow()
        /** 縦を生成 */
        for (let i = 0; i < fieldHeight; i++) {
            this.status.push(lodash.cloneDeep(row))
        }
    }

    /** 各列が何マス埋まっているのか確認する */
    updateRowStatus(){
        // 一番最初の時は空だから飛ばす必要がある
        if (this.status.length == 0) { return }

        for (let index = 0; index < fieldHeight; index++) {
            /** 配列の中身を全部足す */
            this.rowStatus[index] = this.status[index].reduce((a,b) => {
                return a + Number(b.isFill);
            },0);
        }
    }
    
    // 揃っている行を数える
    countAlignedRows(){
        // 更新して最新の状態にする
        this.updateRowStatus()

        return this.rowStatus.reduce((count,status)=>{
            // 要素がフィールド幅と一緒だった時 -> 1列に全部埋まっている時
            if(status == fieldWidth){ count += 1 } 
            return count
        }, 0)
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
                this.status.splice(FoundedIndex, 1);

                /** 消した分だけ上に加える */
                this.status.unshift(this.generateRow())

                // rowStatusの情報が古いままだと同じindex番号を削除し続けてしまうから
                // 列を削除したら都度更新する必要がある
                this.updateRowStatus()
            } 
            else { break } // 見つからないなら抜ける
        }
    }

    /** テトリミノがフィールドにすでにおいてるブロックに重なってないか調べる */
    // 1つでも重なってはいけない
    tetriminoIsNotOverlap(coordinate){
        return coordinate.status.every(block => 
            !(this.status[block.y][block.x].isFill == true && this.status[block.y][block.x].isMoving == false)
        );
    }

    // ---
    // 描写関係
    displayTetrimino(tetrimino){
        for (let block of tetrimino.coordinate.status) {
            this.status[block.y][block.x].isFill = true
            this.status[block.y][block.x].isMoving = true
        }
    }

    undisplayTetrimino(tetrimino){
        for (let block of tetrimino.coordinate.status) {
            this.status[block.y][block.x].isFill = false
            this.status[block.y][block.x].isMoving = false
        }
    }


    displayGhost(ghost){
        for (let block of ghost.coordinate.status) {
            this.status[block.y][block.x].ghost = true
        }
    }

    undisplayGhost(ghost){
        for (let block of ghost.coordinate.status) {
            this.status[block.y][block.x].ghost = false
        }
    }

    // 揃っている列に色を塗る
    EnableLined(){
        for (let index = 0; index < fieldHeight; index++) {
            // 揃っていたらlinedプロパティをtrueにする
            if (this.rowStatus[index] == fieldWidth) { 
                for (const block of this.status[index]) { block.lined = true } 
            }
        }
    }

    /** 動かしているテトリミノを固定化する */
    immobilization(tetrimino){
        // movingを外して固定化(動かせなく)する
        for (let block of tetrimino.coordinate.status) {
            this.status[block.y][block.x].isMoving = false
        }
    }

    // デバック用
    /** テスト用の地形を生成する */
    setTestField(){
    }
}

// baseLineが便利な時
// 一番最初のフィールド生成する時ぐらいか?
// わざわざreturn new Field(this.status)しなくてもいいよね
// 一回わざとreturn する方法しないで､ブランチ切ってからやってみるか｡