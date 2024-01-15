Tetris.jsやTetrisUtils.jsにあるおじゃま関連を外に書き出す｡
# 理由
練習みたいなもの  
なんかできそうだから

# 引っ越しする変数や関数たち
## from Tetris.js
* - [x] ojyamaId
* - [x] ojyamaInterval
* - [x] ojyamaCountDown
* - [x] checkWhetherToExecuteOjyama()
* - [x] startOjyamaInterval()
* - [x] deleteOjyamaInterval()

## from TetrisUtils.js
* - [x] createOjyama()
* - [x] insertOjyama()


# 修正が必要な部分
## to Ojyama.js
ojyamaOOみたいなやつのojyama部分はとって良いな｡

## to Tetris.js
* - [x] 引っ越した変数､関数達を削除
* - [x] ojyamaインスタンス作成
* - [x] insertOjyamaを指示するコードを追加
* - [x] sleeping関係をまとめて動かす関数


## to TetrisUtils.js
* - [x] createOjyama,insertOjyamaを削除

## to App.vue
* - [x] `ojyamaCountDown`の参照先変えないと

# 他追加で必要なこと


# その他コメント