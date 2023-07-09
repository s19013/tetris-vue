<script>
import Field from './components/Field.vue'
import Tetris from '@/Tetris.js'
export default{
  components:{
    Field,
  },
  data() {
    return {
      tetris:new Tetris(),
      field:[],
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

      /** スペース */
      if (code == "Space") {this.tetris.keyDownSpace()}


      // デバック用 インターバルを止める
      if (code == "KeyQ")  {clearInterval(this.reRendIntervalId)}

      /** フィールドを再描画 */
      this.reRender()
    },
    reRender(){
      this.field = this.tetris.display()
    }
  },
  watch:{

  },
  mounted() {
    this.$nextTick(function () {
      this.field = this.tetris.display()
      // 定期的再描画
      this.reRendIntervalId = setInterval(this.reRender, 1000);

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
    <Field :field="field"></Field>
    <!-- <pre>{{ field }}</pre> -->
    <div v-for="(line,index) in field" :key = index>
      {{ line }}
    </div>

  </main>
</template>

<style lang="scss" scoped>

</style>
