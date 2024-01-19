export default class Tetrimino {
    constructor({type,Coordinate}){
        this.type = type
        this.Coordinate = Coordinate
    }

    moveLeft(){ for (let block of this.Coordinate) { block.x -= 1 } }

    moveRight(){ for (let block of this.Coordinate) { block.x += 1 } }

    moveUp(){ for (let block of this.Coordinate) {block.y -= 1} }

    moveDown(){ for (let block of this.Coordinate) {block.y += 1} }

    /** 時計周り回転 */
    // clockwise(Field){}

    /** 半時計周り回転 */
    // counterClockwise(Field){}

}