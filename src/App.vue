<script>
import Tetris from '@/js/Tetris.js'
import Field from './components/Field.vue'
import Next from './components/Next.vue'
import Hold from './components/Hold.vue'
import Tetrimino from './components/Tetrimino.vue'
import Ghost from './components/Ghost.vue'
import GameStart from './components/GameStart.vue'
import GameEnd from './components/GameEnd.vue'
import lodash from 'lodash'

export default {
  components: {
    Field,
    Next,
    Hold,
    Tetrimino,
    Ghost,
    GameStart,
    GameEnd
  },
  data() {
    return {
      tetris: new Tetris(),
      field: [],
      next: [],
      hold: '',
      tetrimino: [],
      ghost: [],
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

      // 動かせない状態(ルール)のときは動かせないようにする
      if (this.tetris.isGameOver || this.tetris.sleeping) {
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
      this.field = lodash.cloneDeep(this.tetris.Field)
      this.next = lodash.cloneDeep(this.tetris.next.list)
      this.hold = this.tetris.hold.holdingTetrimino
      this.tetrimino = lodash.cloneDeep(this.tetris.tetrimino.coordinate.status)
      this.ghost = lodash.cloneDeep(this.tetris.ghost.coordinate.status)
      this.isTetris = this.tetris.score.isTetris
      this.countOfLinesVanished = this.tetris.countOfLinesVanished
      this.timer = this.tetris.time
      this.ojyamaCountDown = this.tetris.ojyama.countDown
    },
    gameStart() {
      this.tetris.gameStart()
      // 定期的再描画
      this.reRendIntervalId = setInterval(this.reRender, 100)
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
    this.tetris.init()
    this.reRender()
  },
  mounted() {
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
    <GameStart @gameStart="gameStart" />
    <GameEnd v-if="this.tetris.isGameOver" :score="this.tetris.score.score" />
    <h1>動きに癖がある非公式テトリス</h1>
    <a href="https://github.com/s19013/tetris-vue">コード</a>
    <div class="game">
      <div class="LeftInfo">
        <Hold :hold="hold" />
        <div class="coution">
          <p v-show="ojyamaCountDown <= 3000">Danger!!</p>
        </div>
        <p class="Ren" v-show="this.tetris.score.ren > 0">Ren:{{ this.tetris.score.ren }}</p>
        <p class="isTetris" v-show="isTetris">Tetris!</p>
      </div>
      <div class="Center">
        <Tetrimino :tetrimino="tetrimino" />
        <Ghost :ghost="ghost" />
        <Field :field="field" />
        <p class="Score">{{ this.tetris.score.score }}</p>
      </div>
      <div class="RightInfo">
        <Next :next="next" />
        <table border="1">
          <tr>
            <td>レベル</td>
            <td>{{ this.tetris.level }}</td>
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
    display: grid;
    grid-template-rows: 10fr 1fr;
    grid-template-columns: 1fr;
    .Tetrimino {
      position: absolute;
      grid-row: 1/2;
    }
    .Ghost {
      position: absolute;
      grid-row: 1/2;
    }
    .Field {
      position: relative;
      grid-row: 1/2;
    }
    p {
      grid-row: 2/3;
    }
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
