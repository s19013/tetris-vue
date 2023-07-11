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
        /** Oの時はそもそも回さない */
        
        /** Iの時は逆 */

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

    /** 回せる状態か確認
     * @param Field 今現在のフィールド
     * @param tetrimino 今のブロックの状態
     */
    checkCanRotation({
        Field,
        tetrimino
    }){
        /** 絶対回せない条件
         *  * 上下どっちも接している
         *  * 左右どっちも接している
         */

        /** 上下どっちも接している */
        let canMoveDown = this.checkCanMove.down({
            Field:Field,
            tetrimino:tetrimino
        })

        let canMoveUp = this.checkCanMove.up({
            Field:Field,
            tetrimino:tetrimino
        })

        if (!canMoveDown && !canMoveUp) { return false }

        /** 左右どっちも接している */
        let canMoveLeft = this.checkCanMove.left({
            Field:Field,
            tetrimino:tetrimino
        })


        let canMoveRight = this.checkCanMove.right({
            Field:Field,
            tetrimino:tetrimino
        })

        if (canMoveLeft ==false && canMoveRight == false) { return false }

        return true
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

        for (let block of tentativeCoordinate2) {
            /** 壁や床と被っているようなら移動する */

            // console.log(JSON.stringify(block));
            /** 左の壁 */
            if (block.x < 0) {
                tentativeCoordinate2.forEach(temp => {
                    temp.x += 1
                });
            }

            /** 右の壁 */
            if (block.x > this.fieldWidth) {
                tentativeCoordinate2.forEach(temp => {
                    temp.x -= 1
                });
            }

            /** 床 */
            if (block.y > this.fieldHeight) {
                tentativeCoordinate2.forEach(temp => {
                    temp.y -= 1
                });
            }

            /** 天井 */
            if (block.y < 0) {
                tentativeCoordinate2.forEach(temp => {
                    temp.y += 1
                });
            }

            /** おいているブロックに被っている状態なら移動する */
            if (Field[block.y][block.x].isFill == true
                &&
                Field[block.y][block.x].isMoving == false
            ) {
                // 途中で計算式が狂わないように変数に保存しておく
                // そのままやったら色々狂ってしまった｡
                let amountOfMove = {
                    x:rotationPoint.x - block.x,
                    y:rotationPoint.y - block.y
                }
                tentativeCoordinate2.forEach(temp => {
                    temp.x += amountOfMove.x
                    temp.y += amountOfMove.y
                });
            }
        }

        // 移動した状態でも被っているかを調べる
        // console.log(JSON.stringify(tentativeCoordinate2));
        for (let block of tentativeCoordinate2) {
            if (Field[block.y][block.x].isFill == true
                &&
                Field[block.y][block.x].isMoving == false
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