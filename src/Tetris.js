import Block from "./Block"

export default class Tetris {
    Field = []

    /** 動かせるブロックたちの座標 と ブロックの種類*/
    tetrimino = {
        type:"T",
        Coordinate:[
            {x:0,y:1},
            {x:1,y:1},
            {x:1,y:0},
            {x:2,y:1},
        ]
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

        // 適当に色を塗ってみる
        for (var item of this.tetrimino.Coordinate) {
            this.Field[item.y][item.x].isFill = true
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