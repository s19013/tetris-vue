import * as pushOut from "./PushOut"
import * as helper from "./RotateHelper"

function rotateTetrimino({
    field,
    coordinate,
    rotationPoint,
    directions,
    rotateFunction // コールバックというか回す関数を入れる
}) {
    console.log(coordinate);
    // 回転実行
    const rotated = rotateFunction({rotationPoint: rotationPoint});

    // 補正をかける
    const corrected = pushOut.correction(rotated);

    // どのブロックにも被って無いならすぐ返す
    if (field.tetriminoIsNotOverlap(corrected)) { return corrected; }

    const turnedIn = helper.turnIn({
        field: field,
        coordinate: corrected,
        directions: directions
    });

    // 回し入れ成功ならそれを返す
    if (turnedIn != null) { return turnedIn; }
    
    // 失敗時したら上げる方法を試す｡
    const liftUpded = helper.liftUp({
        field: field,
        coordinate: rotated
    });

    // 押上で問題ないならそれを返す
    if (liftUpded != null) { return liftUpded; }

    // ここまでやってだめなら初期値を返す
    return coordinate;
}

export function clockwise({
    field,
    coordinate,
    rotationPoint,
    directions
}) {
    return rotateTetrimino({
        field,
        coordinate,
        rotationPoint,
        directions,
        rotateFunction: coordinate.clockwise.bind(coordinate)
    });
    // .bind(coordinate)でコールバックの処理でthisを使う時coordinate内のthisが使われる?
    //  -> という解釈であっているはず
}

export function counterClockwise({
    field,
    coordinate,
    rotationPoint,
    directions
}) {
    return rotateTetrimino({
        field,
        coordinate,
        rotationPoint,
        directions,
        rotateFunction: coordinate.counterClockwise.bind(coordinate)
    });
}