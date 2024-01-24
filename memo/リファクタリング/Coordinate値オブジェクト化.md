# メリット
?

# デメリット
影響箇所が多い  
変更箇所が多い

# 変更箇所

## Tetris.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更
- [ ] コンストラクタの`this.Coordinate = Coordinate`の部分を`this.coordinate = new Coordinate(coordinate)`に変更
- [ ] `moveOO`の部分をCoordinateクラスの関数を使うように変更

## Imino.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更
- [ ] `Coordinate[0].x`などの座標を参照している部分を`coordinate.status[0].x`のような書き方に変更

## Tmino.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更

## Omino.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更

## Jmino.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更

## Lmino.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更

## Smino.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更

## Zmino.js
- [ ] `Coordinate`と書いている部分を`coordinate`に変更

## CheckCanMove.js
- [ ] `let block of tetrimino.Coordinate`参照している部分を `let block of tetrimino.coordinate.status`

## Clockwise.js
- [ ] `Coordinate` -> `coordinate`
- [ ] `coordinate.map` -> `clonedCoordinate.status`
- [ ] `clonedCoordinate[rotationPoint]` -> `clonedCoordinate.status[rotationPoint]`

## CounterClockwise.js
- [ ] `Coordinate` -> `coordinate`
- [ ] `coordinate.map` -> `clonedCoordinate.status`
- [ ] `clonedCoordinate[rotationPoint]` -> `clonedCoordinate.status[rotationPoint]`

## Field.js
- [ ] `let block of tetrimino.Coordinate`参照している部分を `let block of tetrimino.coordinate.status`
- [ ] `coordinate.every` -> `coordinate.status.every`
- [ ] `let block of ghost.Coordinate`参照している部分を `let block of ghost.coordinate.status`

## PushOut.js
- [ ] `coordinate.some` -> `coordinate.status.some`
- [ ] `correctedCoordinate.forEach(block => { block.y -= 1; });`みたいな処理を`Coordinate`クラスの関数を使う

## RotateHelper.js
- [ ] `moveOO`系は`Coordinate`クラスの関数を使うから全部削除

## Tetris.js
- [ ] `this.ghost.Coordinate[0].y - this.tetrimino.Coordinate[0].y` -> `this.ghost.Coordinate[0].status.y - this.tetrimino.Coordinate[0].status.y`

# コメント
放置してきたつけが回ってきたな｡  
これstatusだけ渡せば変更が少なくなるな｡  
-> でも､引数を`coordinate`じゃなくて`coordinateStatus`とかにしたほうが適切だよな｡  
-> どのみち変更が沢山か?
