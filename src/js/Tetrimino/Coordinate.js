import * as ClockwiseHelper from "../ClockwiseHelper"
import * as CounterClockwiseHelper from "../CounterClockwiseHelper"
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
          const clonedStatus = lodash.cloneDeep(this.status)
          const calculated = clonedStatus.map(
               block => {
               return ClockwiseHelper.equation({
                    rotationPoint:clonedStatus[rotationPoint],
                    beforeRotation:block
               })
          })

          return new Coordinate(calculated)
     }

    counterClockwise({ rotationPoint }){
          const clonedStatus = lodash.cloneDeep(this.status)
          const calculated = clonedStatus.map(
               block => {
               return CounterClockwiseHelper.equation({
                    rotationPoint:clonedStatus[rotationPoint],
                    beforeRotation:block
               })
          })

          return new Coordinate(calculated)
     }

}