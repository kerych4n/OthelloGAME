<template>
  <div class="container">
    <h1 class="text-center text-2xl my-4">Othello Game</h1>
    <div v-if="!gameStarted" class="flex flex-col items-center">
      <div class="player-names flex flex-col gap-4 mb-4">
        <label class="flex flex-col">
          プレイヤー1の名前:
          <input v-model="playerNames.player1" class="border border-gray-300 p-2 rounded" />
        </label>
        <label class="flex flex-col">
          プレイヤー2の名前:
          <input v-model="playerNames.player2" class="border border-gray-300 p-2 rounded" />
        </label>
      </div>
      <button @click="startGame" class="start-button">ゲーム開始</button>
    </div>
    <div v-else class="flex flex-col items-center">
      <div class="score-board flex justify-around items-center w-72 p-4 mb-4 bg-white shadow-md rounded-lg">
        <div class="score black flex flex-col items-center bg-black p-2 rounded">
          <span class="text-lg font-bold text-white">{{ playerNames.black }} (黒)</span>
          <span class="text-xl text-white">{{ blackScore }}</span>
        </div>
        <div class="score white flex flex-col items-center bg-white p-2 rounded">
          <span class="text-lg font-bold text-black">{{ playerNames.white }} (白)</span>
          <span class="text-xl text-black">{{ whiteScore }}</span>
        </div>
      </div>
      <div class="current-player text-center mb-4" :class="currentPlayerColorClass">
        現在のプレイヤー: {{ currentPlayerName }} ({{ currentPlayerColor }})
      </div>
      <Board :key="boardKey" :playerNames="playerNames" @update-score="updateScore" @update-current-player="updateCurrentPlayer" />
      <div class="button-container flex gap-4 mt-4">
        <button @click="resetBoard" class="reset-button">リセット</button>
        <button @click="passTurn" class="pass-button">パス</button>
      </div>
    </div>

    <transition name="modal">
      <div v-if="showColorModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="text-lg font-bold mb-4">あなたの色は{{ playerColor }}</h2>
          <div :class="playerColorClass" class="color-indicator"></div>
          <button @click="closeColorModal" class="start-button mt-4">OK</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Board from '~/components/Board.vue';

const gameStarted = ref(false);
const playerNames = ref({ player1: '', player2: '', black: '', white: '' });
const boardKey = ref(0);
const blackScore = ref(2);
const whiteScore = ref(2);
const currentPlayerName = ref('');
const currentPlayerColor = ref('');
const currentPlayerColorClass = ref('');
const showColorModal = ref(false);
const playerColor = ref('');
const playerColorClass = ref('');

const startGame = () => {
  if (playerNames.value.player1 && playerNames.value.player2) {
    assignColors();
    showColorModal.value = true;
  } else {
    alert("両方のプレイヤー名を入力してください");
  }
};

const assignColors = () => {
  const random = Math.random();
  if (random < 0.5) {
    playerNames.value.black = playerNames.value.player1;
    playerNames.value.white = playerNames.value.player2;
  } else {
    playerNames.value.black = playerNames.value.player2;
    playerNames.value.white = playerNames.value.player1;
  }

  if (playerNames.value.black === playerNames.value.player1) {
    playerColor.value = '黒';
    playerColorClass.value = 'bg-black text-white';
  } else {
    playerColor.value = '白';
    playerColorClass.value = 'bg-white text-black';
  }
};

const resetBoard = () => {
  boardKey.value += 1;
  blackScore.value = 2;
  whiteScore.value = 2;
  gameStarted.value = false;
  playerNames.value = { player1: '', player2: '', black: '', white: '' };
};

const updateScore = (black, white) => {
  blackScore.value = black;
  whiteScore.value = white;
};

const updateCurrentPlayer = (currentPlayer) => {
  currentPlayerName.value = currentPlayer === 'B' ? playerNames.value.black : playerNames.value.white;
  currentPlayerColor.value = currentPlayer === 'B' ? '黒' : '白';
  currentPlayerColorClass.value = currentPlayer === 'B' ? 'bg-black text-white' : 'bg-gray-200 text-black';
};

const passTurn = () => {
  const boardComponent = boardKey.value;
  if (boardComponent && typeof boardComponent.passTurn === 'function') {
    boardComponent.passTurn();
  }
};

const closeColorModal = () => {
  showColorModal.value = false;
  gameStarted.value = true;
  updateCurrentPlayer(); // 初期プレイヤー名と色の表示を更新
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
  width: 300px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #2d3748;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.current-player {
  font-size: 1.25rem;
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
  width: 250px;
  text-align: center;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.color-indicator {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 20px auto;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;
}
</style>
