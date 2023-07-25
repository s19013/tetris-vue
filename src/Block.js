export default class Block{
    constructor(isFill=false){
        /** 空かどうか */ this.isFill  = isFill
    }
    /** 動かしているかどうか */ isMoving = false 
    /** 落とせる場所か(ゴースト) */ ghost = false
}