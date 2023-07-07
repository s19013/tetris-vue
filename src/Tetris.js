import Block from "./Block"

export default class Tetris {
    Field = []

    /** 動かせるブロックたちの座標 */
    tetrimino = {

    }

    constructor(){
        // 10*10のリストにblockクラスを入れる
        // i:縦
        // n:横

        for (let i = 0; i < 10; i++) {
            let line = [] //横一列の配列
            for (let n = 0; n < 10; n++) {
                line.push(new Block())
            }
            this.Field.push(line)
            line = []
        }
    }

    /** 描写用の配列を返す */
    display(){
        // i:縦
        // n:横
        
        let temp = []
        for (let i = 0; i < 10; i++) {
            let line = []
            for (let n = 0; n < 10; n++) {
                line.push(Number(this.Field[i][n].isFill))
            }
            temp.push(line)
            line = []
        }
        return temp
    }

}