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

            /** 回転したブロックが壁や床､既存のブロックと被っているかどうか調べる */
            try {
                tentativeCoordinate = this.checkIfThereIsACoveredBlock({
                    Field:Field,
                    tetriminoCoordinate:tentativeCoordinate,
                    rotationIndex:tetrimino.clockwiseAxis
                })
            } catch (error) {
                console.log(error);
                /** エラーが起きた
                 * つまり回せなかったのでそのまま帰す 
                 */
                return tetrimino
            }

        } else {
            tentativeCoordinate = tetrimino.Coordinate.map(block => {
                return this.counterClockwise({
                    rotationPoint:tetrimino.Coordinate[tetrimino.counterClockwiseAxis],
                    beforeRotation:block
                })
            })

            /** 回転したブロックが壁や床､既存のブロックと被っているかどうか調べる */
            try {
                tentativeCoordinate = this.checkIfThereIsACoveredBlock({
                    Field:Field,
                    tetriminoCoordinate:tentativeCoordinate,
                    rotationIndex:tetrimino.counterClockwiseAxis
                })
            } catch (error) {
                console.log(error);
                /** エラーが起きた
                 * つまり回せなかったのでそのまま帰す 
                 */
                return tetrimino
            }
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
     * @param tetriminoCoordinate ブロックの座標
     * @param rotationPoint 回転軸
     */
    checkIfThereIsACoveredBlock({
        Field,
        tetriminoCoordinate,
        rotationIndex,
    }){
        // そのまま使うと参照元が変わってしまうため｡
        /** また別の仮の状態の変数 */
        let tentativeCoordinate = JSON.parse(JSON.stringify(tetriminoCoordinate))
        // console.log("before",JSON.stringify(tentativeCoordinate))

        // 主に下にずらすパターン
        let shiftedDown = this.shiftToDown({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate)),
            rotationIndex:rotationIndex
        })

        tentativeCoordinate = JSON.parse(JSON.stringify(shiftedDown))

        // 確認する順番が問題になる(主に右回転で起きる)
        // とりあえず今は強引に2回確認?

        let noProblem = true
        for (let tentativeBlock of tentativeCoordinate) {
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false
            ) { noProblem = false }
        }

        if (noProblem) { return tentativeCoordinate }
        
        // 強引に更にもう一度する
        shiftedDown = this.shiftToDown({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tentativeCoordinate)), //編集したやつを入れる
            rotationIndex:rotationIndex
        })

        tentativeCoordinate = JSON.parse(JSON.stringify(shiftedDown))

        /** 
         * 下にずらしたパターンでまだ被っているかどうか確認する
         * 大丈夫なら抜ける
         * 駄目なら上にずらすパターン
         */

        noProblem = true
        for (let tentativeBlock of tentativeCoordinate) {
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false
            ) { noProblem = false }
        }

        if (noProblem) { return tentativeCoordinate }

        let shiftedUp = this.shiftToUp({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate)),
            rotationIndex:rotationIndex
        })

        tentativeCoordinate = JSON.parse(JSON.stringify(shiftedUp))

        // ここまで来てだめな場合は回せなかったってこと
        for (let tentativeBlock of tentativeCoordinate) {
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

        // console.log("after",JSON.stringify(tentativeCoordinate));
        return tentativeCoordinate
    }

    shiftToUp({
        Field,
        tetriminoCoordinate,
        rotationIndex,
    }){
        // 上下確認
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCoordinate)

        // 左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftUp({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate))
        })
        /** おいてあるブロックと被っているようなら移動する  */
        for (let tentativeBlock of tetriminoCoordinate) {
            try {
                if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                    &&
                    Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
    
                    let rotationPoint = tetriminoCoordinate[rotationIndex]
                    // 途中で計算式が狂わないように変数に保存しておく
                    // そのままやったら色々狂ってしまった｡
                    let amountOfMove = {
                        x:rotationPoint.x - tentativeBlock.x,
                        y:rotationPoint.y - tentativeBlock.y
                    }
    
                    // console.log("amountOfMove",amountOfMove);
    
                    // 説明難しいけど
                    // とにかく重なっているから上にずらして見る
                    if (amountOfMove.y == 0) { amountOfMove.y = 1 }
                    tetriminoCoordinate.forEach(block => {
                        block.x += amountOfMove.x,
                        block.y += amountOfMove.y
                    });
                }
            } catch (error) { console.log(error); }
        }

        // もう一度上下確認
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCoordinate)

        // もう一度左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftUp({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate))
        })

        return tetriminoCoordinate
    }

    shiftToDown({
        Field,
        tetriminoCoordinate,
        rotationIndex,
    }){
        // 上下確認
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCoordinate)

        // 左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftDown({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate))
        })
        
        /** おいてあるブロックと被っているようなら移動する  */
        for (let tentativeBlock of tetriminoCoordinate) {
            try {
                if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                    &&
                    Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
    
                    let rotationPoint = tetriminoCoordinate[rotationIndex]
                    // 途中で計算式が狂わないように変数に保存しておく
                    // そのままやったら色々狂ってしまった｡
                    let amountOfMove = {
                        x:rotationPoint.x - tentativeBlock.x,
                        y:rotationPoint.y - tentativeBlock.y
                    }
    
                    // console.log("amountOfMove",amountOfMove);
    
                    // 説明難しいけど
                    // とにかく重なっているから下にずらして見る
                    if (amountOfMove.y == 0) { amountOfMove.y = -1 }
                    tetriminoCoordinate.forEach(block => {
                        block.x += amountOfMove.x,
                        block.y -= amountOfMove.y
                    });
                }
            } catch (error) { console.log(error); }
        }

        // もう一度上下確認
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCoordinate)

        // もう一度左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftDown({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate))
        })

        return tetriminoCoordinate
    }

    ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCoordinate){
        /** 天井 */
        tetriminoCoordinate = this.PushOutFromTheFloor(JSON.parse(JSON.stringify(tetriminoCoordinate)))

        /** 床 */
        tetriminoCoordinate = this.PushOutFromTheFloor(JSON.parse(JSON.stringify(tetriminoCoordinate)))

        return tetriminoCoordinate
    }

    ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftUp({
        Field,
        tetriminoCoordinate
    }){
    /** 左の壁 */
    let hidarikabe = this.PushOutFromTheLeftWall(
        JSON.parse(JSON.stringify(tetriminoCoordinate))
    )

    tetriminoCoordinate = JSON.parse(JSON.stringify(hidarikabe.tetriminoCoordinate))

    /** 壁から出したあとにおいてあるブロックと被っていたら1つ上げる */
    if (hidarikabe.moved) {
        tetriminoCoordinate= this.MoveVerticallyFromCoveringBlock({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate)),
            amountOfMoveY:-1
        })
    }

    /** 右の壁 */
    let migikabe = this.PushOutFromTheRightWall(
        JSON.parse(JSON.stringify(tetriminoCoordinate))
    )

    tetriminoCoordinate = JSON.parse(JSON.stringify(migikabe.tetriminoCoordinate))

    /** 壁から出したあとにおいてあるブロックと被っていたら1つ上げる */
    if (migikabe.moved) {
        tetriminoCoordinate = this.MoveVerticallyFromCoveringBlock({
            Field:JSON.parse(JSON.stringify(Field)),
            tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate)),
            amountOfMoveY:-1
        })
    }

    return tetriminoCoordinate
}

    ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftDown({
            Field,
            tetriminoCoordinate
        }){
        /** 左の壁 */
        let hidarikabe = this.PushOutFromTheLeftWall(
            JSON.parse(JSON.stringify(tetriminoCoordinate))
        )

        tetriminoCoordinate = JSON.parse(JSON.stringify(hidarikabe.tetriminoCoordinate))

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ下げる */
        if (hidarikabe.moved) {
            tetriminoCoordinate= this.MoveVerticallyFromCoveringBlock({
                Field:JSON.parse(JSON.stringify(Field)),
                tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate)),
                amountOfMoveY:1
            })
        }

        /** 右の壁 */
        let migikabe = this.PushOutFromTheRightWall(
            JSON.parse(JSON.stringify(tetriminoCoordinate))
        )

        tetriminoCoordinate = JSON.parse(JSON.stringify(migikabe.tetriminoCoordinate))

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ下げる */
        if (migikabe.moved) {
            tetriminoCoordinate = this.MoveVerticallyFromCoveringBlock({
                Field:JSON.parse(JSON.stringify(Field)),
                tetriminoCoordinate:JSON.parse(JSON.stringify(tetriminoCoordinate)),
                amountOfMoveY:1
            })
        }

        return tetriminoCoordinate
    }

    /** 完全に出てくるまで繰り返すためwhile */

    PushOutFromTheFloor(tetriminoCoordinate){
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.y > this.fieldHeight) {
                tetriminoCoordinate.forEach(block => { block.y -= 1 });
            }
        }

        return tetriminoCoordinate
    }

    PushOutFromTheRoof(tetriminoCoordinate){
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.y < 0) {
                tetriminoCoordinate.forEach(block => { block.y += 1 });
            }
        }

        return tetriminoCoordinate
    }

    PushOutFromTheLeftWall(tetriminoCoordinate){
        let moved = false
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.x < 0) {
                tetriminoCoordinate.forEach(block => { block.x += 1 });
                moved = true
            }
        }

        return {
            tetriminoCoordinate:tetriminoCoordinate,
            moved:moved
        }
    }

    PushOutFromTheRightWall(tetriminoCoordinate){
        let moved = false
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.x > this.fieldWidth) {
                tetriminoCoordinate.forEach(block => { block.x -= 1 });
                moved = true
            }
        }

        return {
            tetriminoCoordinate:tetriminoCoordinate,
            moved:moved
        }
    }

    /**
     * X軸にずらした座標を返す 
     * @param  Field フィールドの状態
     * @param  tetriminoCoordinate ブロックの座標
     * @param  amountOfMoveX 移動量 
     * @returns ブロックの座標
     */
    MoveHorizontallyFromCoveringBlock({
        Field,
        tetriminoCoordinate,
        amountOfMoveX
    }){
        let tentativeCoordinate = JSON.parse(JSON.stringify(tetriminoCoordinate));
        for (let tentativeBlock of tentativeCoordinate){
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
                tentativeCoordinate.forEach(block => { block.x +=  amountOfMoveX});
            }
        }

        return tentativeCoordinate
    }

    /**
     * Y軸にずらした座標を返す 
     * @param  Field フィールドの状態
     * @param  tetriminoCoordinate ブロックの座標
     * @param  amountOfMoveY 移動量 
     * @returns ブロックの座標
     */
    MoveVerticallyFromCoveringBlock({
        Field,
        tetriminoCoordinate,
        amountOfMoveY
    }){
        for (let tentativeBlock of tetriminoCoordinate){
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
                tetriminoCoordinate.forEach(block => { block.y +=  amountOfMoveY});
            }
        }

        return tetriminoCoordinate
    }
}