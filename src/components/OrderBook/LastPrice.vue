<script setup lang="ts">
import { computed } from "vue";
import { useOrderBookStore } from "../../stores/orderbook";
import { formatNumber } from "../../utils/formatNumber";

const store = useOrderBookStore();

const priceState = computed(() => {
  const curr = parseFloat(store.lastPrice);
  const prev = parseFloat(store.prevLastPrice);

  if (!prev || curr === prev) return "neutral";
  return curr > prev ? "up" : "down";
});

const textColor = computed(() => {
  if (priceState.value === "up") return "#00b15d";
  if (priceState.value === "down") return "#FF5B5A";
  return "#F0F4F8";
});

const bgColor = computed(() => {
  if (priceState.value === "up") return "rgba(16, 186, 104, 0.12)";
  if (priceState.value === "down") return "rgba(255, 90, 90, 0.12)";
  return "rgba(134, 152, 170, 0.12)";
});
</script>

<template>
  <div
    class="last-price"
    :style="{ color: textColor, backgroundColor: bgColor }"
  >
    <span class="price">{{
      store.lastPrice ? formatNumber(store.lastPrice) : "—"
    }}</span>
    <span v-if="priceState === 'up'" class="arrow">↑</span>
    <span v-if="priceState === 'down'" class="arrow">↓</span>
  </div>
</template>

<style scoped>
.last-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  font-size: 20px;
  font-weight: 600;
  transition:
    background-color 0.3s,
    color 0.3s;
}
</style>
