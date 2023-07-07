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
    }
  },
  methods:{
    keyEvents(event){
      
      let code = event.code
      console.log(code);

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


      /** フィールドを再描画 */
      this.field = this.tetris.display()
    },


  },
  watch:{

  },
  mounted() {
    this.$nextTick(function () {
      this.field = this.tetris.display()
    })
    /** キーボード受付 */
    document.addEventListener('keydown', this.keyEvents)

  },
  beforeUnmount() {
    /** キーボードによる動作の削除(副作用みたいエラーがでるため) */
    
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
