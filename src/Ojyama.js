import Block from "./Block"
export default class Ojyama{
    constructor(fieldWidth){this.fieldWidth = fieldWidth}

    createOjyama(){
        let hole = Math.floor(Math.random() * this.fieldWidth)

        let line = []
        for (let n = 0; n < this.fieldWidth; n++) {
            if (hole == n) { line.push(new Block()) }
            else {line.push(new Block(true))}
        }

        return line
    }
}