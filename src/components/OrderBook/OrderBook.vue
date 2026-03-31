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
    <QuoteTable type="sell" />
    <LastPrice />
    <QuoteTable type="buy" />
  </div>
</template>

<style scoped>
.order-book {
  width: 280px;
  background-color: #131b29;
  color: #f0f4f8;
}
</style>
