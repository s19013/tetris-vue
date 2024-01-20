import PushOut from "./PushOut";
export default class RotateHelper{
    //note: 引数で受け取るのがオブジェクト型だったのでこのような形にする必要があった｡
    moveUp(coordinate){
        const moved = coordinate.map(block => {
                return {x:block.x,y:block.y -= 1 }
            }
        );
        return (new PushOut()).correction(moved);
    }

    moveDown(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x,y:block.y += 1}
        });
        return (new PushOut()).correction(moved)
    }

    moveLeft(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x -= 1,y:block.y}
        });
        return (new PushOut()).correction(moved)
    }

    moveRight(coordinate){
        const moved = coordinate.map(block => {
            return {x:block.x += 1,y:block.y}
        });
        return (new PushOut()).correction(moved)
    }
}
