<script>
export default{
  components:{

  },
  data() {
    return {
      
    }
  },
  props:{
    next:{
        type:Array,
    }
  },
  methods:{

  },
  watch:{
    
  }
}
</script>

<template>
  <div class="Next">
    <ul>
        <!-- v-forはi=1からしか始められないので -->
        <li v-for="i in 5" :key="i" :class="{'Big' : i == 1}"> 
            {{ next[i-1].type }}  
        </li>
        <!-- <li v-for="(block,index) of next" :key="index">
            {{ block.type }}
        </li> -->
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.Next{
    width: fit-content;
    ul{
        padding: 0;
        margin: 0;
        text-align: center;
        align-items: center;
    }
    li{
        list-style:none;
        padding: 10px 10px;
        width:4rem;
        border: 1px rgb(162, 162, 162) solid;
    }
    .Big{
        width: 8rem;
        height: 8rem;
    }
}
</style>
