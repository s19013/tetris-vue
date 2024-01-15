export default class Block{
    constructor(isFill=false){
        /** ブロックで埋まっているかどうか  */ 
        this.isFill  = isFill

        /** 動かしているかどうか */
        this.isMoving = false 

        /** 落とせる場所か(ゴースト) */
        this.ghost = false

        /** 1列そろっているかどうか */
        this.lined = false
    }
}