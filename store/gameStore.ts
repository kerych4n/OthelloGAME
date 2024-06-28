import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    currentPlayer: 'black',
  }),
  actions: {
    placeDisk(row: number, col: number) {
      if (this.board[row][col] === null) {
        this.board[row][col] = this.currentPlayer;
        this.switchPlayer();
      }
    },
    switchPlayer() {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    },
  },
});