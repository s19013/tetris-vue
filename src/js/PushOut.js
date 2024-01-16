import {fieldWidth,fieldHeight} from "./Config"
/**
 * 主に壁などからブロックを押し出す処理をする
 * 完全に出てくるまで繰り返すためwhile
 */

export default class PushOut {
    FromTheFloor(tetriminoCoordinate){
        const bottom  = fieldHeight - 1;

        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.y > bottom) {
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
        const rightEdge   = fieldWidth - 1
        let moved = false
        
        for (let tentativeBlock of tetriminoCoordinate) {
            while (tentativeBlock.x > rightEdge) {
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