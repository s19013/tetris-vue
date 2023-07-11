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

    // 今は床とかぶらないように

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

        /** 回せるかどうか確認 
         *  回せないならそのまま帰す(結局回さなかったってこと)
        */
        if (!this.checkCanRotation({
            Field,
            tetrimino
        })) { return tetrimino }



        if (direction == "clockwise" ) {
            // 回したのを代入
            tentativeCoordinate = tetrimino.Coordinate.map(block => {
                return this.clockwise({
                    rotationPoint:tetrimino.Coordinate[tetrimino.clockwiseAxis],
                    beforeRotation:block
                })
            })

            tentativeCoordinate = this.checkIfThereIsACoveredBlockAfterClockwise({
                Field:Field,
                tentativeCoordinate:tentativeCoordinate,
                rotationPoint:tentativeCoordinate[tetrimino.clockwiseAxis]
            })
        } 
        else {
            tentativeCoordinate = tetrimino.Coordinate.map(block => {
                return this.counterClockwise({
                    rotationPoint:tetrimino.Coordinate[tetrimino.clockwiseAxis],
                    beforeRotation:block
                })
            })
        } 

        /** すでにおいているぶつかるようだったらちょっと移動する */

        /** y軸 */
        // let coveredBlocks  = []
        // tentativeCoordinate.forEach(block => {
        //     if (Field[block.y][block.x].isFill == true
        //         &&
        //         Field[block.y][block.x].isMoving == false
        //     ) {
        //         coveredBlocks.push(block)
        //     }
        // });


        // tentativeCoordinate = tentativeCoordinate.map(block => {
        //     Field[block.y][block.x].isFill = true
        //     &&
        //     Field[block.y][block.x].isMoving = false

        // })

        // 下はわかるけど､左右はわかりにくい
        // 中心よりいくつとかんがえるか?

        /** X軸 */
        // tentativeCoordinate = tentativeCoordinate.map(block => {
        //     Field[block.y][block.x].isFill = true
        //     &&
        //     Field[block.y][block.x].isMoving = false

        // })

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

    /**
     * 
     * @param Field 今現在のフィールド
     * @param tentativeCoordinate ブロックの状態
     * @param rotationPoint 回転軸
     */

    /** すでにおいてあるブロックとかぶらないか確認と被っていた時の処理*/
    /** 絶対に回せない状況ではないことは別の関数で証明された */
    checkIfThereIsACoveredBlockAfterClockwise({
        Field,
        tentativeCoordinate,
        rotationPoint
    }){
        // let coveredBlocks  = []

        // そのまま使うと参照元が変わってしまうため｡
        /** また別の仮の状態の変数 */
        let tentativeCoordinate2 = JSON.parse(JSON.stringify(tentativeCoordinate));

        for (let block of tentativeCoordinate2) {
            if (Field[block.y][block.x].isFill == true
                &&
                Field[block.y][block.x].isMoving == false
            ) {
                let amountOfMovement = {
                    x:rotationPoint.x - block.x,
                    y:rotationPoint.y - block.y
                }

                console.log(JSON.stringify(amountOfMovement))

                tentativeCoordinate2.forEach(temp => {
                    temp.x += amountOfMovement.x
                    temp.y += amountOfMovement.y
                });
    
                console.log(JSON.stringify(tentativeCoordinate2))
            }
        }

        // console.log(JSON.stringify(coveredBlocks))
        // console.log(JSON.stringify(rotationPoint))

        // どこが被っているかはわかったじゃあ次どうするか
        // 回転軸を中心にどこに何ます動かすか考える
        // if (coveredBlocks.length != 0) {
        //     // 例 {x:4,y:10}のブロックが被っている
        //     // 回転軸は{x:3,10}
        //     // 全部を左に 1動かす
        //     // 計算式だと
        //     // 軸 - 被っているブロック

        //     console.log(rotationPoint.x - coveredBlocks.x);
        //     let amountOfMovement = {
        //         x:rotationPoint.x - coveredBlocks.x,
        //         y:rotationPoint.y - coveredBlocks.y
        //     }

        //     console.log(JSON.stringify(amountOfMovement))

        //     tentativeCoordinate.forEach(block => {
        //         block.x += amountOfMovement.x
        //         block.y += amountOfMovement.y
        //     });

        //     console.log(JSON.stringify(tentativeCoordinate))
        // }




        // ここでも回せないと分かったらtherowする
        return tentativeCoordinate2
    }
}