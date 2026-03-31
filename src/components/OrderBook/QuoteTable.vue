<script setup lang="ts">
import { computed } from "vue";
import { useOrderBookStore } from "../../stores/orderbook";
import QuoteRow from "./QuoteRow.vue";
import type { QuoteType } from "../../types/orderbook";

const props = defineProps<{
  type: QuoteType;
}>();

const store = useOrderBookStore();

const quotes = computed(() =>
  props.type === "sell" ? store.sortedAsks : store.sortedBids,
);
</script>

<template>
  <table class="quote-table">
    <thead>
      <tr>
        <th>Price (USD)</th>
        <th>Size</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <QuoteRow
        v-for="quote in quotes"
        :key="quote.price"
        :quote="quote"
        :type="type"
      />
    </tbody>
  </table>
</template>

<style scoped>
.quote-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  padding: 4px 8px;
  text-align: right;
  font-size: 12px;
  font-weight: 400;
  color: #8698aa;
}

th:first-child {
  text-align: left;
}
</style>
