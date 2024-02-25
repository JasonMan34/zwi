<template>
  <div id="minesweeper-wrapper" dir="ltr">
    <!-- <div class="flex flex-row justify-center px-4 space-x-3"> -->
    <!-- Options -->
    <div class="ms-options">
      <div>
        <input id="showIndexesCheckbox" v-model="showIndexes" class="ms-checkbox" type="checkbox" />
        <label class="inline-block" for="showIndexesCheckbox"> Show indexes </label>
      </div>

      <div>
        <input
          id="autoPlayerShouldGuessCheckbox"
          v-model="autoPlaySafe"
          class="ms-checkbox"
          type="checkbox"
        />
        <label class="inline-block" for="autoPlayerShouldGuessCheckbox">
          Only play safe moves
        </label>
      </div>
      <div v-if="!autoPlaySafe">
        <input
          id="restartOnFailureCheckbox"
          v-model="restartOnFailure"
          class="ms-checkbox"
          type="checkbox"
        />
        <label class="inline-block" for="restartOnFailureCheckbox"> Restart on failure </label>
      </div>
      <div style="margin-bottom: 1rem">
        <label class="player-speed-label" for="playerSpeed"> Player speed </label>
        <input class="player-speed" v-model="playerSpeed" type="number" max="10" min="1" />
      </div>

      <button class="auto-play-button" @click="autoPlay">Auto play</button>
    </div>

    <!-- Minesweeper -->
    <div class="ms-container" @contextmenu="$event.preventDefault()">
      <span>{{ game.isGameWon ? 'You win! 🥳🥳🥳' : '' }}</span>
      <!-- Top border -->
      <div class="ms-top-border">
        <div class="ms-border-corner ms-border-top-left" />
        <div class="ms-border-horizontal" />
        <div class="ms-border-corner ms-border-top-right" />
      </div>

      <!-- scoreboard -->
      <div class="ms-scoreboard">
        <div class="ms-border-vertical" />

        <div class="ms-score">
          <div :class="getDigitClass(game.minesLeft, 0)" />
          <div :class="getDigitClass(game.minesLeft, 1)" />
          <div :class="getDigitClass(game.minesLeft, 2)" />
        </div>

        <div class="ms-new-game-wrapper" @click="newGame">
          <button :class="smileyClass" />
        </div>

        <div class="ms-score">
          <div :class="getDigitClass(time, 0)" />
          <div :class="getDigitClass(time, 1)" />
          <div :class="getDigitClass(time, 2)" />
        </div>

        <div class="ms-border-vertical self-stretch" />
      </div>

      <!-- Middle border -->
      <div class="flex flex-row">
        <div class="ms-border-corner ms-border-middle-left" />
        <div class="flex-1 ms-border-horizontal" />
        <div class="ms-border-corner ms-border-middle-right" />
      </div>

      <div class="flex flex-row">
        <div class="ms-border-vertical" />

        <div class="ms-inner">
          <MinesweeperBoard :game="game!" />
        </div>

        <div class="ms-border-vertical" />
      </div>

      <!-- Bottom border -->
      <div class="flex flex-row">
        <div class="ms-border-corner ms-border-bottom-left" />
        <div class="flex-1 ms-border-horizontal" />
        <div class="ms-border-corner ms-border-bottom-right" />
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
/* eslint-disable no-await-in-loop */
import './minesweeper.pcss';
import { computed, defineComponent, provide, Ref, ref, watch } from 'vue';
import useStopwatch from './use-stopwatch';
import MinesweeperBoard from './MinesweeperBoard.vue';
import { MinesweeperGame } from './game/minesweeper-game';
import { AutoPlayer } from './game/auto-player';
import { ShowIndexesKey } from './keys';
import { sleep } from './game/utils';

const HEIGHT = 16;
const WIDTH = 30;
const MINE_COUNT = 99;

export default defineComponent({
  name: 'Minesweeper',
  components: { MinesweeperBoard },
  setup() {
    const isSandbox = window.location.pathname.includes('sandbox');

    const showIndexes = ref(false);
    const autoPlaySafe = ref(false);
    const restartOnFailure = ref(true);
    const playerSpeed = ref(10);
    const autoPlayerDelay = computed(() => Math.max(10, 100 / playerSpeed.value));

    provide(ShowIndexesKey, showIndexes);
    const { time, start, stop } = useStopwatch();
    const game = ref(
      new MinesweeperGame(WIDTH, HEIGHT, MINE_COUNT, isSandbox),
    ) as Ref<MinesweeperGame>;
    const player = ref(new AutoPlayer(game.value, !autoPlaySafe.value)) as Ref<AutoPlayer>;

    game.value.onGameInit(start);
    game.value.onGameLose(stop);
    game.value.onGameWin(stop);

    const newGame = () => {
      game.value = new MinesweeperGame(WIDTH, HEIGHT, MINE_COUNT, isSandbox);
      player.value = new AutoPlayer(game.value, !autoPlaySafe.value);

      game.value.onGameInit(start);
      game.value.onGameLose(stop);
      game.value.onGameWin(stop);
    };

    watch(autoPlaySafe, () => {
      player.value.shouldGuess = !autoPlaySafe.value;
    });

    watch(autoPlayerDelay, () => {
      player.value.delay = autoPlayerDelay.value;
    });

    const autoPlay = async () => {
      if (game.value.isGameLost) {
        newGame();
      }

      player.value.autoPlay(autoPlayerDelay.value);

      while (restartOnFailure.value && !game.value.isGameWon) {
        await game.value.waitForEnd();
        if (!autoPlaySafe.value && restartOnFailure.value && game.value.isGameLost) {
          await sleep(200);
          newGame();
          player.value.autoPlay(autoPlayerDelay.value);
        }
      }
    };

    newGame();

    const getDigitClass = (value: number, index: number) =>
      `ms-digit ms-digit-${value.toString().padStart(3, '0')[index]}`;

    const smileyClass = computed(() => {
      if (game.value.isGameWon) return 'ms-face ms-face-won';
      if (game.value.isGameLost) return 'ms-face ms-face-lost';

      return 'ms-face ms-face-neutral';
    });

    const assets = [
      'border_hor_2x.png',
      'border_middle_left_2x.png',
      'border_middle_right_2x.png',
      'border_vert_2x.png',
      'corner_bottom_left_2x.png',
      'corner_bottom_right_2x.png',
      'corner_up_left_2x.png',
      'corner_up_right_2x.png',
      'd0.svg',
      'd1.svg',
      'd2.svg',
      'd3.svg',
      'd4.svg',
      'd5.svg',
      'd6.svg',
      'd7.svg',
      'd8.svg',
      'd9.svg',
      'face_active.svg',
      'face_lost.svg',
      'face_neutral.svg',
      'face_pressed.svg',
      'face_won.svg',
      'flag_wrong.svg',
      'flag.svg',
      'hidden.svg',
      'logo.png',
      'mine_red.svg',
      'mine.svg',
      'nums_background.svg',
      'pressed.svg',
      'type0.svg',
      'type1.svg',
      'type2.svg',
      'type3.svg',
      'type4.svg',
      'type5.svg',
      'type6.svg',
      'type7.svg',
      'type8.svg',
    ];

    return {
      assets,
      game,
      time,
      newGame,
      autoPlay,
      showIndexes,
      autoPlaySafe,
      playerSpeed,
      restartOnFailure,
      getDigitClass,
      smileyClass,
    };
  },
});
</script>
