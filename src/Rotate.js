import RotateCalculations from "./RotateCalculations";
import PushOut from "./PushOut";
import lodash from 'lodash';

export default class Rotate {

    constructor({
        checkCanMove
    }) {
        this.checkCanMove = checkCanMove
        this.rotateCalculations = new RotateCalculations()
        this.pushOut = new PushOut()
    }

    // ここで全部受け取ってシュミレーションさせたりするか
    // 回転軸さえいじればtスピン行けそう

    /**
     * @param Field 今現在のフィールド
     * @param Cordinate 回転の方向
     * @param rotationPoint 今のブロックの状態
     */
    clockwise({
        Field,
        Cordinate,
        rotationPoint
    }){
        // 色々回してみてシュミレーションしていく
        /** 実際にまわしてみた状態
         *  宣言なので今はコピーしただけの状態
         */
        let tentativeCordinate = null

        tentativeCordinate = Cordinate.map(block => {
            return this.rotateCalculations.clockwise({
                rotationPoint:Cordinate[rotationPoint],
                beforeRotation:block
            })
        })

        /** 回転したブロックが壁や床､既存のブロックと被っているかどうか調べる */
        try {
            tentativeCordinate = this.checkIfThereIsACoveredBlock({
                Field:Field,
                tetriminoCordinate:tentativeCordinate,
                rotationIndex:rotationPoint
            })
        } catch (error) {
            // console.log(error);
            /** エラーが起きた
             * つまり回せなかったのでそのまま帰す 
             */
            return Cordinate
        }

        /** シミュレーションした位置を返す */
        return tentativeCordinate
    }

    counterClockwise({
        Field,
        Cordinate,
        rotationPoint
    }){
        let tentativeCordinate = null

        tentativeCordinate = Cordinate.map(block => {
            return this.rotateCalculations.counterClockwise({
                rotationPoint:Cordinate[rotationPoint],
                beforeRotation:block
            })
        })
        
        /** 回転したブロックが壁や床､既存のブロックと被っているかどうか調べる */
        try {
            tentativeCordinate = this.checkIfThereIsACoveredBlock({
                Field:Field,
                tetriminoCordinate:tentativeCordinate,
                rotationIndex:rotationPoint
            })
        } catch (error) {
            // console.log(error);
            /** エラーが起きた
             * つまり回せなかったのでそのまま帰す 
             */
            return Cordinate
        }

        /** シミュレーションした位置を返す */
        return tentativeCordinate
    }

    /** すでにおいているぶつかるようだったらちょっと移動する
     *  すでにおいてあるブロックとかぶらないか確認と被っていた時の処理
     *  絶対に回せない状況ではないことは別の関数で証明された
     * 
     * @param Field 今現在のフィールド
     * @param tetriminoCordinate ブロックの座標
     * @param rotationPoint 回転軸
     */
    checkIfThereIsACoveredBlock({
        Field,
        tetriminoCordinate,
        rotationIndex,
    }){
        // そのまま使うと参照元が変わってしまうため｡
        /** また別の仮の状態の変数 */
        let tentativeCordinate = lodash.cloneDeep(tetriminoCordinate)
        // console.log("before",JSON.stringify(tentativeCordinate))

        // 主に下にずらすパターン
        let shiftedDown = this.shiftToDown({
            Field:lodash.cloneDeep(Field),
            tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate),
            rotationIndex:rotationIndex
        })

        tentativeCordinate = lodash.cloneDeep(shiftedDown)

        // 確認する順番が問題になる(主に右回転で起きる)
        // とりあえず今は強引に2回確認?

        let noProblem = true
        for (let tentativeBlock of tentativeCordinate) {
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false
            ) { noProblem = false }
        }

        if (noProblem) { return tentativeCordinate }
        
        // 強引に更にもう一度する
        shiftedDown = this.shiftToDown({
            Field:lodash.cloneDeep(Field),
            tetriminoCordinate:lodash.cloneDeep(tentativeCordinate), //編集したやつを入れる
            rotationIndex:rotationIndex
        })

        tentativeCordinate = lodash.cloneDeep(shiftedDown)

        /** 
         * 下にずらしたパターンでまだ被っているかどうか確認する
         * 大丈夫なら抜ける
         * 駄目なら上にずらすパターン
         */

        noProblem = true
        for (let tentativeBlock of tentativeCordinate) {
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false
            ) { noProblem = false }
        }

        if (noProblem) { return tentativeCordinate }

        let shiftedUp = this.shiftToUp({
            Field:lodash.cloneDeep(Field),
            tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate),
            rotationIndex:rotationIndex
        })

        tentativeCordinate = lodash.cloneDeep(shiftedUp)

        // ここまで来てだめな場合は回せなかったってこと
        for (let tentativeBlock of tentativeCordinate) {
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

        // console.log("after",JSON.stringify(tentativeCordinate));
        return tentativeCordinate
    }

    shiftToUp({
        Field,
        tetriminoCordinate,
        rotationIndex,
    }){
        // 上下確認
        tetriminoCordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCordinate)

        // 左右確認
        tetriminoCordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftUp({
            Field:lodash.cloneDeep(Field),
            tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate)
        })
        /** おいてあるブロックと被っているようなら移動する  */
        for (let tentativeBlock of tetriminoCordinate) {
            try {
                if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                    &&
                    Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
    
                    let rotationPoint = tetriminoCordinate[rotationIndex]
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
                    tetriminoCordinate.forEach(block => {
                        block.x += amountOfMove.x,
                        block.y += amountOfMove.y
                    });
                }
            } catch (error) { console.log(error); }
        }

        // もう一度上下確認
        tetriminoCordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCordinate)

        // もう一度左右確認
        tetriminoCordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftUp({
            Field:lodash.cloneDeep(Field),
            tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate)
        })

        return tetriminoCordinate
    }

    shiftToDown({
        Field,
        tetriminoCordinate,
        rotationIndex,
    }){
        // 上下確認
        tetriminoCordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCordinate)

        // 左右確認
        tetriminoCordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftDown({
            Field:lodash.cloneDeep(Field),
            tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate)
        })
        
        /** おいてあるブロックと被っているようなら移動する  */
        for (let tentativeBlock of tetriminoCordinate) {
            try {
                if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                    &&
                    Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
    
                    let rotationPoint = tetriminoCordinate[rotationIndex]
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
                    tetriminoCordinate.forEach(block => {
                        block.x += amountOfMove.x,
                        block.y -= amountOfMove.y
                    });
                }
            } catch (error) { console.log(error); }
        }

        // もう一度上下確認
        tetriminoCordinate = this.ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCordinate)

        // もう一度左右確認
        tetriminoCordinate = this.ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftDown({
            Field:lodash.cloneDeep(Field),
            tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate)
        })

        return tetriminoCordinate
    }

    // 天井と床からおし出す
    ReturnTheTopAndBottomOverhangingBlocksToTheField(tetriminoCordinate){
        /** 天井 */
        tetriminoCordinate = this.pushOut.FromTheFloor(lodash.cloneDeep(tetriminoCordinate))

        /** 床 */
        tetriminoCordinate = this.pushOut.FromTheFloor(lodash.cloneDeep(tetriminoCordinate))

        return tetriminoCordinate
    }

    // 左右の壁から出して上にずらす
    ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftUp({
        Field,
        tetriminoCordinate
    }){
        /** 左の壁 */
        let hidarikabe = this.pushOut.FromTheLeftWall(
            lodash.cloneDeep(tetriminoCordinate)
        )

        tetriminoCordinate = lodash.cloneDeep(hidarikabe.tetriminoCordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ上げる */
        if (hidarikabe.moved) {
            tetriminoCordinate= this.MoveVerticallyFromCoveringBlock({
                Field:lodash.cloneDeep(Field),
                tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate),
                amountOfMoveY:-1
            })
        }

        /** 右の壁 */
        let migikabe = this.pushOut.FromTheRightWall(
            lodash.cloneDeep(tetriminoCordinate)
        )

        tetriminoCordinate = lodash.cloneDeep(migikabe.tetriminoCordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ上げる */
        if (migikabe.moved) {
            tetriminoCordinate = this.MoveVerticallyFromCoveringBlock({
                Field:lodash.cloneDeep(Field),
                tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate),
                amountOfMoveY:-1
            })
        }

        return tetriminoCordinate
    }

    // 左右の壁から出して下にずらす
    ReturnTheLeftAndRightOverhangingBlocksToTheField_shiftDown({
            Field,
            tetriminoCordinate
        }){
        /** 左の壁 */
        let hidarikabe = this.pushOut.FromTheLeftWall(
            lodash.cloneDeep(tetriminoCordinate)
        )

        tetriminoCordinate = lodash.cloneDeep(hidarikabe.tetriminoCordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ下げる */
        if (hidarikabe.moved) {
            tetriminoCordinate= this.MoveVerticallyFromCoveringBlock({
                Field:lodash.cloneDeep(Field),
                tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate),
                amountOfMoveY:1
            })
        }

        /** 右の壁 */
        let migikabe = this.pushOut.FromTheRightWall(
            lodash.cloneDeep(tetriminoCordinate)
        )

        tetriminoCordinate = lodash.cloneDeep(migikabe.tetriminoCordinate)

        /** 壁から出したあとにおいてあるブロックと被っていたら1つ下げる */
        if (migikabe.moved) {
            tetriminoCordinate = this.MoveVerticallyFromCoveringBlock({
                Field:lodash.cloneDeep(Field),
                tetriminoCordinate:lodash.cloneDeep(tetriminoCordinate),
                amountOfMoveY:1
            })
        }

        return tetriminoCordinate
    }

    /**
     * X軸に移動させた座標を返す 
     * @param  Field フィールドの状態
     * @param  tetriminoCordinate ブロックの座標
     * @param  amountOfMoveX 移動量 
     * @returns ブロックの座標
     */
    MoveHorizontallyFromCoveringBlock({
        Field,
        tetriminoCordinate,
        amountOfMoveX
    }){
        let tentativeCordinate = lodash.cloneDeep(tetriminoCordinate);
        for (let tentativeBlock of tentativeCordinate){
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
                tentativeCordinate.forEach(block => { block.x +=  amountOfMoveX});
            }
        }

        return tentativeCordinate
    }

    /**
     * Y軸に移動させた座標を返す 
     * @param  Field フィールドの状態
     * @param  tetriminoCordinate ブロックの座標
     * @param  amountOfMoveY 移動量 
     * @returns ブロックの座標
     */
    MoveVerticallyFromCoveringBlock({
        Field,
        tetriminoCordinate,
        amountOfMoveY
    }){
        for (let tentativeBlock of tetriminoCordinate){
            if (Field[tentativeBlock.y][tentativeBlock.x].isFill == true
                &&
                Field[tentativeBlock.y][tentativeBlock.x].isMoving == false) {
                tetriminoCordinate.forEach(block => { block.y +=  amountOfMoveY});
            }
        }

        return tetriminoCordinate
    }
}