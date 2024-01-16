import Rule1 from './Rule1'
import Rule2 from './Rule2'

export default class GameOverPolicty{
    constructor() {
        this.rules = [
            new Rule1(),
            new Rule2()
        ]
    }

    // add(rule){ this.rules.push(rule) }

    isGameOver(Field){
        for (const rule of this.rules) {
            // 一つでも満たしたら即trueを返す
            if (rule.isGameOver(Field)) {  return true }
        }
        return false
    }
}