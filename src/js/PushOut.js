import {fieldWidth,fieldHeight} from "./Config"
import lodash from 'lodash';
/**
 * 主に壁などからブロックを押し出す処理をする
 * 完全に出てくるまで繰り返すためwhile
 */

export default class PushOut {
    FromTheFloor(tetrimino){
        const bottom  = fieldHeight - 1;
        for (let block of tetrimino.Coordinate) {
            // 床から出てくるまで繰り返す
            while (block.y > bottom) { tetrimino.moveUp() }
        }

        return tetrimino
    }

    FromTheRoof(tetrimino){
        for (let block of tetrimino.Coordinate) {
            while (block.y < 0) { tetrimino.moveDown() }
        }

        return tetrimino
    }

    FromTheLeftWall(tetrimino){
        for (let block of tetrimino.Coordinate) {
            // 左壁から出てくるまで繰り返す
            while (block.x < 0) { tetrimino.moveRight() }
        }

        return tetrimino
    }

    FromTheRightWall(tetrimino){
        const rightEdge   = fieldWidth - 1
        
        for (let block of tetrimino.Coordinate) {
            // 右壁から出てくるまで繰り返す
            while (block.x > rightEdge) { tetrimino.moveLeft() }
        }

        return tetrimino
    }

    /** 補正が必要かどうか調べる */
    // 一つでも引っかるならfalse
    isNeedCorrection(tetrimino){
        if (this.isNeedFloorCorrection(tetrimino)) {return true}
        if (this.isNeedLeftCorrection(tetrimino) ) {return true}
        if (this.isNeedRightCorrection(tetrimino)) {return true}

        return false
    }

    // 左壁を突き抜けてないか
    isNeedLeftCorrection(tetrimino){
        for (let block of tetrimino.Coordinate) {
            if (block.x < 0) { return true }
        }
        return false
    }

    // 右壁を突き抜けてないか
    isNeedRightCorrection(tetrimino){
        const rightEdge   = fieldWidth - 1
        for (let block of tetrimino.Coordinate) {
            if (block.x > rightEdge) { return true }
        }
        return false
    }

    // 床を突き抜けてないか
    isNeedFloorCorrection(tetrimino){
        const bottom  = fieldHeight - 1;
        for (let block of tetrimino.Coordinate) {
            if (block.y > bottom) { return true }
        }
        return false
    }

    /** 補正をかける*/
    correction(tetrimino){
        // 補正をかけた後(色々いじるからクローン)
        let correctioned = lodash.cloneDeep(tetrimino)
        if (this.isNeedFloorCorrection(correctioned)) {
            correctioned = this.FromTheFloor(tetrimino)
        }
        if (this.isNeedLeftCorrection(correctioned)) {
            correctioned = this.FromTheLeftWall(correctioned)
        }
        if (this.isNeedRightCorrection(correctioned)) {
            correctioned = this.FromTheRightWall(correctioned)
        }

        return correctioned
    }

}