<script>
export default {
  components: {},
  data() {
    return {}
  },
  props: {
    field: {
      type: Array
    }
  },
  methods: {},
  watch: {}
}
</script>

<template>
  <div class="Field">
    <ul v-for="index in field.length" :key="index">
      <template v-for="(block, index) in field[index + 9]" :key="index">
        <li
          :class="{
            fill: block.isFill == true,
            moving: block.isMoving == true,
            ghost: block.ghost == true,
            lined: block.lined == true
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
.ghost {
  background-color: rgb(255, 203, 183);
}
.moving {
  background-color: rgb(255, 163, 127);
}

.lined {
  background-color: rgb(251, 255, 140);
}
</style>
