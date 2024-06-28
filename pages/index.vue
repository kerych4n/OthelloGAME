<template>
  <div class="container">
    <h1 class="text-center text-2xl my-4">Othello Game</h1>
    <div v-if="!gameStarted" class="user-input">
      <label>
        黒のプレイヤー名:
        <input v-model="playerNames.black" />
      </label>
      <label>
        白のプレイヤー名:
        <input v-model="playerNames.white" />
      </label>
      <button @click="startGame" class="start-button">ゲーム開始</button>
    </div>
    <div v-else>
      <div class="score-board">
        <div>黒: {{ blackScore }}</div>
        <div>白: {{ whiteScore }}</div>
      </div>
      <Board :key="boardKey" @update-score="updateScore" ref="boardComponent" :pass-turn="passTurnFlag" :player-names="playerNames" />
      <div class="button-group">
        <button @click="resetBoard" class="reset-button">リセット</button>
        <button @click="passTurn" class="pass-button">パス</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Board from '~/components/Board.vue';

const gameStarted = ref(false);
const boardKey = ref(0);
const blackScore = ref(2);
const whiteScore = ref(2);
const currentPlayer = ref('B');
const passTurnFlag = ref(false);
const boardComponent = ref(null);
const playerNames = ref({ black: '', white: '' });

const startGame = () => {
  gameStarted.value = true;
};

const resetBoard = () => {
  gameStarted.value = false;
  boardKey.value += 1;
  blackScore.value = 2;
  whiteScore.value = 2;
  currentPlayer.value = 'B';
};

const updateScore = (black, white) => {
  blackScore.value = black;
  whiteScore.value = white;
};

const passTurn = () => {
  currentPlayer.value = currentPlayer.value === 'B' ? 'W' : 'B';
  passTurnFlag.value = !passTurnFlag.value; // パスイベントをトリガーするためにフラグをトグル
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  padding-top: 20px;
}

.user-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.score-board {
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.reset-button,
.pass-button,
.start-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.reset-button:hover,
.pass-button:hover,
.start-button:hover {
  background-color: #45a049;
}
</style>
