import Imino from "./Tetrimino/Imino";
import Tmino from "./Tetrimino/Tmino";
import Omino from "./Tetrimino/Omino";
import Smino from "./Tetrimino/Smino";
import Zmino from "./Tetrimino/Zmino";
import Lmino from "./Tetrimino/Lmino";
import Jmino from "./Tetrimino/Jmino";

/** シャッフルライブラリが無いので自作するしかない */
// aiがFisher-Yatesシャッフルアルゴリズムが一番効率的だから使えっていうからそうしてみる
function shuffle(array) {
    // 配列の最後の要素から順に、現在の要素とそれより前の位置にあるランダムな位置の要素を交換。
    for (let i = array.length - 1; i > 0; i--) {
        // 自分より前の要素を適当に選ぶ
        const j = Math.floor(Math.random() * (i + 1));
        // 交換
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 1セットを返す
export function passSet(){
    let base = [new Imino(),new Tmino(),new Omino(),new Smino(),new Zmino(),new Lmino(),new Jmino]
    return shuffle(base) 
}