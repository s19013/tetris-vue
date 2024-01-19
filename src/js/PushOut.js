import {fieldWidth,fieldHeight} from "./Config"
import lodash from 'lodash';
/**
 * 主に壁などからブロックを押し出す処理をする
 * 完全に出てくるまで繰り返すためwhile
 */

export default class PushOut {
    FromTheFloor(coordinate){
        const bottom  = fieldHeight - 1;
        let correctedCoordinate = coordinate
        for (let block of correctedCoordinate) {
            // 床から出てくるまで繰り返す
            while (block.y > bottom) { coordinate.forEach(block => { block.y -= 1 }); }
        }

        return correctedCoordinate
    }

    FromTheLeftWall(coordinate){
        let correctedCoordinate = coordinate
        for (let block of correctedCoordinate) {
            // 左壁から出てくるまで繰り返す
            while (block.x < 0) { correctedCoordinate.forEach(block => { block.x += 1 }); }
        }

        return correctedCoordinate
    }

    FromTheRightWall(coordinate){
        const rightEdge   = fieldWidth - 1
        let correctedCoordinate = coordinate
        
        for (let block of correctedCoordinate) {
            // 右壁から出てくるまで繰り返す
            while (block.x > rightEdge) { correctedCoordinate.forEach(block => { block.x -= 1 }); }
        }

        return correctedCoordinate
    }

    /** 補正が必要かどうか調べる */
    // 一つでも引っかるならfalse
    isNeedCorrection(coordinate){
        if (this.isNeedFloorCorrection(coordinate)) {return true}
        if (this.isNeedLeftCorrection(coordinate) ) {return true}
        if (this.isNeedRightCorrection(coordinate)) {return true}

        return false
    }

    // 左壁を突き抜けてないか
    isNeedLeftCorrection(coordinate){
        for (let block of coordinate) {
            if (block.x < 0) { return true }
        }
        return false
    }

    // 右壁を突き抜けてないか
    isNeedRightCorrection(coordinate){
        const rightEdge   = fieldWidth - 1
        for (let block of coordinate) {
            if (block.x > rightEdge) { return true }
        }
        return false
    }

    // 床を突き抜けてないか
    isNeedFloorCorrection(coordinate){
        const bottom  = fieldHeight - 1;
        for (let block of coordinate) {
            if (block.y > bottom) { return true }
        }
        return false
    }

    /** 補正をかける*/
    correction(coordinate){
        // 補正をかけた後(色々いじるからクローン)
        let corrected = lodash.cloneDeep(coordinate)
        if (this.isNeedFloorCorrection(corrected)) {
            corrected = this.FromTheFloor(corrected)
        }
        if (this.isNeedLeftCorrection(corrected)) {
            corrected = this.FromTheLeftWall(corrected)
        }
        if (this.isNeedRightCorrection(corrected)) {
            corrected = this.FromTheRightWall(corrected)
        }

        return corrected
    }

}