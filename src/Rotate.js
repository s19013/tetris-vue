export default class Rotate {

    constructor({
        fieldWidth,
        fieldHeight,
        checkCanMove
    }) {
        // indexとかの関係で - 1する
        this.fieldWidth   = fieldWidth - 1
        this.fieldHeight  = fieldHeight - 1;
        this.checkCanMove = checkCanMove
    }

    
    // ここで全部受け取ってシュミレーションさせたりするか
    // 回転軸さえいじればtスピン行けそう

    /**
     * @param Field 今現在のフィールド
     * @param direction 回転の方向
     * @param tetrimino 今のブロックの状態
     */
    rotation({
        Field,
        direction,
        tetrimino
    }){
        // 色々回してみてシュミレーションしていく
        /** 実際にまわしてみた状態
         *  宣言なので今はコピーしただけの状態
         */
        let tentativeCoordinate = null

        if (direction == "clockwise" ) {
            // 回したのを代入
            tentativeCoordinate = tetrimino.Coordinate.map(block => {
                return this.clockwise({
                    rotationPoint:tetrimino.Coordinate[tetrimino.clockwiseAxis],
                    beforeRotation:block
                })
            })
        } else {
            tentativeCoordinate = tetrimino.Coordinate.map(block => {
                return this.counterClockwise({
                    rotationPoint:tetrimino.Coordinate[tetrimino.clockwiseAxis],
                    beforeRotation:block
                })
            })
        } 

        /** 回転したブロックが壁や床､既存のブロックと被っているかどうか調べる */
        try {
            tentativeCoordinate = this.checkIfThereIsACoveredBlock({
                Field:Field,
                tentativeCoordinate:tentativeCoordinate,
                rotationPoint:tentativeCoordinate[tetrimino.clockwiseAxis]
            })
        } catch (error) {
            /** エラーが起きた
             * つまり回せなかったのでそのまま帰す 
             */
            return tetrimino
        }

        /** 位置を更新 */
        tetrimino.Coordinate = tentativeCoordinate

        return tetrimino
    }

    /** 回転前点{a,b} 回転点 {c,d} */
    /** X = (a - c)cos𝜃 - (b - d)sin𝜃 + c */
    /** Y = (a - c)sin𝜃 + (b - d)cos𝜃 + d */

    // Math.cosとかはなんかややこしいし､今回は90度しか使わないので使わない
    /** cos90 = 0 
     *  SIN90 = 1
     */

    /**
     * 時計回り
     * @param rotationPoint 回転軸
     * @param beforeRotation 回転前の状態
     * @returns 
     */
    clockwise({
        rotationPoint,
        beforeRotation
    }){
        
        let afterRotation = {x:0,y:0}
        afterRotation.x = 
            (beforeRotation.x - rotationPoint.x) * 0
            -
            (beforeRotation.y - rotationPoint.y) * 1
            + 
            rotationPoint.x

        afterRotation.y =
            (beforeRotation.x - rotationPoint.x) * 1
            +
            (beforeRotation.y - rotationPoint.y) * 0
            +
            rotationPoint.y

        return afterRotation
    }

    /**
     * 反時計回り
     * @param rotationPoint 回転軸
     * @param beforeRotation 回転前の状態
     * @returns 
     */
    counterClockwise({
        rotationPoint,
        beforeRotation
    }){
        let afterRotation = {x:0,y:0}
        afterRotation.x = 
            (beforeRotation.x - rotationPoint.x) * 0
            -
            (beforeRotation.y - rotationPoint.y) * -1
            + 
            rotationPoint.x

        afterRotation.y =
            (beforeRotation.x - rotationPoint.x) * -1
            +
            (beforeRotation.y - rotationPoint.y) * 0
            +
            rotationPoint.y

        return afterRotation
    }

    /** すでにおいているぶつかるようだったらちょっと移動する
     *  すでにおいてあるブロックとかぶらないか確認と被っていた時の処理
     *  絶対に回せない状況ではないことは別の関数で証明された
     * 
     * @param Field 今現在のフィールド
     * @param tentativeCoordinate ブロックの状態
     * @param rotationPoint 回転軸
     */
    checkIfThereIsACoveredBlock({
        Field,
        tentativeCoordinate,
        rotationPoint
    }){
        // そのまま使うと参照元が変わってしまうため｡
        /** また別の仮の状態の変数 */
        let tentativeCoordinate2 = JSON.parse(JSON.stringify(tentativeCoordinate));

        for (let tentativeBlock of tentativeCoordinate2) {
            /** 壁や床と被っているようなら移動する 
             *  完全に出てくるまで繰り返すためwhile
            */

            /** 左の壁 */
            while (tentativeBlock.x < 0) {
                tentativeCoordinate2.forEach(block => {
                    block.x += 1
                });
            }

            /** 右の壁 */
            while (tentativeBlock.x > this.fieldWidth) {
                tentativeCoordinate2.forEach(block => {
                    block.x -= 1
                });
            }

            /** 床 */
            while (tentativeBlock.y > this.fieldHeight) {
                tentativeCoordinate2.forEach(block => {
                    block.y -= 1
                });
            }

            /** 天井 */
            while (tentativeBlock.y < 0) {
                tentativeCoordinate2.forEach(block => {
                    block.y += 1
                });
            }

            /** おいているブロックに被っている状態なら移動する */
            while (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
                // 途中で計算式が狂わないように変数に保存しておく
                // そのままやったら色々狂ってしまった｡
                let amountOfMove = {
                    x:rotationPoint.x - tentativeBlock.x,
                    y:rotationPoint.y - tentativeBlock.y
                }
                tentativeCoordinate2.forEach(block => {
                    block.x += amountOfMove.x
                    block.y += amountOfMove.y
                });
            }
        }

        

        // 移動した状態でも被っているかを調べる
        // console.log(JSON.stringify(tentativeCoordinate2));
        for (let tentativeBlock of tentativeCoordinate2) {
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false
            ) {
                /** 被っている状態 
                 *  本来なら回せない状態だったということので処理を中断させる
                */ 
                throw "can't rotation"
            }
        }

        return tentativeCoordinate2
    }
}