参考サイト
[【#10】～Tスピン判定編～新人プログラマーはテトリスを作れるのか？【C#.NET】](https://www.terasol.co.jp/%e3%83%97%e3%83%ad%e3%82%b0%e3%83%a9%e3%83%9f%e3%83%b3%e3%82%b0/6729)

# Tスピン判定
>* 現在操作しているミノが「Tミノ」である
>* 設置したタイミングで最後の操作が「ミノの回転」である
>* Tミノの周囲4マスの空間のうち、3マス以上が壁やミノで埋まっている

この3つを満たせば良い｡  
Tミノクラスに色々関数を加えれば良いはず｡  
フラグも全部Tミノクラスに入れれば良いか｡  
->これ厳密には3マス埋まるではなく｡左側が1マス以上､右側が1マス以上では?

1番目のブロックと､4番目のブロックの上下を確認すれば良い  
フィールドと､ブロックで別々にする必要があるな｡  
-> Tミノの中でしか使わないからTミノのファイルの中でやればよいか｡  
上下を調べるって思ったけど､今向いている方向がわからないと正しく確認ができないな｡
-> 状態を表す何かが必要

何かをするたびにTスピン判定関数を実行  
-> いや､turnIn関数成功したらTスピン成功で良いくない?  
->-> いや良くない!回し入れしなくてもTスピンが成立するから｡


# Tスピンミニ判定
>* Tスピンを成功させる
>* 埋まっている空間の数が「3つ」であり、その位置がTミノの土台側に2つ、凸型の方に1つである
>* スーパーローテーションの到達パターン数が「4以外」である

スーパーローテーションとか実装してないけど､多分私の実装のやり方なら行けるのでは?  
->私の回転アルゴリズム､回し入れアルゴリズムではtスピンミニの実装は難しそうだ｡  
->> 根本的に回転アルゴリズムを変更する必要がある  
->> 説明欄にtスピンミニはできないって説明しないと  

Tみのだけで色々特殊なことをするからいっそのことTみのの回転のやり方は独立させた方が良いかも  
-> ここまできたらテトリミノクラスを継承しなくてもいいけど､インターフェイスの代わりにやってるもんだし｡ここらへんの問題はtsに書き換えてから｡

# 回転の状態
directionOfMino 数値  
初期値:1 (凸部分が上をむいている状態)

奇数:上向き下向き -> yの+-1を調べる
偶数:左向き右向き -> xの+-1を調べる

## addDirectionOfMino
directionOfMino += 1  
if directionOfMino > 4 -> directionOfMino = 1  

## subDirectionOfMino
directionOfMino -= 1  
if directionOfMino < 1 -> directionOfMino = 4  

# 上下もしくは左右が埋まってるかどうか調べる
まずはdirectionOfMinoが奇数か偶数か調べる必要がある｡  
奇数か偶数かで関数を分けたほうが良い  
-> 名前どうしよう｡  
単純にodd､evenにするかな?  
-> directionOfMinoIsOdd,directionOfMinoIsEven のほうがより適切か?

条件を配列に入れといてforで回すか?

## 奇数
field.status[(coordinate.status[0].y) + 1][coordinate.status[0].x],  
field.status[(coordinate.status[0].y) - 1][coordinate.status[0].x],  
field.status[(coordinate.status[3].y) + 1][coordinate.status[3].x],  
field.status[(coordinate.status[3].y) - 1][coordinate.status[3].x],  
の4個所を調べる

## 偶数
field.status[coordinate.status[0].y][(coordinate.status[0].x) + 1],  
field.status[coordinate.status[0].y][(coordinate.status[0].x) - 1],  
field.status[coordinate.status[3].y][(coordinate.status[3].x) + 1],  
field.status[coordinate.status[3].y][(coordinate.status[3].x) - 1],  
の4個所を調べる

## 壁はどう調べるか
フィールドを調べる前に壁かどうかを調べる必要がある

幅:10  
高さ:30  
だった場合  

x == -1,10  
y == -1,30  
がフィールドの範囲外となるので  

(coordinate[0].x) + 1 == 30  
ならばその場所はフィールドの範囲外,つまり壁ということになる

xに関しては (coordinate[0].x) + 1 == -1  
かどうかも調べないといけない

x == -1,30の場合
field.status[coordinate.status[0].y][(coordinate.status[0].x) + 1]
はエラーがでる(フィールドに存在しないため)

いっそのことtrycatchでやったほうが2つまとめられて楽?  
-> いや危ないか?ちゃんとif文で分岐すべきか?

# スコアとか表示関係はどうしよう?
スコア計算でもTスピンしたかどうかの情報が必要｡  
いっそのことTスピンした時だけの個別の関数を作ってしまったほうが汚さずにすむか?  
コールバックっていう手もあるな｡

## そもそもcalculationの処理を分割して個別のTetris.jsで呼び出そう
表示系はTetris.jsに移したほうが良さそう?

# ボヤキ
thisを使ってたからか｡通りで変化してないなと思ったら…｡  
TspinMiniはまた今度  
-> そろそろ就活再開しないと｡  
tスピンミニは端に当たるブロックのとなりが壁かどうか調べてば成立する?  
-> また別の変数が必要だな｡  

個別に進む方向を持っているのだからTだけ変える?