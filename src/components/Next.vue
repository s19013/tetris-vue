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
    width: 6rem;
    ul{
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0;
        margin: 0;
    }
    li{
        grid-column: 2 / 3;
        list-style:none;
        width: 100%;
        padding: 0.8rem;
        border: 1px rgb(162, 162, 162) solid;

        text-align:center;
        align-items: center;
        justify-content: center;
    }
    .Big{
        font-size: 4rem;
        grid-column: 1 / 3;
        padding:0;
        // padding: 1rem 3rem;
    }
}
</style>
