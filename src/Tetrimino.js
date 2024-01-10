import lodash from 'lodash';
export default class Tetrimino{
    constructor(roof){
        /** 落とし初めて良い場所の最大値 */
        this.roof = roof 

        /**
     * type ブロックの形
     * Coordinate 一番最初に現れる位置
     * axis 回転する時の中心点 (自分自身を参照するのが難しいようなのでindex番号で)
     */

        this.O = {
            type:"O",
            Coordinate:[
                {x:4,y:this.roof + 1},
                {x:4,y:this.roof},
                {x:5,y:this.roof + 1},
                {x:5,y:this.roof},
            ],
            axis:null,
        }

    // Iは色々特殊
        this.I = {
            type:"I",
            Coordinate:[
                {x:3,y:this.roof + 1},
                {x:4,y:this.roof + 1},
                {x:5,y:this.roof + 1},
                {x:6,y:this.roof + 1},
            ],
            axis:1,
        }

        this.T = {
            type:"T",
            Coordinate:[
                {x:3,y:this.roof + 1},
                {x:4,y:this.roof },
                {x:4,y:this.roof + 1},
                {x:5,y:this.roof + 1},
            ],
            axis:2,
        }

        this.L = {
            type:"L",
            Coordinate:[
                {x:5,y:this.roof},
                {x:5,y:this.roof + 1},
                {x:4,y:this.roof + 1},
                {x:3,y:this.roof + 1},
            ],
            axis:2,
        }

        this.J = {
            type:"J",
            Coordinate:[
                {x:3,y:this.roof},
                {x:3,y:this.roof + 1},
                {x:4,y:this.roof + 1},
                {x:5,y:this.roof + 1},
            ],
            axis:2,
        }

        this.S = {
            type:"S",
            Coordinate:[
                {x:5,y:this.roof},
                {x:4,y:this.roof},
                {x:4,y:this.roof + 1},
                {x:3,y:this.roof + 1},
            ],
            axis:1,
        }

        this.Z = {
            type:"Z",
            Coordinate:[
                {x:5,y:this.roof + 1},
                {x:4,y:this.roof + 1},
                {x:4,y:this.roof},
                {x:3,y:this.roof},
            ],
            axis:1,
        }

        this.base = [this.O,this.I,this.T,this.L,this.J,this.S,this.Z]
    }

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
    passSet(){ return this.shuffle(lodash.cloneDeep(this.base)) }
}