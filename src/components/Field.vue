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
    field: {
      type: Object
    }
  },
  methods: {},
  watch: {}
}
</script>

<template>
  <div class="Field">
    <ul v-for="y in field.status.length" :key="y">
      <!-- 横の列を表示 配列を並べていってる -->
      <!-- 一意にするためにindexを使ってる -->
      <template v-for="(block, index) in field.status[y - 1 + effectiveRoof]" :key="index">
        <li
          :class="{
            fill: block == true,
            lined: field.rowStatus[y - 1 + effectiveRoof] == width
          }"
        ></li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.Field {
  width: fit-content;
  height: fit-content; // 中身に幅をあわせる
  border: 1px black solid;
  z-index: 1;
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
.fill {
  background-color: aquamarine;
}

.lined {
  background-color: rgb(251, 255, 140);
}
</style>
