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
        type:String,
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
    <p>HOLD</p>
    <p class="tetrimino" v-if="hold== 'none'"></p>
    <p class="tetrimino" v-else>{{ hold }} </p>
  </div>
</template>

<style lang="scss" scoped>
.Hold{
    width: fit-content;
    p{text-align: center;}
    .tetrimino{
      width:4rem;
      height: 4rem;
      border: 1px rgb(162, 162, 162) solid;
      padding: 10px 10px;
    }
}
</style>
