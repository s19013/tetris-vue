Tetris.jsやTetrisUtils.jsにあるおじゃま関連を外に書き出す｡
# 理由
練習みたいなもの  
なんかできそうだから

# 引っ越しする変数や関数たち
## from Tetris.js
* ~~ojyamaId~~
* ~~ojyamaInterval~~
* ~~ojyamaCountDown~~
* ~~checkWhetherToExecuteOjyama~~

## from TetrisUtils.js
* createOjyama
* insertOjyama


# 修正が必要な部分

## to Tetris.js
* checkWhetherToExecuteOjyamaを削除(331行目)
* checkWhetherToExecuteOjyamaの呼び出しかた変更(312行目)

## to TetrisUtils.js
createOjyama,insertOjyamaを削除

# 他追加で必要なこと
sleepはTetris.jsにおいたままにする  
だとすると､`sleep == true`の時インターバルを止める動作を中で作る必要がある?


# その他コメント
インターバル部分はtetris.jsのままで良いかな?  
-> インターバルは一旦後回しにしよう｡