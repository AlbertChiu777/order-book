<script setup lang="ts">
import OrderBook from "./components/OrderBook/OrderBook.vue";
</script>

<template>
  <div id="app">
    <OrderBook />
  </div>
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
</style>
