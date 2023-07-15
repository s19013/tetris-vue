<script>
import Tetris from '@/Tetris.js'
import Field from './components/Field.vue'
import Next from './components/Next.vue'
import Hold from './components/Hold.vue'
import GameOver from './components/GameOver.vue'


export default{
  components:{
    Field,
    Next,
    Hold,
    GameOver
  },
  data() {
    return {
      tetris:new Tetris(),
      field:[],
      next:[],
      hold:null,
      isGameOver:false,
      score:0,
      ren:0,
      isTetris:false,
      reRendIntervalId:0
    }
  },
  methods:{
    keyEvents(event){
      // _.debounce(,1000)
      try {
        event.preventDefault();
      } catch (error) {console.log();}
      
      let code = event.code

      // ゲームオーバーしてたら動かない
      if (this.isGameOver) { return }

      /** 上 */
      if (code == "ArrowUp"   || code == "KeyW") { this.tetris.keyDownUp() }

      /** 下 */
      if (code == "ArrowDown" || code == "KeyS" ) {this.tetris.keyDownDown()}

      /** 左 */
      if (code == "ArrowLeft" || code == "KeyA" ) {this.tetris.keyDownLeft()}

      /** 右 */
      if (code == "ArrowRight" || code == "KeyD") {this.tetris.keyDownRight()}

      /** L 時計回り */
      if (code == "KeyL") {this.tetris.keyDownL()}

      /** J 反時計回り */
      if (code == "KeyJ") {this.tetris.keyDownJ()}

      /** スペース ホールド*/
      if (code == "Space") {this.tetris.keyDownSpace()}


      // デバック用 インターバルを止める
      // if (code == "KeyQ")  {clearInterval(this.reRendIntervalId)}

      /** フィールドを再描画 */
      this.reRender()
    },
    reRender(){
      this.field = JSON.parse(JSON.stringify(this.tetris.Field))
      this.next  = JSON.parse(JSON.stringify(this.tetris.nextTetriminos))
      this.hold  = this.tetris.holdTetrimino
      this.isGameOver = this.tetris.isGameOver
      this.score = this.tetris.score
      this.ren = this.tetris.ren
      this.isTetris = this.tetris.isTetris
    }
  },
  watch:{

  },
  beforeMount(){
    // タイミングの問題でここ
    // mountedだと遅すぎてエラーになる
    this.next  = this.tetris.nextTetriminos
  },
  mounted() {
    // 定期的再描画
    this.reRendIntervalId = setInterval(this.reRender, 100);
    this.$nextTick(function () {
    })
    /** キーボード受付 */
    document.addEventListener('keydown', this.keyEvents)

    

  },
  beforeUnmount() {
    /** キーボードによる動作の削除(副作用みたいエラーがでるため) */
    clearInterval(this.reRendIntervalId)
    document.removeEventListener("keydown", this.keyEvents);
  }
}
</script>

<template>
  <main>
    <GameOver v-if="isGameOver" />
    <div class="game">
      <Hold :hold="hold"/>
      <Field :field="field"/>
      <Next :next="next"/>
      <p class="Score">{{ score }}</p>
      <p class="Ren" v-show="ren > 0">Ren:{{ ren }}</p>
      <p class="isTetris" v-show="isTetris">Tetris!</p>
    </div>
    <div class="controller">
        <button @click="keyEvents({code:'KeyJ'})">左回転</button>
        <button @click="keyEvents({})">↑</button>
        <button @click="keyEvents({code:'KeyL'})">右回転</button>

        <button @click="keyEvents({code:'KeyA'})">←</button>
        <button @click="keyEvents({code:'KeyS'})">↓</button>
        <button @click="keyEvents({code:'KeyD'})">→</button>

        <button @click="keyEvents({code:'Space'})">ホールド</button>
    </div>
    <div class="messages">
      <div class="howToPlay">
        <table border="1">
          <tr>
            <td>WASD 矢印ボタン</td>
            <td>移動</td>
          </tr>
          <tr>
            <td>L</td>
            <td>右回転</td>
          </tr>
          <tr>
            <td>J</td>
            <td>左回転</td>
          </tr>
          <tr>
            <td>Space</td>
            <td>ホールド</td>
          </tr>
        </table>
      </div>
      <div class="Cannot">
        <h2>できないこと(未実装)</h2>
        <p>ハードドロップ</p>
        <p>ゴースト</p>
        <p>Tスピントリプルなどの回しいれ(DT砲とか不可能)</p>
      </div>
    </div>
    <a href="https://github.com/s19013/tetris-vue">コード</a>
    <!-- <pre>{{ field }}</pre> -->
    <!-- <div class="deb">
      <p v-for="(line,index) in field" :key = index>
        <template v-for="(block,index) in line" :key = index>
          <template v-if="block.isFill">1</template>
          <template v-else>0</template>
        </template>
      </p>
    </div> -->

  </main>
</template>

<style lang="scss" scoped>
.game{
    display: grid;
    grid-template-rows: auto auto  0.2fr 0.2fr;
    grid-template-columns: auto auto auto;
    gap:1rem;
    text-align:center;
    justify-content: center;

    .Hold{
      grid-column: 1/2;
      grid-row: 1/2;
    }
    .Field{
      grid-column:2/3;
      grid-row: 1/3;
    }
    .Next{
      grid-column: 3/4;
      grid-row: 1/2;
    }
    .Score{
      grid-column:2/3;
      grid-row: 3/4;
    }
    .isTetris{
      grid-column: 3/4;
      grid-row: 2/3;
    }
    .Ren{
      grid-column: 1/2;
      grid-row: 2/3;
    }
}
.messages{
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr ;
    gap:1rem;
    justify-content: center;
    .howToPlay{
      margin-right: 0;
      margin-left: auto;
      td{padding:0.5rem}
    }
}

.controller{
  @media (min-width: 961px){
    display: none;
  }
  display: grid;
  margin-top:1rem;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  button{padding: 1rem;}
  :nth-child(7){grid-column: 1/4;}
}
</style>
