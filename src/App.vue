<script>
import Tetris from '@/js/Tetris.js'
import Field from './components/Field.vue'
import Next from './components/Next.vue'
import Hold from './components/Hold.vue'
import Tetrimino from './components/Tetrimino.vue'
import Ghost from './components/Ghost.vue'
import GameStart from './components/GameStart.vue'
import GameEnd from './components/GameEnd.vue'
import FlashMessage from './components/FlashMessage.vue'
import lodash from 'lodash'

export default {
  components: {
    Field,
    Next,
    Hold,
    Tetrimino,
    Ghost,
    GameStart,
    GameEnd,
    FlashMessage
  },
  data() {
    return {
      tetris: new Tetris(),
      field: [],
      next: [],
      tetrimino: [],
      ghost: [],
      reRendIntervalId: 0,
      inPreparation: true,
      TspinType: ''
    }
  },
  methods: {
    keyEvents(event) {
      // _.debounce(,1000)
      // ここで通常のキーボード動作が動かないように釘をさす
      event.preventDefault()

      let code = event.code

      // 動かせない状態(ルール)のときは動かせないようにする
      // ルールを変数に入れようとしたが､一部動的に動くせいで正しく動作しない｡
      // ここでしか使わないのでこの方法を取る
      for (const rule of [this.tetris.isGameOver, this.tetris.sleeping, this.inPreparation]) {
        if (rule) {
          return
        }
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
      this.tetrimino = lodash.cloneDeep(this.tetris.tetrimino.coordinate.status)
      this.ghost = lodash.cloneDeep(this.tetris.ghost.coordinate.status)
    },
    gameStart() {
      this.inPreparation = false
      this.tetris.gameStart()
      // 定期的再描画
      this.reRendIntervalId = setInterval(this.reRender, 100)
    },
    setTspinType(type) {
      this.TspinType = type
    }
  },
  computed: {
    time: function () {
      let m = Math.floor(this.tetris.time / 60)
      let s = this.tetris.time % 60

      return `${m}m ${s}s`
    }
  },
  watch: {},
  beforeMount() {
    this.tetris.init()
    this.reRender()
  },
  mounted() {
    // 関数を渡す時に関数名()とか書かずに関数名のみで書かないと正しくうごいてくれないらしい｡
    this.tetris.score.setCallbacks({
      enableIsTetris: this.$refs.isTetris.showMessage,
      enableIsB2B: this.$refs.isB2B.showMessage,
      enableIsTspin: this.$refs.isTspin.showMessage,
      setTspinType: this.setTspinType
    })
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
        <Hold :hold="this.tetris.hold.holdingTetrimino" />
        <div class="coution">
          <!-- 2秒前になったら警告を出す -->
          <p v-show="this.tetris.ojyama.countDown <= 2000">Danger!!</p>
        </div>
        <p class="Ren" v-show="this.tetris.score.ren > 0">Ren:{{ this.tetris.score.ren }}</p>
        <FlashMessage ref="isTetris" class="isTetris">Tetris!</FlashMessage>
        <FlashMessage ref="isTspin" class="isTspin">
          Tspin <br />
          {{ this.TspinType }}
        </FlashMessage>
        <FlashMessage ref="isB2B" class="isB2B">
          Back <br />
          To <br />
          Back!
        </FlashMessage>
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
            <td>{{ this.tetris.countOfLinesVanished }}</td>
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
      <p v-for="(line, index) in field.status" :key="index">
        {{ index }}
        <template v-for="(block, index) in line" :key="index">
          <template v-if="block">1</template>
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
