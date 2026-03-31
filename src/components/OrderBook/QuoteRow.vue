<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { formatNumber } from "../../utils/formatNumber";
import type { QuoteRowWithMeta } from "../../types/orderbook";
import type { QuoteType } from "../../types/orderbook";

const props = defineProps<{
  quote: QuoteRowWithMeta;
  type: QuoteType;
}>();

const isRowFlashing = ref(false);
const isSizeUp = ref(false);
const isSizeDown = ref(false);

onMounted(() => {
  if (!props.quote.isNew) return;
  isRowFlashing.value = true;
  setTimeout(() => (isRowFlashing.value = false), 500);
});

watch(
  () => props.quote.size,
  (newSize, oldSize) => {
    if (!oldSize) return;
    if (isSizeUp.value || isSizeDown.value) return;

    const isUp = parseInt(newSize) > parseInt(oldSize);
    if (isUp) {
      isSizeUp.value = true;
      setTimeout(() => (isSizeUp.value = false), 500);
    } else {
      isSizeDown.value = true;
      setTimeout(() => (isSizeDown.value = false), 500);
    }
  },
);

const barColor =
  props.type === "sell"
    ? "rgba(255, 90, 90, 0.12)"
    : "rgba(16, 186, 104, 0.12)";
</script>

<template>
  <tr
    class="quote-row"
    :class="{
      'flash-row-sell': isRowFlashing && type === 'sell',
      'flash-row-buy': isRowFlashing && type === 'buy',
    }"
  >
    <td class="price" :class="type === 'sell' ? 'sell' : 'buy'">
      {{ formatNumber(quote.price) }}
    </td>
    <td
      class="size"
      :class="{ 'flash-size-up': isSizeUp, 'flash-size-down': isSizeDown }"
    >
      {{ formatNumber(quote.size) }}
    </td>
    <td
      class="total"
      :style="{
        background: `linear-gradient(to left, ${barColor}
  ${quote.barPercent}%, transparent ${quote.barPercent}%)`,
      }"
    >
      {{ formatNumber(quote.total) }}
    </td>
  </tr>
</template>

<style scoped>
.quote-row {
  cursor: default;
}

.quote-row:hover td {
  background-color: #1e3059;
}

td {
  padding: 3px 8px;
  text-align: right;
  font-size: 13px;
  line-height: 1.6;
  vertical-align: middle;
}

td:first-child {
  text-align: left;
}

.price.sell {
  color: #ff5b5a;
}

.price.buy {
  color: #00b15d;
}

@keyframes flashRowSell {
  from {
    background-color: rgba(255, 91, 90, 0.5);
  }
  to {
    background-color: transparent;
  }
}

@keyframes flashRowBuy {
  from {
    background-color: rgba(0, 177, 93, 0.5);
  }
  to {
    background-color: transparent;
  }
}

@keyframes flashSizeUp {
  from {
    background-color: rgba(0, 177, 93, 0.5);
  }
  to {
    background-color: transparent;
  }
}

@keyframes flashSizeDown {
  from {
    background-color: rgba(255, 91, 90, 0.5);
  }
  to {
    background-color: transparent;
  }
}

.flash-row-sell td {
  animation: flashRowSell 0.5s ease-out;
}

.flash-row-buy td {
  animation: flashRowBuy 0.5s ease-out;
}

.flash-size-up {
  animation: flashSizeUp 0.5s ease-out;
}

.flash-size-down {
  animation: flashSizeDown 0.5s ease-out;
}
</style>
