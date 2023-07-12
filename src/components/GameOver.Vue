<script>
export default{
  data() {
    return {
      
    }
  },
  props:{
    gameOver:{
        type:Boolean
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
    <p>Game Over</p>
    <button @click="reload()">reTry</button>
  </div>
</template>

<style lang="scss" scoped>
.GameOver{
    position: fixed;
    // top: 40vh;
    // left: 50vh;
    background-color: rgba(0, 0, 0, 0.506);
    width: 100%;
    height: 100%;
    z-index: 10;
    text-align:center;
    align-items: center;
    justify-content: center;
}
</style>
