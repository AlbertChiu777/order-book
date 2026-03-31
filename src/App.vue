<script setup lang="ts">
import OrderBook from "./components/OrderBook/OrderBook.vue";
</script>

<template>
  <OrderBook />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #131b29;
  color: #f0f4f8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#app {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 0;
}

@media (min-width: 480px) {
  #app {
    align-items: center;
    padding: 0;
  }
}
</style>
