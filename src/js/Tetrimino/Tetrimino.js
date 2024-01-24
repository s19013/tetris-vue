import Coordinate from "./Coordinate"

export default class Tetrimino {
    constructor({type,coordinate}){
        this.type = type
        this.coordinate = new Coordinate(coordinate)
    }

    moveLeft(){
        this.coordinate = this.coordinate.moveLeft()
    }

    moveRight(){
        this.coordinate = this.coordinate.moveRight()
    }

    moveUp(){
        this.coordinate = this.coordinate.moveUp()
    }

    moveDown(){
        this.coordinate = this.coordinate.moveDown()
    }

}