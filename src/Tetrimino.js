export default class Tetrimino{
    /**
     * type ブロックの形
     * Coordinate 一番最初に現れる位置
     * clockwiseAxis 時計回りのときの中心点
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
            {x:2,y:1},
            {x:3,y:1},
            {x:4,y:1},
            {x:5,y:1},
        ],
        clockwiseAxis:this.Coordinate[2],
        counterClockwiseAxis:this.Coordinate[1]
    }

    T = {
        type:"T",
        Coordinate:[
            {x:3,y:1},
            {x:4,y:0},
            {x:4,y:1},
            {x:5,y:1},
        ],
        clockwiseAxis:this.Coordinate[3],
        counterClockwiseAxis:this.Coordinate[3]
    }

    L = {
        type:"L",
        Coordinate:[
            {x:5,y:0},
            {x:5,y:1},
            {x:4,y:1},
            {x:3,y:1},
        ],
        clockwiseAxis:this.Coordinate[3],
        counterClockwiseAxis:this.Coordinate[3]
    }

    J = {
        type:"J",
        Coordinate:[
            {x:3,y:0},
            {x:3,y:1},
            {x:4,y:1},
            {x:5,y:1},
        ],
        clockwiseAxis:this.Coordinate[3],
        counterClockwiseAxis:this.Coordinate[3]
    }

    S = {
        type:"S",
        Coordinate:[
            {x:5,y:0},
            {x:4,y:0},
            {x:4,y:1},
            {x:3,y:1},
        ],
        clockwiseAxis:this.Coordinate[3],
        counterClockwiseAxis:this.Coordinate[3]
    }

    Z = {
        type:"Z",
        Coordinate:[
            {x:3,y:1},
            {x:4,y:1},
            {x:4,y:0},
            {x:5,y:0},
        ],
        clockwiseAxis:this.Coordinate[3],
        counterClockwiseAxis:this.Coordinate[3]
    }





    // base =
}