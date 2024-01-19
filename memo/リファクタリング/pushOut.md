# 変数を適切な名前に変更し､使う関数内で定数化する
一度しか使わないし､使う関数も1つと決まっているから

# 却下 ~~forEachでしている処理をTetrisクラスの関数にやらせる~~
そのためにはtetriminoCoordinateをTetrisに変更し､Tetrisクラス型の要素を入れる  
帰り値はTetriminoクラス型

## 却下理由
仕様上難しい  
仕様上tetriminoクラスは渡せない｡ 座標しか渡せない  
だからtetriminoクラスの関数は使えない  
帰り値はTetriminoクラス型にするのも仕様上難しい  



## 編集する他ファイル
### Rotate.js
引数をTetrisクラス型の変数を入れる  
というかこれはそもそも､Rotate.jsのリファクタリングを先にやる必要がある  


# 追加する関数
## isNeedCorrection
補正が必要かどうか調べる 

## isNeedLeftCorrection
テトリミノが左壁を突き抜けてないか調べる

## isNeedRightCorrection
テトリミノが右壁を突き抜けてないか調べる

## isNeedFloorCorrection
テトリミノが床を突き抜けてないか調べる

## correction
補正をかける

# その他コメント
補正をかけるべきかは別々でわけないとややこしい?  
調べずに全部の補正かかけたら余計にはみ出てしまう?




