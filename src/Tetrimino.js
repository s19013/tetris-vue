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
            {x:3,y:1},
            {x:4,y:1},
            {x:5,y:1},
            {x:6,y:1},
        ],
        clockwiseAxis:2,
        counterClockwiseAxis:2
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
        clockwiseAxis:2,
        counterClockwiseAxis:1
    }

    Z = {
        type:"Z",
        Coordinate:[
            {x:3,y:1},
            {x:4,y:1},
            {x:4,y:0},
            {x:5,y:0},
        ],
        clockwiseAxis:1,
        counterClockwiseAxis:2
    }

    // base =
}