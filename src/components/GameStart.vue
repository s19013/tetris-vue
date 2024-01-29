<script>
export default {
  data() {
    return {
      countDownId: 0,
      countDownTime: 1500, //ms
      flag: true
    }
  },
  methods: {
    gameStart() {
      this.flag = false
      this.$emit('gameStart')
    },
    countDown() {
      this.countDownId = setInterval(() => {
        if (this.countDownTime === 0) {
          clearInterval(this.countDownId)
          this.gameStart()
        }
        this.countDownTime -= 100 //ms
      }, 100)
    }
  },
  mounted() {
    this.countDown()
  }
}
</script>

<template>
  <div class="GameStart" v-if="flag">
    <div class="container">
      <p v-if="this.countDownTime > 100">Ready...</p>
      <p v-if="this.countDownTime <= 100">Go!</p>
      <div class="progBar">
        <div class="bar"></div>
      </div>
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
  .container {
    p {
      font-size: 5rem;
      margin-top: 30vh;
    }
  }
}

.progBar {
  width: 50%;
  height: 50px;
  background-color: #ececec;
  position: relative;
  margin-left: 25%;
  border-radius: 10px;
  overflow: hidden;
  .bar {
    position: absolute;
    height: 100%;
    background-color: #ffca28;
    animation-name: progress;
    animation-duration: 1.4s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
}

@keyframes progress {
  0% {
    width: 0;
  }
  95% {
    width: 100%;
  }
  100% {
    width: 100%;
  }
}
</style>
