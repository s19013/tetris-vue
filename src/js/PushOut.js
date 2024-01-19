import {fieldWidth,fieldHeight} from "./Config"
/**
 * 主に壁などからブロックを押し出す処理をする
 * 完全に出てくるまで繰り返すためwhile
 */

export default class PushOut {
    FromTheFloor(coordinate){
        let correctedCoordinate = coordinate

        // 床から出てくるまで繰り返す
        while (this.isNeedFloorCorrection(correctedCoordinate)) {
            correctedCoordinate.forEach(block => { block.y -= 1; });
        }

        return correctedCoordinate
    }

    FromTheLeftWall(coordinate){
        let correctedCoordinate = coordinate

        // 左壁から出てくるまで繰り返す
        while (this.isNeedLeftCorrection(correctedCoordinate)) {
            correctedCoordinate.forEach(block => { block.x += 1 });
        }

        return correctedCoordinate
    }

    FromTheRightWall(coordinate){
        let correctedCoordinate = coordinate
        // 右壁から出てくるまで繰り返す
        while (this.isNeedRightCorrection(correctedCoordinate)) {
            correctedCoordinate.forEach(block => { block.x -= 1 });
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
        // 1つでも突き抜けてはいけない
        return coordinate.some(block => block.x < 0);
    }

    // 右壁を突き抜けてないか
    isNeedRightCorrection(coordinate){
        const rightEdge   = fieldWidth - 1
        // 1つでも突き抜けてはいけない
        return coordinate.some(block => block.x > rightEdge);
    }

    // 床を突き抜けてないか
    isNeedFloorCorrection(coordinate){
        const bottom  = fieldHeight - 1;
        // 1つでも突き抜けてはいけない
        return coordinate.some(block => block.y > bottom);
    }

    /** 補正をかける*/
    correction(coordinate){
        // 補正をかけた後(色々いじるからクローン)
        coordinate = this.FromTheFloor(coordinate)
        coordinate = this.FromTheLeftWall(coordinate)
        coordinate = this.FromTheRightWall(coordinate)

        return coordinate
    }

}