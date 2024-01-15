import RotateCalculations from "./RotateCalculations";
import PushOut from "./PushOut";
import lodash from 'lodash';
import checkCanMove from "./CheckCanMove";

export default class Rotate {

    constructor() {
        this.checkCanMove = new checkCanMove()
        this.rotateCalculations = new RotateCalculations()
        this.pushOut = new PushOut()
    }

    // ここで全部受け取ってシュミレーションさせたりするか
    // 回転軸さえいじればtスピン行けそう

    /**
     * @param clonedField 今現在のフィールド
     * @param Coordinate 回転の方向
     * @param rotationPoint 今のブロックの状態
     */
    clockwise({
        clonedField,
        Coordinate,
        rotationPoint
    }){
        // 色々回してみてシュミレーションしていく
        /** 実際にまわしてみた状態
         *  宣言なので今はコピーしただけの状態
         */
        let tentativeCoordinate = null

        tentativeCoordinate = Coordinate.map(block => {
            return this.rotateCalculations.clockwise({
                rotationPoint:Coordinate[rotationPoint],
                beforeRotation:block
            })
        })

        /** 回転したブロックが壁や床､既存のブロックと被っているかどうか調べる */
        try {
            tentativeCoordinate = this.checkIfThereIsACoveredBlock({
                clonedField:clonedField,
                tetriminoCoordinate:tentativeCoordinate,
                rotationIndex:rotationPoint
            })
        } catch (error) {
            // console.log(error);
            /** エラーが起きた
             * つまり回せなかったのでそのまま帰す 
             */
            return Coordinate
        }

        /** シミュレーションした位置を返す */
        return tentativeCoordinate
    }

    counterClockwise({
        clonedField,
        Coordinate,
        rotationPoint
    }){
        let tentativeCoordinate = null

        tentativeCoordinate = Coordinate.map(block => {
            return this.rotateCalculations.counterClockwise({
                rotationPoint:Coordinate[rotationPoint],
                beforeRotation:block
            })
        })
        
        /** 回転したブロックが壁や床､既存のブロックと被っているかどうか調べる */
        try {
            tentativeCoordinate = this.checkIfThereIsACoveredBlock({
                clonedField:clonedField,
                tetriminoCoordinate:tentativeCoordinate,
                rotationIndex:rotationPoint
            })
        } catch (error) {
            // console.log(error);
            /** エラーが起きた
             * つまり回せなかったのでそのまま帰す 
             */
            return Coordinate
        }

        /** シミュレーションした位置を返す */
        return tentativeCoordinate
    }

    /** すでにおいているぶつかるようだったらちょっと移動する
     *  すでにおいてあるブロックとかぶらないか確認と被っていた時の処理
     *  絶対に回せない状況ではないことは別の関数で証明された
     * 
     * @param clonedField 今現在のフィールド
     * @param tetriminoCoordinate ブロックの座標
     * @param rotationPoint 回転軸
     */
    checkIfThereIsACoveredBlock({
        clonedField,
        tetriminoCoordinate,
        rotationIndex,
    }){
        // そのまま使うと参照元が変わってしまうため｡
        /** また別の仮の状態の変数 */
        let tentativeCoordinate = lodash.cloneDeep(tetriminoCoordinate)
        // console.log("before",JSON.stringify(tentativeCoordinate))

        // 主に下にずらすパターン
        let shiftedDown = this.shiftToDown({
            clonedField:lodash.cloneDeep(clonedField),
            tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate),
            rotationIndex:rotationIndex
        })

        tentativeCoordinate = lodash.cloneDeep(shiftedDown)

        // 確認する順番が問題になる(主に右回転で起きる)
        // とりあえず今は強引に2回確認?

        let noProblem = true
        for (let tentativeBlock of tentativeCoordinate) {
            if (clonedField.status[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                clonedField.status[tentativeBlock.y][tentativeBlock.x].isMoving == false
            ) { noProblem = false }
        }

        if (noProblem) { return tentativeCoordinate }
        
        // 強引に更にもう一度する
        shiftedDown = this.shiftToDown({
            clonedField:lodash.cloneDeep(clonedField),
            tetriminoCoordinate:lodash.cloneDeep(tentativeCoordinate), //編集したやつを入れる
            rotationIndex:rotationIndex
        })

        tentativeCoordinate = lodash.cloneDeep(shiftedDown)

        /** 
         * 下にずらしたパターンでまだ被っているかどうか確認する
         * 大丈夫なら抜ける
         * 駄目なら上にずらすパターン
         */

        noProblem = true
        for (let tentativeBlock of tentativeCoordinate) {
            if (clonedField.status[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                clonedField.status[tentativeBlock.y][tentativeBlock.x].isMoving == false
            ) { noProblem = false }
        }

        if (noProblem) { return tentativeCoordinate }

        let shiftedUp = this.shiftToUp({
            clonedField:lodash.cloneDeep(clonedField),
            tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate),
            rotationIndex:rotationIndex
        })

        tentativeCoordinate = lodash.cloneDeep(shiftedUp)

        // ここまで来てだめな場合は回せなかったってこと
        for (let tentativeBlock of tentativeCoordinate) {
            if (clonedField.status[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                clonedField.status[tentativeBlock.y][tentativeBlock.x].isMoving == false
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
        clonedField,
        tetriminoCoordinate,
        rotationIndex,
    }){
        // 上下確認
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheclonedField(tetriminoCoordinate)

        // 左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheclonedField_shiftUp({
            clonedField:lodash.cloneDeep(clonedField),
            tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate)
        })
        /** おいてあるブロックと被っているようなら移動する  */
        for (let tentativeBlock of tetriminoCoordinate) {
            try {
                if (clonedField.status[tentativeBlock.y][tentativeBlock.x].isFill == true
                    &&
                    clonedField.status[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
    
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
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheclonedField(tetriminoCoordinate)

        // もう一度左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheclonedField_shiftUp({
            clonedField:lodash.cloneDeep(clonedField),
            tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate)
        })

        return tetriminoCoordinate
    }

    shiftToDown({
        clonedField,
        tetriminoCoordinate,
        rotationIndex,
    }){
        // 上下確認
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheclonedField(tetriminoCoordinate)

        // 左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheclonedField_shiftDown({
            clonedField:lodash.cloneDeep(clonedField),
            tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate)
        })
        
        /** おいてあるブロックと被っているようなら移動する  */
        for (let tentativeBlock of tetriminoCoordinate) {
            try {
                if (clonedField.status[tentativeBlock.y][tentativeBlock.x].isFill == true
                    &&
                    clonedField.status[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
    
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
        tetriminoCoordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheclonedField(tetriminoCoordinate)

        // もう一度左右確認
        tetriminoCoordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheclonedField_shiftDown({
            clonedField:lodash.cloneDeep(clonedField),
            tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate)
        })

        return tetriminoCoordinate
    }

    // 天井と床からおし出す
    ReturnTheTopAndBottomOverhangingBlocksToTheclonedField(tetriminoCoordinate){
        /** 天井 */
        tetriminoCoordinate = this.pushOut.FromTheFloor(lodash.cloneDeep(tetriminoCoordinate))

        /** 床 */
        tetriminoCoordinate = this.pushOut.FromTheFloor(lodash.cloneDeep(tetriminoCoordinate))

        return tetriminoCoordinate
    }

    // 左右の壁から出して上にずらす
    ReturnTheLeftAndRightOverhangingBlocksToTheclonedField_shiftUp({
        clonedField,
        tetriminoCoordinate
    }){
        /** 左の壁 */
        let hidarikabe = this.pushOut.FromTheLeftWall(
            lodash.cloneDeep(tetriminoCoordinate)
        )

        tetriminoCoordinate = lodash.cloneDeep(hidarikabe.tetriminoCoordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ上げる */
        if (hidarikabe.moved) {
            tetriminoCoordinate= this.MoveVerticallyFromCoveringBlock({
                clonedField:lodash.cloneDeep(clonedField),
                tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate),
                amountOfMoveY:-1
            })
        }

        /** 右の壁 */
        let migikabe = this.pushOut.FromTheRightWall(
            lodash.cloneDeep(tetriminoCoordinate)
        )

        tetriminoCoordinate = lodash.cloneDeep(migikabe.tetriminoCoordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ上げる */
        if (migikabe.moved) {
            tetriminoCoordinate = this.MoveVerticallyFromCoveringBlock({
                clonedField:lodash.cloneDeep(clonedField),
                tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate),
                amountOfMoveY:-1
            })
        }

        return tetriminoCoordinate
    }

    // 左右の壁から出して下にずらす
    ReturnTheLeftAndRightOverhangingBlocksToTheclonedField_shiftDown({
            clonedField,
            tetriminoCoordinate
        }){
        /** 左の壁 */
        let hidarikabe = this.pushOut.FromTheLeftWall(
            lodash.cloneDeep(tetriminoCoordinate)
        )

        tetriminoCoordinate = lodash.cloneDeep(hidarikabe.tetriminoCoordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ下げる */
        if (hidarikabe.moved) {
            tetriminoCoordinate= this.MoveVerticallyFromCoveringBlock({
                clonedField:lodash.cloneDeep(clonedField),
                tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate),
                amountOfMoveY:1
            })
        }

        /** 右の壁 */
        let migikabe = this.pushOut.FromTheRightWall(
            lodash.cloneDeep(tetriminoCoordinate)
        )

        tetriminoCoordinate = lodash.cloneDeep(migikabe.tetriminoCoordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ下げる */
        if (migikabe.moved) {
            tetriminoCoordinate = this.MoveVerticallyFromCoveringBlock({
                clonedField:lodash.cloneDeep(clonedField),
                tetriminoCoordinate:lodash.cloneDeep(tetriminoCoordinate),
                amountOfMoveY:1
            })
        }

        return tetriminoCoordinate
    }

    /**
     * X軸に移動させた座標を返す 
     * @param  clonedField フィールドの状態
     * @param  tetriminoCoordinate ブロックの座標
     * @param  amountOfMoveX 移動量 
     * @returns ブロックの座標
     */
    MoveHorizontallyFromCoveringBlock({
        clonedField,
        tetriminoCoordinate,
        amountOfMoveX
    }){
        let tentativeCoordinate = lodash.cloneDeep(tetriminoCoordinate);
        for (let tentativeBlock of tentativeCoordinate){
            if (clonedField.status[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                clonedField.status[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
                tentativeCoordinate.forEach(block => { block.x +=  amountOfMoveX});
            }
        }

        return tentativeCoordinate
    }

    /**
     * Y軸に移動させた座標を返す 
     * @param  clonedField フィールドの状態
     * @param  tetriminoCoordinate ブロックの座標
     * @param  amountOfMoveY 移動量 
     * @returns ブロックの座標
     */
    MoveVerticallyFromCoveringBlock({
        clonedField,
        tetriminoCoordinate,
        amountOfMoveY
    }){
        for (let tentativeBlock of tetriminoCoordinate){
            if (clonedField.status[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                clonedField.status[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
                tetriminoCoordinate.forEach(block => { block.y +=  amountOfMoveY});
            }
        }

        return tetriminoCoordinate
    }
}