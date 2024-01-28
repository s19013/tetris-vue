
/** 回転前点{a,b} 回転点 {c,d} */
/** X = (a - c)cos𝜃 - (b - d)sin𝜃 + c */
/** Y = (a - c)sin𝜃 + (b - d)cos𝜃 + d */

// Math.cosとかはなんかややこしいし､今回は90度しか使わないので使わない
/** cos90 = 0 
 *  SIN90 = 1
 */
/** 計算式(ブロック単体) */
export function equation({
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
