import Block from "./Block"

export default class Tetris {
    Field = []

    /** 動かせるブロックたちの座標 と ブロックの種類*/
    tetrimino = {
        type:"T",
        Coordinate:[
            {x:4,y:0},
            {x:4,y:1},
            {x:5,y:0},
            {x:5,y:1},
        ]

        // T
        // {x:3,y:1},
        // {x:4,y:1},
        // {x:4,y:0},
        // {x:5,y:1},
    }

    /** 動かす前のブロックの位置 */
    oldTetrimino = structuredClone(this.tetrimino);

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
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
        }
        
    }

    /** ボタン押された時の処理たち */
    keyDownUp(){
        console.log("up");
    }

    keyDownDown(){
        console.log("down");
        /** 動かせるかどうか確認*/
        if (this.checkCanMoveDown()) {
            /** 今の位置を古い情報として保存 */
            this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

            /** 位置を更新 */
            for (let block of this.tetrimino.Coordinate) {
                block.y += 1
            }

            this.moveTetrimino()
        }
    }

    keyDownLeft(){
        console.log("left");
        /** 動かせるかどうか確認*/
        if (this.checkCanMoveLeft()) {
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
        console.log("right");
        if (this.checkCanMoveRight()) {
            /** 今の位置を古い情報として保存 */
            this.oldTetrimino = JSON.parse(JSON.stringify(this.tetrimino));

            /** 位置を更新 */
            for (let block of this.tetrimino.Coordinate) {
                block.x += 1
            }
            this.moveTetrimino()
        }
    }

    keyDownSpace(){
        console.log("space");
    }


    /** 動かせるかどうかチェック */
    checkCanMoveLeft(){

        /** 調べるために情報を集める必要がある */
        /** 一番左端のブロックのxを取得 */
        /** 基準として一番最初のブロックのxを入れとく */
        let leftEdge = this.tetrimino.Coordinate[0]

        /** 左端でもLミノJミノみたいに複数あるかもなので専用の箱を用意しておく */
        let leftEdges = []

        for (let block of this.tetrimino.Coordinate) {
            /** 基準より小さかったら 代入して新しい基準にする */
            if (leftEdge.x >= block.x) {
                leftEdge = block
                leftEdges.push(block)
            }
            /** 古い情報は消す必要がある */
            /** 基準より大きいなら消す */
            leftEdges = leftEdges.filter( edge => {
                return leftEdge.x >= edge.x
            });
        }
        console.log("leftEdge: " + JSON.stringify(leftEdge));
        console.log("leftEdges: "+ JSON.stringify(leftEdges));

        /** 壁にぶつからないか調べる 
         *  左に動かすと壁にぶつかるということは今左端のブロックはx = 0の場所にいることになる
         *  動かすとぶつかるようなら早期return
        */
        if (leftEdge.x == 0) {return false}

        /** ブロックにぶつからないかどうか調べる
         *  単純に左隣りにブロックがあるかどうか調べるだけでok
         *  前のif文でleftEdge ≠ 0だと証明できた
         */
        
        for (let block of leftEdges ) {
            if (this.Field[block.y][block.x - 1].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    checkCanMoveRight(){

        /** 調べるために情報を集める必要がある */
        /** 一番右端のブロックのxを取得 */
        /** 基準として一番最初のブロックのxを入れとく */
        let rightEdge = this.tetrimino.Coordinate[0]
        

        /** 右端でもLミノJミノみたいに複数あるかもなので専用の箱を用意しておく */
        let rightEdges = []

        for (let block of this.tetrimino.Coordinate) {
            /** 基準より大きかったら 代入して新しい基準にする */
            if (rightEdge.x <= block.x) {
                rightEdge = block
                rightEdges.push(block)
            }
            /** 古い情報は消す必要がある */
            /** 基準より小さいなら消す */
            rightEdges = rightEdges.filter( edge => {
                return rightEdge.x <= edge.x
            });
        }
        console.log("rightEdge: " + JSON.stringify(rightEdge));
        console.log("rightEdges: " + JSON.stringify(rightEdges));

        /** 壁にぶつからないか調べる 
         *  右に動かすと壁にぶつかるということは今右端のブロックはx = 9の場所にいることになる
         *  動かすとぶつかるようなら早期return
        */
        if (rightEdge.x == 9) {return false}

        /** ブロックにぶつからないかどうか調べる
         *  単純に右隣りにブロックがあるかどうか調べるだけでok
         *  前のif文でrightEdge ≠ 9だと証明できた
         */
        
        
        for (let block of rightEdges ) {
            if (this.Field[block.y][block.x + 1].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    checkCanMoveDown(){

        /** 調べるために情報を集める必要がある */
        /** 一番下端のブロックのyを取得 */
        /** 基準として一番最初のブロックのyを入れとく */
        let lowerEnd = this.tetrimino.Coordinate[0]
        

        /** 下端でもLミノJミノみたいに複数あるかもなので専用の箱を用意しておく */
        let lowerEnds = []

        for (let block of this.tetrimino.Coordinate) {
            /** このプログラムは下にいくほどyの値が大きくなるので */
            /** 基準より大きかったら 代入して新しい基準にする */
            if (lowerEnd.y <= block.y) {
                lowerEnd = block
                lowerEnds.push(block)
            }
            /** 古い情報は消す必要がある */
            /** 基準より小さいなら消す */
            lowerEnds = lowerEnds.filter( edge => {
                return lowerEnd.y <= edge.y
            });
        }
        console.log("lowerEnd: " + JSON.stringify(lowerEnd));
        console.log("lowerEnds: " + JSON.stringify(lowerEnds));

        /** 壁にぶつからないか調べる 
         *  下に動かすと壁にぶつかるということは今下端のブロックはy = 9の場所にいることになる
         *  動かすとぶつかるようなら早期return
        */
        if (lowerEnd.y == 9) {return false}

        /** ブロックにぶつからないかどうか調べる
         *  単純に下隣りにブロックがあるかどうか調べるだけでok
         *  前のif文でlowerEnd ≠ 9だと証明できた
         */
        for (let block of lowerEnds ) {
            if (this.Field[block.y + 1][block.y].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    /**  */
    moveTetrimino(){
        /** 古い場所のブロックを消して */
        for (let block of this.oldTetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = false
        }
        /** 新しい場所に描写 */
        for (let block of this.tetrimino.Coordinate) {
            this.Field[block.y][block.x].isFill = true
        }

    }


    /** 描写用の配列を返す */
    display(){
        /** i:縦 */
        /** n:横 */

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