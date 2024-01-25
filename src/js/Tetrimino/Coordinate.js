import ClockwiseHelper from "../ClockwiseHelper"
import CounterClockwiseHelper from "../CounterClockwiseHelper"
import lodash from "lodash";

export default class Coordinate{
    constructor(status) {
        this.status = status 
        ??
        [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}]
    }

    moveLeft(){
         for (let block of this.status) { block.x -= 1 } 
         return new Coordinate(this.status)
    }

    moveRight(){
         for (let block of this.status) { block.x += 1 }
         return new Coordinate(this.status)
    }

    moveUp(){
         for (let block of this.status) {block.y -= 1} 
         return new Coordinate(this.status)
    }

    moveDown(){
         for (let block of this.status) {block.y += 1} 
         return new Coordinate(this.status)
    }

    clockwise({ rotationPoint }) {
          const clonedCoordinate = lodash.cloneDeep(this.status)
          const calculated = clonedCoordinate.status.map(
               block => {
               return ClockwiseHelper.equation({
                    rotationPoint:clonedCoordinate.status[rotationPoint],
                    beforeRotation:block
               })
          })

          return new Coordinate(calculated)
     }

    counterClockwise({ rotationPoint }){
          const clonedCoordinate = lodash.cloneDeep(this.status)
          const calculated = clonedCoordinate.status.map(
               block => {
               return CounterClockwiseHelper.equation({
                    rotationPoint:clonedCoordinate.status[rotationPoint],
                    beforeRotation:block
               })
          })

          return new Coordinate(calculated)
     }

}