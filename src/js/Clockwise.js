
import PushOut from "./PushOut";

// HACK:かなりめちゃくちゃなので整理する必要がある
export function rotate({
    field,
    type,
    Coordinate,
    rotationPoint
}){
    // 回転実行
    const rotated = calculation({
        coordinate:Coordinate,
        rotationPoint:rotationPoint
    })

    // 補正をかける
    const corrected =  (new PushOut()).correction(rotated)

    // どのブロックにも被って無いならすぐ返す
    if (field.tetriminoIsNotOverlap(corrected)) { return corrected }

    let turnedIn = {}
    if (type == "s" || type == "z") { 
        turnedIn = turnSZminoIn({
            field:field,
            coordinate:corrected
        }) 
    }
    else {turnedIn = turnAtherminoIn({
            field:field,
            coordinate:corrected
        })
    }

    // 回し入れ失敗なら
    if (turnedIn[0].x == "none") { return Coordinate }
    return turnedIn



}

/** SミノZミノ回し入れ */
function turnSZminoIn({
    field,
    coordinate
}) {
    const movedDown = moveDown(coordinate)
    if (field.tetriminoIsNotOverlap(movedDown)) { return movedDown }

    const onemoreMovedDown = moveDown(movedDown)
    if (field.tetriminoIsNotOverlap(onemoreMovedDown)) { return onemoreMovedDown }

    // それでもだめなら全く新しい変数を作ってやり直す
    // 上に動かす
    const movedUp = moveUp(coordinate)
    if (field.tetriminoIsNotOverlap(movedUp)) { return movedUp }

    const onemoreMovedUp = moveUp(movedUp)
    if (field.tetriminoIsNotOverlap(onemoreMovedUp)) { return onemoreMovedUp }
    // これまでやってもだめなら失敗フラグを返す
    return [{x:"none",y:"none"}]
}

/** 他のミノ回し入れ */
function turnAtherminoIn({
    field,
    coordinate
}) {
    const movedDown = moveDown(coordinate)
    if (field.tetriminoIsNotOverlap(movedDown)) { return movedDown }

    const movedLeft = moveLeft(movedDown)
    if (field.tetriminoIsNotOverlap(movedLeft)) { return movedLeft }

    const onemoreMovedDown = moveDown(movedLeft)
    if (field.tetriminoIsNotOverlap(onemoreMovedDown)) { return onemoreMovedDown }

    // それでもだめなら全く新しい変数を作ってやり直す
    // 上に動かす
    const movedUp = moveUp(coordinate)
    if (field.tetriminoIsNotOverlap(movedUp)) { return movedUp }

    const onemoreMovedUp = moveUp(movedUp)
    if (field.tetriminoIsNotOverlap(onemoreMovedUp)) { return onemoreMovedUp }
    // これまでやってもだめなら失敗フラグを返す
    return [{x:"none",y:"none"}]
}

/** 成功条件をまとめた関数 */

/** すべてのブロックを計算して返す */
function calculation({
    coordinate,
    rotationPoint
}) {
    return coordinate.map(
        block => {
        return equation({
            rotationPoint:coordinate[rotationPoint],
            beforeRotation:block
        })
    })
}

/** 回転前点{a,b} 回転点 {c,d} */
/** X = (a - c)cos𝜃 - (b - d)sin𝜃 + c */
/** Y = (a - c)sin𝜃 + (b - d)cos𝜃 + d */

// Math.cosとかはなんかややこしいし､今回は90度しか使わないので使わない
/** cos90 = 0 
 *  SIN90 = 1
 */
/** 計算式(ブロック単体) */
function equation({
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


//HACK: これらはここに置くのは不適切だとは思うが今は一旦ここにおいて後で移動する
//note: 引数で受け取るのがオブジェクト型だったのでこのような形にする必要があった｡
function moveUp(coordinate){
    let moved = coordinate.map(block => {
            return {x:block.x,y:block.y -= 1 }
        }
    );
    return (new PushOut()).correction(moved)
}

function moveDown(coordinate){
    const moved = coordinate.map(block => {
        return {x:block.x,y:block.y += 1}
    });
    return (new PushOut()).correction(moved)
}

function moveLeft(coordinate){
    let moved = coordinate.map(block => {
        return {x:block.x -= 1,y:block.y}
    });
    return (new PushOut()).correction(moved)
}

