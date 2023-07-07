<script>
import Field from './components/Field.vue'
export default{
  components:{
    Field,
  },
  data() {
    return {
      field:[
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0],
      ]
    }
  },
  methods:{

  },
  watch:{

  }
}
</script>

<template>
  <main>
    <Field :field="field"></Field>
  </main>
</template>

<style lang="scss" scoped>

</style>
