/** 動かせるかどうかチェック */
export default class checkCanMove {
    constructor({
        fieldWidth,
        fieldHeight
    }) {
        // indexとかの関係で - 1する
        this.fieldWidth   = fieldWidth - 1
        this.fieldHeight  = fieldHeight;
    }


    left({Field,tetrimino}){

        /** 調べるために情報を集める必要がある */
        /** 一番左端のブロックのxを取得 */
        /** 基準として一番最初のブロックのxを入れとく */
        let leftEdge = tetrimino.Coordinate[0]

        /** 左端でもLミノJミノみたいに複数あるかもなので専用の箱を用意しておく */
        let leftEdges = []

        for (let block of tetrimino.Coordinate) {
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
        // console.log("leftEdge: " + JSON.stringify(leftEdge));
        // console.log("leftEdges: "+ JSON.stringify(leftEdges));

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
            if (Field[block.y][block.x - 1].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    right({Field,tetrimino}){

        /** 調べるために情報を集める必要がある */
        /** 一番右端のブロックのxを取得 */
        /** 基準として一番最初のブロックのxを入れとく */
        let rightEdge = tetrimino.Coordinate[0]
        

        /** 右端でもLミノJミノみたいに複数あるかもなので専用の箱を用意しておく */
        let rightEdges = []

        for (let block of tetrimino.Coordinate) {
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
        // console.log("rightEdge: " + JSON.stringify(rightEdge));
        // console.log("rightEdges: " + JSON.stringify(rightEdges));

        /** 壁にぶつからないか調べる 
         *  右に動かすと壁にぶつかるということは今右端のブロックはx = this.fieldWidthの場所にいることになる
         *  動かすとぶつかるようなら早期return
        */
        if (rightEdge.x == this.fieldWidth) {return false}

        /** ブロックにぶつからないかどうか調べる
         *  単純に右隣りにブロックがあるかどうか調べるだけでok
         *  前のif文でrightEdge ≠ this.fieldWidth だと証明できた
         */
        
        
        for (let block of rightEdges ) {
            if (Field[block.y][block.x + 1].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    down({Field,tetrimino}){

        /** 調べるために情報を集める必要がある */
        /** 一番下端のブロックのyを取得 */
        /** 基準として一番最初のブロックのyを入れとく */
        let lowerEnd = tetrimino.Coordinate[0]
        

        /** 下端でもLミノJミノみたいに複数あるかもなので専用の箱を用意しておく */
        let lowerEnds = []

        for (let block of tetrimino.Coordinate) {
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
        // console.log("lowerEnd: " + JSON.stringify(lowerEnd));
        // console.log("lowerEnds: " + JSON.stringify(lowerEnds));

        /** 壁にぶつからないか調べる 
         *  下に動かすと壁にぶつかるということは今下端のブロックはy = this.fieldHeightの場所にいることになる
         *  動かすとぶつかるようなら早期return
        */
        if (lowerEnd.y == this.fieldHeight) {return false}

        /** ブロックにぶつからないかどうか調べる
         *  単純に下隣りにブロックがあるかどうか調べるだけでok
         *  前のif文でlowerEnd ≠ this.fieldHeightだと証明できた
         */
        for (let block of lowerEnds ) {
            try {
                if (Field[block.y + 1][block.x].isFill) { return false }
            } catch (error) { 
                // 最下層にいる状態で呼び出した
                console.log(error);
            }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }
}