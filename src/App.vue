<template>
  <div id="app">
    <GameBoard />
  </div>
</template>

<script setup lang="ts">
import GameBoard from './components/GameBoard.vue';
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

#app {
  width: 100%;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &.btn-primary {
    background: #4A90E2;
    color: white;

    &:hover {
      background: #357ABD;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
    }
  }

  &.btn-secondary {
    background: #7ED321;
    color: white;

    &:hover {
      background: #6BB91C;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(126, 211, 33, 0.4);
    }
  }
}
</style>
