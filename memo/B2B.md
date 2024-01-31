# B2Bの条件
* Tミノの回し入れで消した｡
* 4列消し

# どうやって認識させるか｡
## コールバックを使う
B2B有効化関数を引数で渡して条件を満たしたらその関数を動かす?  
bindを使えばできる?

### 引数リレー?
Tetris.js  
↓  
Tetriminoクラス  

Tetriminoクラス  
↓  
Rotation.js  

TetriminoクラスからRotation.jsにわたす時bindが消えてしまわないか?

ここまできたらScoreクラスをそのまま渡してしまったほうがよいのでは?

## 条件とは?
turnInが成功(帰り値がnullではない)したと認識させればよい｡