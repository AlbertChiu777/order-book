<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useOrderBookWS } from "../../composables/useOrderBookWS";
import { useLastPriceWS } from "../../composables/useLastPriceWS";
import QuoteTable from "./QuoteTable.vue";
import LastPrice from "./LastPrice.vue";

const orderBookWS = useOrderBookWS();
const lastPriceWS = useLastPriceWS();

onMounted(() => {
  orderBookWS.connect();
  lastPriceWS.connect();
});

onUnmounted(() => {
  orderBookWS.disconnect();
  lastPriceWS.disconnect();
});
</script>

<template>
  <div class="order-book">
    <div class="header">Order Book</div>
    <QuoteTable type="sell" />
    <LastPrice />
    <QuoteTable type="buy" />
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #2a364a;
}
.order-book {
  width: 100%;
  background-color: #131b29;
  color: #f0f4f8;
  padding: 24px;
}

@media (min-width: 480px) {
  .order-book {
    width: 320px;
  }
}
</style>
