export default class Block{
    constructor(isFill=false){
        /** 空かどうか */ this.isFill  = isFill
    }
    /** 動かしているかどうか */ isMoving = false 
}