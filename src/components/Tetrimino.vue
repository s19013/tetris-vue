<script>
import { fieldWidth, fieldHeight, effectiveRoof } from '@/js/Config.js'
export default {
  components: {},
  data() {
    return {
      width: fieldWidth,
      effectiveRoof: effectiveRoof,
      hight: fieldHeight - effectiveRoof
    }
  },
  props: {
    tetrimino: {
      type: Object
    }
  },
  methods: {},
  watch: {}
}
</script>

<template>
  <div class="Tetrimino">
    <!-- この場合､x,yは1から始まる -->
    <ul v-for="y in hight" :key="y">
      <template v-for="x in width" :key="x">
        <li
          :class="{
            // pretterが見づらい形に壊す…
            // x,yは1から始める故に変な書き方になる
            moving: tetrimino.some((block) => {
              return block.x === x - 1 && block.y === y + effectiveRoof - 1
            })
          }"
        ></li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.Tetrimino {
  width: fit-content;
  height: fit-content; // 中身に幅をあわせる
  border: 1px black solid;
  z-index: 3;
}
ul {
  display: flex;
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
  display: flex;
  padding: 10px 10px;
  border: 1px rgb(162, 162, 162) solid;
}
.moving {
  background-color: rgb(255, 163, 127);
}
</style>
