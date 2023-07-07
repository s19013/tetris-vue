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

  },
  watch:{

  },
  mounted() {
    this.$nextTick(function () {
      this.field = this.tetris.display()
    })
  },
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
