import {fieldWidth} from "./Config"
import lodash from 'lodash';

export default class Ojyama{
    constructor() {
        this.ojyamaId = 0

        /** 下からせり上がるまでの時間 */
        this.interval = 15000 //ms

        /** お邪魔が発動するまでのカウントダウンタイマー */
        this.countDown = this.interval

        /** 一時停止のフラグ */
        this.sleeping = false
    }

    // これレベルによって開ける穴の数増やしても良いかも?
    createOjyama(){
        let hole = Math.floor(Math.random() * fieldWidth)
    
        let row = []
        for (let n = 0; n < fieldWidth; n++) {
            if (hole == n) { row.push(false) }
            else {row.push(true)}
        }
    
        return row
    }
    
    insertOjyama(Field){
        /** 一番上を消してしまう 
         * 縦のマス数が規定の数を超えないように
        */
        Field.status.shift();
    
        // お邪魔の列を一番うしろに消す
        Field.status.push(lodash.cloneDeep(this.createOjyama()))

        // 実行したらカウントダウン再設定
        this.countDown = this.interval

        return Field
    }

    /** お邪魔を実行するか確認 */
    checkWhetherToExecuteOjyama(){ return this.countDown <= 0 }

    startInterval(){
        this.ojyamaId = setInterval(() => {
            if(this.sleeping){ return }
            this.countDown -= 100 //ms
        },100)
    }

    deleteInterval(){ clearInterval(this.ojyamaId) }

    enableSleeping(){ this.sleeping = true }
    disableSleeping(){ this.sleeping = false }
    predeterminedTimeSetter(ms){this.interval = ms}
}