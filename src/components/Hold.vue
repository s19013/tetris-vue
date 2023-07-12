<script>
export default{
  components:{

  },
  data() {
    return {
      
    }
  },
  props:{
    hold:{
        type:Object,
    }
  },
  methods:{

  },
  watch:{
    
  }
}
</script>

<template>
  <div class="Hold">
    <p v-if="hold.type == 'none'"></p>
    <p v-else>{{ hold.type }} </p>
  </div>
</template>

<style lang="scss" scoped>
.Hold{
    width:4rem;
    height: 4rem;
    border: 1px rgb(162, 162, 162) solid;
    padding: 10px 10px;
    p{
      
    }
}
</style>
