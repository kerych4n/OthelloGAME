<template>
  <div class="board-container">
    <div class="info">
      <h2>現在のプレイヤー: {{ currentPlayerName }}</h2>
      <div class="player-names">
        <label>
          黒のプレイヤー:
          <input v-model="playerNames.black" @change="savePlayerNames" />
        </label>
        <label>
          白のプレイヤー:
          <input v-model="playerNames.white" @change="savePlayerNames" />
        </label>
      </div>
    </div>
    <div class="board">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" 
             class="cell" 
             :class="{ 'white': cell === 'W', 'black': cell === 'B', 'valid-move': isValidMove(rowIndex, colIndex) }"
             @click="placeStone(rowIndex, colIndex)">
          <div class="stone" :class="{ 'white': cell === 'W', 'black': cell === 'B' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, defineEmits, defineProps, watch } from 'vue';

const emit = defineEmits(['update-score', 'player-pass']);
const props = defineProps({
  passTurn: Boolean
});

const board = ref([]);
const currentPlayer = ref('B');
const scores = ref({ black: 0, white: 0 });
const playerNames = ref({ black: '黒', white: '白' });
const currentPlayerName = ref(playerNames.value.black);

const savePlayerNames = () => {
  currentPlayerName.value = currentPlayer.value === 'B' ? playerNames.value.black : playerNames.value.white;
};

const calculateScore = () => {
  let black = 0;
  let white = 0;
  
  board.value.forEach(row => {
    row.forEach(cell => {
      if (cell === 'B') black++;
      if (cell === 'W') white++;
    });
  });
  
  scores.value = { black, white };
  emit('update-score', black, white);
};

onMounted(() => {
  initBoard();
  savePlayerNames();
});

watchEffect(() => {
  calculateScore();
});

watch(() => props.passTurn, () => {
  currentPlayer.value = currentPlayer.value === 'B' ? 'W' : 'B';
  currentPlayerName.value = currentPlayer.value === 'B' ? playerNames.value.black : playerNames.value.white;
  emit('update-score', scores.value.black, scores.value.white);
});

const initBoard = () => {
  board.value = Array.from({ length: 8 }, () => Array(8).fill(''));
  
  board.value[3][3] = 'W';
  board.value[3][4] = 'B';
  board.value[4][3] = 'B';
  board.value[4][4] = 'W';
  
  currentPlayer.value = 'B';
  savePlayerNames();
};

const placeStone = (row, col) => {
  if (isValidMove(row, col)) {
    board.value[row][col] = currentPlayer.value;
    flipStones(row, col);
    currentPlayer.value = currentPlayer.value === 'B' ? 'W' : 'B';
    currentPlayerName.value = currentPlayer.value === 'B' ? playerNames.value.black : playerNames.value.white;
    calculateScore();
  }
};

const isValidMove = (row, col) => {
  if (board.value[row][col] !== '') {
    return false;
  }

  const playerColor = currentPlayer.value;
  const opponentColor = playerColor === 'B' ? 'W' : 'B';

  const directions = [
    { row: -1, col: 0 },   // 上
    { row: 1, col: 0 },    // 下
    { row: 0, col: -1 },   // 左
    { row: 0, col: 1 },    // 右
    { row: -1, col: -1 },  // 左上
    { row: -1, col: 1 },   // 右上
    { row: 1, col: -1 },   // 左下
    { row: 1, col: 1 }     // 右下
  ];

  let valid = false;

  directions.forEach(dir => {
    let r = row + dir.row;
    let c = col + dir.col;
    let foundOpponent = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === opponentColor) {
      r += dir.row;
      c += dir.col;
      foundOpponent = true;
    }

    if (foundOpponent && r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === playerColor) {
      valid = true;
    }
  });

  return valid;
};

const flipStones = (row, col) => {
  const playerColor = currentPlayer.value;
  const opponentColor = playerColor === 'B' ? 'W' : 'B';
  
  const directions = [
    { row: -1, col: 0 },   
    { row: 1, col: 0 },    
    { row: 0, col: -1 },   
    { row: 0, col: 1 },    
    { row: -1, col: -1 },  
    { row: -1, col: 1 },   
    { row: 1, col: -1 },   
    { row: 1, col: 1 }     
  ];

  directions.forEach(dir => {
    let r = row + dir.row;
    let c = col + dir.col;
    let cellsToFlip = [];
    
    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === opponentColor) {
      cellsToFlip.push({ row: r, col: c });
      r += dir.row;
      c += dir.col;
    }
    
    if (r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === playerColor) {
      cellsToFlip.forEach(cell => {
        board.value[cell.row][cell.col] = playerColor;
      });
    }
  });
};

const resetBoard = () => {
  initBoard();
  calculateScore();
};
</script>

<style scoped>
.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info {
  margin-bottom: 20px;
}

.player-names {
  margin-bottom: 10px;
}

.board {
  display: grid;
  grid-template-rows: repeat(8, 50px);
  gap: 2px;
  background-color: green;
}

.row {
  display: flex;
}

.cell {
  width: 50px;
  height: 50px;
  border: 1px solid #000000;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stone {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

.stone.white {
  background-color: white;
}

.stone.black {
  background-color: black;
}

.cell.valid-move {
  background-color: rgb(213, 222, 252);
}

.reset-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.reset-button:hover {
  background-color: #45a049;
}
</style>
