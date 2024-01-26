import * as pushOut from "./PushOut"
import * as helper from "./RotateHelper"

export function clockwise({
    field,
    coordinate,
    rotationPoint,
    directions
}) {
    // 回転実行
    const rotated = coordinate.clockwise({rotationPoint:rotationPoint})

    // 補正をかける
    const corrected =  pushOut.correction(rotated)

    // どのブロックにも被って無いならすぐ返す
    if (field.tetriminoIsNotOverlap(corrected)) { return corrected }

    const turnedIn = helper.turnIn(
        {
            field:field,
            coordinate:corrected,
            directions:directions
        }
    );

    // 回し入れ成功ならそれを返す
    if (turnedIn != null ) { return turnedIn  }
    
    // 失敗時したら上げる方法を試す｡
    // 最初の回転したを入れるのは仕様
    const liftUpded = helper.liftUp({
        field:field,
        coordinate:rotated
    })

    // 押上で問題ないならそれを返す
    if (liftUpded != null ) { return liftUpded  }

    // ここまでやってだめなら初期値を返す
    return coordinate
}

export function counterClockwise({
    field,
    coordinate,
    rotationPoint,
    directions
}) {
    // 回転実行
    const rotated = coordinate.counterClockwise({rotationPoint:rotationPoint})

    // 補正をかける
    const corrected =  pushOut.correction(rotated)

    // どのブロックにも被って無いならすぐ返す
    if (field.tetriminoIsNotOverlap(corrected)) { return corrected }

    const turnedIn = helper.turnIn(
        {
            field:field,
            coordinate:corrected,
            directions:directions
        }
    );

    // 回し入れ成功ならそれを返す
    if (turnedIn != null ) { return turnedIn  }
    
    // 失敗時したら上げる方法を試す｡
    // 最初の回転したを入れるのは仕様
    const liftUpded = helper.liftUp({
        field:field,
        coordinate:rotated
    })

    // 押上で問題ないならそれを返す
    if (liftUpded != null ) { return liftUpded  }

    // ここまでやってだめなら初期値を返す
    return coordinate
}