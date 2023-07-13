# できないことが沢山あるテトリス
とりあえず自力だけで1から作ってみたかった｡

## 操作
|||
|--|--|
|WASD 矢印|移動|
|J|左回転|
|L|右回転|
|Space|ホールド|

## できないこと(未実装)
* Tスピントリプルなどの回し入れ(DT砲など不可能)
* ハードドロップ
* ゴースト


# 苦労したとこ
ところどころ浅いコピーをしてしまって予定通りの動きをしなかった｡そして浅いコピーが原因だと気づくのに時間がかかった


## 回転系
このコードで一番大変だった  
これが本当にエラーの連続｡  
そもそもどうやって回すのかわかるまで時間かかったし｡  
その後ぶつかるブロックをどうするかが分からなかった｡  
三角関数を勉強しなおした｡  
思いついた方法を片っ端から試していったり､頭の中にある考えをひたすら紙に書き出すなどした｡  
一見成功したかに見えるコードでも､別のパターンだと想定外の動きをして結局作り直したりした｡  
一難去ってまた一難の連続だった  
Iミノの癖が強い  
3日以上はかかってしまった｡

# 参考にした
* https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
* https://www.javadrive.jp/javascript/array/index10.html
* https://codelikes.com/javascript-throw/
* https://pisuke-code.com/js-correct-way-of-array-copy/
* https://www.freecodecamp.org/japanese/news/how-to-clone-an-array-in-javascript-1d3183468f6a/