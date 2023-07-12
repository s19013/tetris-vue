<script>
export default{
  components:{

  },
  data() {
    return {
      
    }
  },
  props:{
    field:{
        type:Array
    }
  },
  methods:{

  },
  watch:{
    
  }
}
</script>

<template>
  <div class="Field">
    <ul v-for="(len,index) in field" :key="index">
        <template v-for="(block,index) in len" :key="index">
            <li :class="{'fill' : block.isFill == true,'moving':block.isMoving == true}"> </li>
        </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.Field{
    border: 1px black solid;
    width: fit-content; // 中身に幅をあわせる
}
ul{
    display: flex;
    padding: 0;
    margin: 0;
}
li{
  list-style:none;
  display: flex;
  padding: 10px 10px;
  border: 1px rgb(162, 162, 162) solid;
}
.fill{
    background-color: aquamarine;
}
.moving {
  background-color: rgb(255, 163, 127);
}
</style>
