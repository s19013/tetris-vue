<script>
import Tetris from '@/Tetris.js'
import Field from './components/Field.vue'
import Next from './components/Next.vue'
import Hold from './components/Hold.vue'
export default{
  components:{
    Field,
    Next,
    Hold
  },
  data() {
    return {
      tetris:new Tetris(),
      field:[],
      next:[],
      hold:null,
      reRendIntervalId:0
    }
  },
  methods:{
    keyEvents(event){
      // _.debounce(,1000)
      let code = event.code

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
      this.field = this.tetris.Field
      this.next  = this.tetris.nextTetriminos
      this.hold  = this.tetris.holdTetrimino
    }
  },
  watch:{

  },
  beforeMount(){
    // タイミングの問題でここ
    // mountedだと遅すぎてエラーになる
    this.field = this.tetris.Field
    this.next  = this.tetris.nextTetriminos
    this.hold  = this.tetris.holdTetrimino
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
    <Hold :hold="hold"/>
    <Field :field="field"/>
    <Next :next="next"/>
    <!-- <pre>{{ field }}</pre> -->
    <!-- <div class="deb">
      <p v-for="(line,index) in field" :key = index>
        {{ line }}
      </p>
    </div> -->

  </main>
</template>

<style lang="scss" scoped>
main{
  display: grid;
  grid-template-columns: auto auto auto;
  .Field{

  }
  .Next{

  }
}
</style>
