<script>
export default {
  data() {
    return {
      showFlag: false,
      timerid: null
    }
  },
  props: {
    timeLimit: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    showMessage() {
      this.showFlag = true
      // 数秒たったら消す
      this.timerid = setTimeout(() => {
        this.showFlag = false
      }, this.timeLimit)
    }
  },
  watch: {}
}
</script>

<template>
  <div class="flashMessage">
    <p v-show="this.showFlag">
      <slot></slot>
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
