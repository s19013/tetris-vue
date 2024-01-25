import {fieldWidth,fieldHeight} from "./Config"
import lodash from "lodash";
/**
 * 主に壁などからブロックを押し出す処理をする
 * 完全に出てくるまで繰り返すためwhile
 */
    function FromTheFloor(coordinate){
        let correctedCoordinate = coordinate

        // 床から出てくるまで繰り返す
        while (isNeedFloorCorrection(correctedCoordinate)) {
            correctedCoordinate = correctedCoordinate.moveUp()
        }

        return correctedCoordinate
    }

    function FromTheLeftWall(coordinate){
        let correctedCoordinate = coordinate

        // 左壁から出てくるまで繰り返す
        while (isNeedLeftCorrection(correctedCoordinate)) {
            correctedCoordinate = correctedCoordinate.moveRight()
        }

        return correctedCoordinate
    }

    function FromTheRightWall(coordinate){
        let correctedCoordinate = coordinate
        // 右壁から出てくるまで繰り返す
        while (isNeedRightCorrection(correctedCoordinate)) {
            correctedCoordinate = correctedCoordinate.moveLeft()
        }

        return correctedCoordinate
    }

    /** 補正が必要かどうか調べる */
    // 一つでも引っかるならfalse
    export function isNeedCorrection(coordinate){
        if (isNeedFloorCorrection(coordinate)) {return true}
        if (isNeedLeftCorrection(coordinate) ) {return true}
        if (isNeedRightCorrection(coordinate)) {return true}

        return false
    }

    // 左壁を突き抜けてないか
    function isNeedLeftCorrection(coordinate){
        // 1つでも突き抜けてはいけない
        return coordinate.status.some(block => block.x < 0);
    }

    // 右壁を突き抜けてないか
    function isNeedRightCorrection(coordinate){
        const rightEdge   = fieldWidth - 1
        // 1つでも突き抜けてはいけない
        return coordinate.status.some(block => block.x > rightEdge);
    }

    // 床を突き抜けてないか
    function isNeedFloorCorrection(coordinate){
        const bottom  = fieldHeight - 1;
        // 1つでも突き抜けてはいけない
        return coordinate.status.some(block => block.y > bottom);
    }

    /** 補正をかける*/
    export function correction(coordinate){
        // 補正をかけた後(色々いじるからクローン)
        const clonedCoordinate = lodash.cloneDeep(coordinate)
        const coordinatedFloor = FromTheFloor(clonedCoordinate)
        const coordinateLeftwall = FromTheLeftWall(coordinatedFloor)
        const coordinateRightWall = FromTheRightWall(coordinateLeftwall)

        return coordinateRightWall
    }