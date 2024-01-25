import {fieldWidth,fieldHeight} from "./Config"

/** 動かせるかどうかチェック */
export default class checkCanMove {

    left({Field,tetrimino}){

        /** 壁にぶつからないか調べる 
         *  左に動かすと壁にぶつかるということは今左端のブロックはx = 0の場所,もしくはそれよりも小さい場所にいることになる
         *  動かすとぶつかるようなら早期return
        */

        for (let block of tetrimino.coordinate.status) {
            if (block.x <= 0) {return false}
        }
        

        /** ブロックにぶつからないかどうか調べる
         *  左隣りにブロックがあるかどうか調べる
         *  自分が属するグループは除外しないとブロックが動かなくなる
         *  前のif文でブロックの位置 ≠ 0だと証明できた
         */
        
        for (let block of tetrimino.coordinate.status ) {
            /** 自分の左に属してるグループのブロックがないか調べる
             *  あったらスキップする
             */
            if (Field.status[block.y][block.x - 1].isMoving) { continue }

            /** 自分の左にブロックがないか調べる */
            if (Field.status[block.y][block.x - 1].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    right({Field,tetrimino}){
        /** 右端 */
        const rightEdge = fieldWidth - 1

        /** 壁にぶつからないか調べる 
         *  右に動かすと壁にぶつかるということは今右端のブロックはx = this.rightEdgeの場所,もしくはそれよりも大きい場所にいることになる
         *  動かすとぶつかるようなら早期return
        */

        for (let block of tetrimino.coordinate.status) {
            if (block.x >= rightEdge) {return false}
        }

        /** ブロックにぶつからないかどうか調べる
         *  右隣りにブロックがあるかどうか調べる
         *  自分が属するグループは除外しないとブロックが動かなくなる
         *  前のif文でブロックの位置 >≠ this.rightEdge だと証明できた
         */

        for (let block of tetrimino.coordinate.status ) {
            /** 自分の右に属してるグループのブロックがないか調べる
             *  あったらスキップする
             */
            if (Field.status[block.y][block.x + 1].isMoving) { continue }

            /** 自分の右にブロックがないか調べる */
            if (Field.status[block.y][block.x + 1].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    down({Field,tetrimino}){

        const bottom  = fieldHeight - 1;

        /** ぶつかる物が1つでもあれば落ちないようにする */ 

        /** 床にぶつからないか調べる 
         *  下に動かすと床にぶつかるということは今下端のブロックはy = this.bottomの場所,もしくはそれより大きい場所にいることになる
         *  動かすとぶつかるようなら早期return
        */
        for (let block of tetrimino.coordinate.status) {
            if (block.y >= bottom) {return false}
        }

        /** ブロックにぶつからないかどうか調べる
         *  下隣りにブロックがあるかどうか調べる
         *  自分が属するグループは除外しないとブロックが落ちなくなる
         *  前のif文でブロックの位置 ≠ this.bottomだと証明できた
         */
        for (let block of tetrimino.coordinate.status ) {
            /** 自分の下に属してるグループのブロックがないか調べる
             *  あったらスキップする
             */
            if (Field.status[block.y + 1][block.x].isMoving) { continue }

            /** 自分の下にブロックがないか調べる */
            if (Field.status[block.y + 1][block.x].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }

    up({Field,tetrimino}){
        /** ぶつかる物が1つでもあれば落ちないようにする */ 

        /** 天辺にぶつからないか調べる 
         *  上に動かすと天辺にぶつかるということは今上端のブロックはy = 0,もしくはそれよりも小さい場所にいることになる
         *  動かすとぶつかるようなら早期return
        */
        for (let block of tetrimino.coordinate.status) {
            if (block.y <= 0) {return false}
        }

        /** ブロックにぶつからないかどうか調べる
         *  上隣りにブロックがあるかどうか調べる
         *  自分が属するグループは除外しないとブロックが落ちなくなる
         *  前のif文でブロックの位置 ≠ this.fieldWidth だと証明できた
         */
        for (let block of tetrimino.coordinate.status ) {
            /** 自分の下に属してるグループのブロックがないか調べる
             *  あったらスキップする
             */
            if (Field.status[block.y - 1][block.x].isMoving) { continue }

            /** 自分の上にブロックがないか調べる */
            if (Field.status[block.y - 1][block.x].isFill) { return false }
        }

        /** ここまで確認してやっと動かせると返す */
        return true;
    }
}