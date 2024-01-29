<script>
export default {
  data() {
    return {
      flag: true
    }
  },
  methods: {
    gameStart() {
      this.flag = false
      this.$emit('gameStart')
    }
  }
}
</script>

<template>
  <div class="GameStart" v-if="flag">
    <div class="contaner">
      <button @click="gameStart()">始める</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.GameStart {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.506);
  color: aliceblue;
  font-weight: bolder;
  width: 100%;
  height: 100%;
  z-index: 10;
  text-align: center;
  align-items: center;
  justify-content: center;
  .contaner {
    position: fixed;
    top: 40vh;
    left: 45vw;
  }
}
</style>
