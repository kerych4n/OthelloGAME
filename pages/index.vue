<template>
  <div class="container">
    <h1 class="text-center text-2xl my-4">Othello Game</h1>
    <div class="score-board">
      <div>黒: {{ blackScore }}</div>
      <div>白: {{ whiteScore }}</div>
    </div>
    <Board :key="boardKey" @update-score="updateScore" />
    <div class="button-container">
      <button @click="resetBoard" class="reset-button">リセット</button>
      <button @click="passBoard" class="pass-button">パス</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Board from '~/components/Board.vue';

const boardKey = ref(0); // Board コンポーネントのキー
const blackScore = ref(2);
const whiteScore = ref(2);

// リセットボタンをクリックしたときの処理
const resetBoard = () => {
  boardKey.value += 1; // Board コンポーネントのキーを更新して再レンダリングを強制
  blackScore.value = 2;
  whiteScore.value = 2;
};

const updateScore = (black, white) => {
  blackScore.value = black;
  whiteScore.value = white;
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

.score-board {
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.reset-button,
.pass-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.reset-button:hover,
.pass-button:hover {
  background-color: #45a049;
}
</style>