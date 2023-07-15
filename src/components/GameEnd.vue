<script>
export default{
  data() {
    return {
      
    }
  },
  props:{
    score:{
      type:Number,
      default:0
    }
  },
  methods:{
    reload(){
        console.log("reload");
        location.reload()
    }
  },
}
</script>

<template>
  <div class="GameOver">
    <div class="contaner">
        <p>Game Over</p>
        <p>最終スコア:{{ score }}</p>
        <button @click="reload()">ReTry</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.GameOver{
    position: fixed;
    background-color: rgba(0, 0, 0, 0.506);
    color: aliceblue;
    font-weight: bolder;
    width: 100%;
    height: 100%;
    z-index: 10;
    text-align:center;
    align-items: center;
    justify-content: center;
    .contaner{
        position: fixed;
        top :40vh;
        left:45vw;
    }
}
</style>