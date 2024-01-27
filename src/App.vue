<script>
import Tetris from '@/js/Tetris.js'
import Field from './components/Field.vue'
import Next from './components/Next.vue'
import Hold from './components/Hold.vue'
import Tetrimino from './components/Tetrimino.vue'
import GameEnd from './components/GameEnd.vue'
import lodash from 'lodash'

export default {
  components: {
    Field,
    Next,
    Hold,
    Tetrimino,
    GameEnd
  },
  data() {
    return {
      tetris: new Tetris(),
      field: [],
      next: [],
      hold: '',
      tetrimino: [],
      isGameOver: false,
      sleeping: false,
      score: 0,
      ren: 0,
      level: 0,
      countOfLinesVanished: 0,
      timer: 0,
      ojyamaCountDown: 10,
      isTetris: false,
      reRendIntervalId: 0
    }
  },
  methods: {
    keyEvents(event) {
      // _.debounce(,1000)
      try {
        event.preventDefault()
      } catch (error) {
        console.log()
      }

      let code = event.code

      // ゲームオーバーしてたら動かない
      if (this.isGameOver || this.sleeping) {
        return
      }

      /** 上 */
      if (code == 'ArrowUp' || code == 'KeyW') {
        this.tetris.keyDownUp()
      }

      /** 下 */
      if (code == 'ArrowDown' || code == 'KeyS') {
        this.tetris.keyDownDown()
      }

      /** 左 */
      if (code == 'ArrowLeft' || code == 'KeyA') {
        this.tetris.keyDownLeft()
      }

      /** 右 */
      if (code == 'ArrowRight' || code == 'KeyD') {
        this.tetris.keyDownRight()
      }

      /** L 時計回り */
      if (code == 'KeyL') {
        this.tetris.keyDownL()
      }

      /** J 反時計回り */
      if (code == 'KeyJ') {
        this.tetris.keyDownJ()
      }

      /** スペース ホールド*/
      if (code == 'Space') {
        this.tetris.keyDownSpace()
      }

      // デバック用 インターバルを止める
      // if (code == "KeyQ")  {clearInterval(this.reRendIntervalId)}

      /** フィールドを再描画 */
      this.reRender()
    },
    reRender() {
      this.field = lodash.cloneDeep(this.tetris.Field.status)
      this.next = lodash.cloneDeep(this.tetris.next.list)
      this.hold = this.tetris.hold.holdingTetrimino
      this.tetrimino = lodash.cloneDeep(this.tetris.tetrimino.coordinate.status)
      this.isGameOver = this.tetris.isGameOver
      this.sleeping = this.tetris.sleeping
      this.score = this.tetris.score.score
      this.ren = this.tetris.score.ren
      this.isTetris = this.tetris.score.isTetris
      this.level = this.tetris.level
      this.countOfLinesVanished = this.tetris.countOfLinesVanished
      this.timer = this.tetris.time
      this.ojyamaCountDown = this.tetris.ojyama.countDown
    }
  },
  computed: {
    time: function () {
      let m = Math.floor(this.timer / 60)
      let s = this.timer % 60

      return `${m}m ${s}s`
    }
  },
  watch: {},
  beforeMount() {
    // タイミングの問題でここ
    // mountedだと遅すぎてエラーになる
    this.reRender()
  },
  mounted() {
    // 定期的再描画
    this.reRendIntervalId = setInterval(this.reRender, 100)
    this.$nextTick(function () {})
    /** キーボード受付 */
    document.addEventListener('keydown', this.keyEvents)
  },
  beforeUnmount() {
    /** キーボードによる動作の削除(副作用みたいエラーがでるため) */
    clearInterval(this.reRendIntervalId)
    document.removeEventListener('keydown', this.keyEvents)
  }
}
</script>

<template>
  <main>
    <GameEnd v-if="isGameOver" :score="score" />
    <h1>動きに癖がある非公式テトリス</h1>
    <a href="https://github.com/s19013/tetris-vue">コード</a>
    <div class="game">
      <div class="LeftInfo">
        <Hold :hold="hold" />
        <div class="coution">
          <p v-show="ojyamaCountDown <= 3000">Danger!!</p>
        </div>
        <p class="Ren" v-show="ren > 0">Ren:{{ ren }}</p>
        <p class="isTetris" v-show="isTetris">Tetris!</p>
      </div>
      <div class="Center">
        <Tetrimino :tetrimino="tetrimino" />
        <Field :field="field" />
        <p class="Score">{{ score }}</p>
      </div>
      <div class="RightInfo">
        <Next :next="next" />
        <table border="1">
          <tr>
            <td>レベル</td>
            <td>{{ level }}</td>
          </tr>
          <tr>
            <td>列数</td>
            <td>{{ countOfLinesVanished }}</td>
          </tr>
          <tr>
            <td>時間</td>
            <td>{{ time }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="controller">
      <button @click="keyEvents({ code: 'KeyJ' })">左回転</button>
      <button @click="keyEvents({})">↑</button>
      <button @click="keyEvents({ code: 'KeyL' })">右回転</button>

      <button @click="keyEvents({ code: 'KeyA' })">←</button>
      <button @click="keyEvents({ code: 'KeyS' })">↓</button>
      <button @click="keyEvents({ code: 'KeyD' })">→</button>

      <button @click="keyEvents({ code: 'Space' })">ホールド</button>
    </div>
    <div class="messages">
      <div class="howToPlay">
        <table border="1">
          <tr>
            <td>WASD 矢印ボタン</td>
            <td>移動</td>
          </tr>
          <tr>
            <td>L</td>
            <td>右回転</td>
          </tr>
          <tr>
            <td>J</td>
            <td>左回転</td>
          </tr>
          <tr>
            <td>Space</td>
            <td>ホールド</td>
          </tr>
        </table>
      </div>
      <div class="Cannot">
        <h2>注意</h2>
        <p>公式といろいろ違う</p>
        <p>回したら大きくずれることがある｡</p>
        <p>たまに回らない</p>
        <p>LJの回しいれが発動する条件が違う(縦に1マスすくない)</p>
        <p>sZを縦に回しいれることができない</p>
        <h2>できないこと(未実装)</h2>
        <p>一部回し入れ</p>
        <p>Back To Back</p>
        <p>Tスピンボーナス</p>
      </div>
    </div>
    <!-- <pre>{{ field }}</pre> -->
    <!-- <div class="deb">
      <p v-for="(line,index) in field" :key = index>
        <template v-for="(block,index) in line" :key = index>
          <template v-if="block.isFill">1</template>
          <template v-else>0</template>
        </template>
      </p>
    </div> -->
  </main>
</template>

<style lang="scss" scoped>
.coution {
  text-align: center;
  min-height: 2rem;
}
.game {
  display: flex;
  gap: 1rem;
  text-align: center;
  justify-content: center;
  .Score {
    text-align: center;
    justify-content: center;
  }
  .LeftInfo {
    .Hold {
      margin-left: auto;
    }
  }
  .Center {
  }
  .RightInfo {
    table {
      margin-top: 1rem;
      width: 10rem;
    }
  }
}
.messages {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  justify-content: center;
  .howToPlay {
    margin-right: 0;
    margin-left: auto;
    td {
      padding: 0.5rem;
    }
  }
}

.controller {
  @media (min-width: 961px) {
    display: none;
  }
  display: grid;
  margin-top: 1rem;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  button {
    padding: 1rem;
  }
  :nth-child(7) {
    grid-column: 1/4;
  }
}
</style>
