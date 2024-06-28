<template>
  <div
    :class="['cell', cellClass]"
    @click="placeDisk"
  ></div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '~/store/gameStore';

const props = defineProps({
  row: Number,
  col: Number,
  value: String,
});

const gameStore = useGameStore();

const cellClass = computed(() => {
  if (props.value === 'black') return 'bg-black';
  if (props.value === 'white') return 'bg-white';
  return 'bg-green-500';
});

const placeDisk = () => {
  gameStore.placeDisk(props.row, props.col);
};
</script>

<style scoped>
.cell {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  cursor: pointer;
}

.cell.white {
  background-color: white;
}

.cell.black {
  background-color: black;
}
</style>