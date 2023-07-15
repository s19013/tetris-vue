export default class Tetrimino{
    /**
     * type ブロックの形
     * Coordinate 一番最初に現れる位置
     * clockwiseAxis 時計回りのときの中心点 (自分自身を参照するのが難しいようなのでindex番号で)
     * counterClockwiseAxis 反時計回りのときの中心点
     */

    O = {
        type:"O",
        Coordinate:[
            {x:4,y:1},
            {x:4,y:0},
            {x:5,y:1},
            {x:5,y:0},
        ],
        clockwiseAxis:null,
        counterClockwiseAxis:null
    }

    // Iは色々特殊
    I = {
        type:"I",
        Coordinate:[
            {x:3,y:2},
            {x:4,y:2},
            {x:5,y:2},
            {x:6,y:2},
        ],
        clockwiseAxis:2,
        counterClockwiseAxis:1
    }

    T = {
        type:"T",
        Coordinate:[
            {x:3,y:1},
            {x:4,y:0},
            {x:4,y:1},
            {x:5,y:1},
        ],
        clockwiseAxis:2,
        counterClockwiseAxis:2
    }

    L = {
        type:"L",
        Coordinate:[
            {x:5,y:0},
            {x:5,y:1},
            {x:4,y:1},
            {x:3,y:1},
        ],
        clockwiseAxis:2,
        counterClockwiseAxis:2
    }

    J = {
        type:"J",
        Coordinate:[
            {x:3,y:0},
            {x:3,y:1},
            {x:4,y:1},
            {x:5,y:1},
        ],
        clockwiseAxis:2,
        counterClockwiseAxis:2
    }

    S = {
        type:"S",
        Coordinate:[
            {x:5,y:0},
            {x:4,y:0},
            {x:4,y:1},
            {x:3,y:1},
        ],
        clockwiseAxis:1, //2
        counterClockwiseAxis:1 //1
    }

    Z = {
        type:"Z",
        Coordinate:[
            {x:5,y:1},
            {x:4,y:1},
            {x:4,y:0},
            {x:3,y:0},
        ],
        clockwiseAxis:1, //1
        counterClockwiseAxis:1 //2
    }

    base = [this.O,this.I,this.T,this.L,this.J,this.S,this.Z]

    /** シャッフルライブラリが無いので自作するしかない */
    shuffle(array) {
        /** ネットにあるコードをほぼそのまま流用 */ 
        
        /** 適当に10回混ぜる */
        for(let i = 0; i<10; i++){

            /** 適当に2つ取る */
            let a = Math.floor(Math.random() * 7);
            let b = Math.floor(Math.random() * 7);
      
            /** 取った2つを入れ替える */
            let tmp = array[a];
            array[a] = array[b];
            array[b] = tmp;
        }

        return array;
    }

    // 1セットを返す
    passSet(){ return this.shuffle(JSON.parse(JSON.stringify(this.base))) }
}