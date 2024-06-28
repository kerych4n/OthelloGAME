<template>
  <div class="container">
    <h1 class="text-center text-2xl my-4">Othello Game</h1>
    <div v-if="!gameStarted" class="flex flex-col items-center">
      <div class="player-names flex flex-col gap-4 mb-4">
        <label class="flex flex-col">
          プレイヤー1:
          <input v-model="playerNames.player1" class="border border-gray-300 p-2 rounded" />
        </label>
        <label class="flex flex-col">
          プレイヤー2:
          <input v-model="playerNames.player2" class="border border-gray-300 p-2 rounded" />
        </label>
      </div>
      <button @click="startGame" class="start-button">ゲーム開始</button>
    </div>
    <div v-else class="flex flex-col items-center">
      <div class="score-board flex justify-around items-center w-64 p-4 mb-4 bg-white shadow-md rounded-lg">
        <div class="score black flex flex-col items-center">
          <span class="text-lg font-bold text-black">{{ blackPlayerName }}</span>
          <span class="text-xl">{{ blackScore }}</span>
        </div>
        <div class="score white flex flex-col items-center">
          <span class="text-lg font-bold text-white">{{ whitePlayerName }}</span>
          <span class="text-xl">{{ whiteScore }}</span>
        </div>
      </div>
      <Board :key="boardKey" :playerNames="playerNames" @update-score="updateScore" ref="boardRef" />
      <div class="button-container flex gap-4 mt-4">
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
const playerNames = ref({ player1: '', player2: '' });
const boardKey = ref(0);
const blackScore = ref(2);
const whiteScore = ref(2);
const boardRef = ref(null);
const blackPlayerName = ref('');
const whitePlayerName = ref('');

const startGame = () => {
  if (playerNames.value.player1 && playerNames.value.player2) {
    gameStarted.value = true;
    assignColors();
  } else {
    alert("両方のプレイヤー名を入力してください");
  }
};

const assignColors = () => {
  const random = Math.random();
  if (random < 0.5) {
    blackPlayerName.value = playerNames.value.player1;
    whitePlayerName.value = playerNames.value.player2;
  } else {
    blackPlayerName.value = playerNames.value.player2;
    whitePlayerName.value = playerNames.value.player1;
  }
  alert(`${blackPlayerName.value}さんは黒、${whitePlayerName.value}さんは白です`);
};

const resetBoard = () => {
  boardKey.value += 1;
  blackScore.value = 2;
  whiteScore.value = 2;
  gameStarted.value = false;
  playerNames.value = { player1: '', player2: '' };
};

const updateScore = (black, white) => {
  blackScore.value = black;
  whiteScore.value = white;
};

const passTurn = () => {
  boardRef.value.passTurn();
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
  background-color: #f9fafb;
}

.score-board {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-button, .reset-button, .pass-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;
}

.start-button:hover, .reset-button:hover, .pass-button:hover {
  background-color: #45a049;
}
</style>
