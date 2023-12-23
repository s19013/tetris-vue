import {fieldWidth,fieldHeight} from "./Config"
/**
 * 主に壁などからブロックを押し出す処理をする
 * 完全に出てくるまで繰り返すためwhile
 */

export default class PushOut {
    constructor() {
        // indexとかの関係で - 1する
        this.fieldWidth   = fieldWidth - 1
        this.fieldHeight  = fieldHeight - 1;
    }

    FromTheFloor(tetriminoCoordinate){
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.y > this.fieldHeight) {
                tetriminoCoordinate.forEach(block => { block.y -= 1 });
            }
        }

        return tetriminoCoordinate
    }

    FromTheRoof(tetriminoCoordinate){
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.y < 0) {
                tetriminoCoordinate.forEach(block => { block.y += 1 });
            }
        }

        return tetriminoCoordinate
    }

    FromTheLeftWall(tetriminoCoordinate){
        let moved = false
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.x < 0) {
                tetriminoCoordinate.forEach(block => { block.x += 1 });
                moved = true
            }
        }

        return {
            tetriminoCoordinate:tetriminoCoordinate,
            moved:moved
        }
    }

    FromTheRightWall(tetriminoCoordinate){
        let moved = false
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.x > this.fieldWidth) {
                tetriminoCoordinate.forEach(block => { block.x -= 1 });
                moved = true
            }
        }

        return {
            tetriminoCoordinate:tetriminoCoordinate,
            moved:moved
        }
    }

}