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
      reRendIntervalId:0
    }
  },
  methods:{
    keyEvents(event){
      // _.debounce(,1000)
      event.preventDefault();
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
      this.field = JSON.parse(JSON.stringify())
      this.next  = JSON.parse(JSON.stringify(this.tetris.nextTetriminos))
      this.hold  = this.tetris.holdTetrimino
      this.isGameOver = this.tetris.isGameOver
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
    this.$nextTick(function () {
      // 定期的再描画
      this.reRendIntervalId = setInterval(this.reRender, 100);
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
    </div>
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
    grid-template-columns: auto auto auto;
    gap:1rem;
    text-align:center;
    justify-content: center;
}
</style>
