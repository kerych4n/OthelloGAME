<template>
  <div class="board-container">
    <div class="info">
      <h2>現在のプレイヤー: {{ currentPlayerName }}</h2>
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
import { ref, onMounted, watchEffect, defineEmits } from 'vue';

// emit を定義
const emit = defineEmits(['update-score']);

const board = ref([]);
const currentPlayer = ref('B');
const scores = ref({ black: 0, white: 0 });
const playerNames = ref({ black: '黒', white: '白' });
const currentPlayerName = ref(playerNames.value.black);

// スコアを計算する関数
const calculateScore = () => {
  let black = 0;
  let white = 0;
  
  board.value.forEach(row => {
    row.forEach(cell => {
      if (cell === 'B') black++;
      if (cell === 'W') white++;
    });
  });
  
  // スコアを更新
  scores.value = { black, white };
  emit('update-score', black, white);
};

// コンポーネントがマウントされたときに初期化を行う
onMounted(() => {
  initBoard();
});

// ボードの状態が変更されたときにスコアを計算
watchEffect(() => {
  calculateScore();
});

const initBoard = () => {
  // 初期化する8x8の空のボードを作成
  board.value = Array.from({ length: 8 }, () => Array(8).fill(''));
  
  // 初期配置の4つの石をセット
  board.value[3][3] = 'W';
  board.value[3][4] = 'B';
  board.value[4][3] = 'B';
  board.value[4][4] = 'W';
  
  currentPlayer.value = 'B'; // ゲーム開始時のプレイヤーを設定
  currentPlayerName.value = playerNames.value.black;
};

const placeStone = (row, col) => {
  if (isValidMove(row, col)) {
    board.value[row][col] = currentPlayer.value;
    flipStones(row, col);
    currentPlayer.value = currentPlayer.value === 'B' ? 'W' : 'B'; // プレイヤーを交代
    currentPlayerName.value = currentPlayer.value === 'B' ? playerNames.value.black : playerNames.value.white;
    calculateScore(); // スコアを計算して更新
  }
};

const isValidMove = (row, col) => {
  if (board.value[row][col] !== '') {
    return false; // すでに石が置かれている場合は無効
  }

  const playerColor = currentPlayer.value;
  const opponentColor = playerColor === 'B' ? 'W' : 'B';

  // 8方向の変化量を定義
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

  // 各方向について挟む処理を行う
  directions.forEach(dir => {
    let r = row + dir.row;
    let c = col + dir.col;
    let foundOpponent = false;

    // 相手の石を挟むまで進む
    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === opponentColor) {
      r += dir.row;
      c += dir.col;
      foundOpponent = true;
    }

    // 挟んだ後に自分の石がある場合は有効
    if (foundOpponent && r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === playerColor) {
      valid = true;
    }
  });

  return valid;
};

const flipStones = (row, col) => {
  const playerColor = currentPlayer.value;
  const opponentColor = playerColor === 'B' ? 'W' : 'B';
  
  // 8方向の変化量を定義
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

  // 各方向について挟む処理を行う
  directions.forEach(dir => {
    let r = row + dir.row;
    let c = col + dir.col;
    let cellsToFlip = [];
    
    // 相手の石を挟むまで進む
    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === opponentColor) {
      cellsToFlip.push({ row: r, col: c });
      r += dir.row;
      c += dir.col;
    }
    
    // 挟んだ相手の石をひっくり返す
    if (r >= 0 && r < 8 && c >= 0 && c < 8 && board.value[r][c] === playerColor) {
      cellsToFlip.forEach(cell => {
        board.value[cell.row][cell.col] = playerColor;
      });
    }
  });
};

const passTurn = () => {
  currentPlayer.value = currentPlayer.value === 'B' ? 'W' : 'B'; // プレイヤーを交代
  currentPlayerName.value = currentPlayer.value === 'B' ? playerNames.value.black : playerNames.value.white;
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
  grid-template-rows: repeat(8, 50px); /* 各行の高さを50pxに設定 */
  gap: 2px;
  background-color: green;
}

.row {
  display: flex;
}

.cell {
  width: 50px; /* セルの幅 */
  height: 50px; /* セルの高さ */
  border: 1px solid #000000;
  box-sizing: border-box; /* ボーダーボックスモデルを適用 */
  cursor: pointer; /* クリック可能なことを示すカーソル */
  position: relative; /* 子要素を配置するために相対配置を設定 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.stone {
  width: 80%; /* 石の幅をセルに対して80%に設定 */
  height: 80%; /* 石の高さをセルに対して80%に設定 */
  border-radius: 50%; /* 石を丸くする */
}

.stone.white {
  background-color: white; /* 白い石 */
}

.stone.black {
  background-color: black; /* 黒い石 */
}

.cell.valid-move {
  background-color: rgb(213, 222, 252); /* 有効な移動場所の背景色 */
}
</style>
