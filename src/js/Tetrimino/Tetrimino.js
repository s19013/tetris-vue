export default class Tetrimino {
    constructor({type,coordinate}){
        this.type = type
        this.coordinate = coordinate
    }

    moveLeft(){ for (let block of this.coordinate) { block.x -= 1 } }

    moveRight(){ for (let block of this.coordinate) { block.x += 1 } }

    moveUp(){ for (let block of this.coordinate) {block.y -= 1} }

    moveDown(){ for (let block of this.coordinate) {block.y += 1} }

    /** 時計周り回転 */
    // clockwise(Field){}

    /** 半時計周り回転 */
    // counterClockwise(Field){}

}