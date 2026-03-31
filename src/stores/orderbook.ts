import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { calcAccumulative } from "../utils/calcAccumulative";
import type { QuoteRowWithMeta } from "../types/orderbook";

export const useOrderBookStore = defineStore("orderBook", () => {
  const bids = ref<Map<string, string>>(new Map());
  const asks = ref<Map<string, string>>(new Map());
  const lastPrice = ref<string>("");
  const prevLastPrice = ref<string>("");
  const seqNum = ref<number>(0);

  const knownBidPrices = new Set<string>();
  const knownAskPrices = new Set<string>();

  const newBidPrices = ref<Set<string>>(new Set());
  const newAskPrices = ref<Set<string>>(new Set());

  const sortedAsks = computed<QuoteRowWithMeta[]>(() => {
    const entries = Array.from(asks.value.entries())
      .map(([price, size]) => ({ price, size }))
      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      .slice(-8);

    const rows = calcAccumulative(entries, "sell");
    return rows.map((row) => ({
      ...row,
      isNew: newAskPrices.value.has(row.price),
    }));
  });

  const sortedBids = computed<QuoteRowWithMeta[]>(() => {
    const entries = Array.from(bids.value.entries())
      .map(([price, size]) => ({ price, size }))
      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      .slice(0, 8);

    const rows = calcAccumulative(entries, "buy");
    return rows.map((row) => ({
      ...row,
      isNew: newBidPrices.value.has(row.price),
    }));
  });

  function applySnapshot(
    newBids: [string, string][],
    newAsks: [string, string][],
    seq: number,
  ) {
    bids.value = new Map(newBids);
    asks.value = new Map(newAsks);
    seqNum.value = seq;
    newBids.forEach(([price]) => knownBidPrices.add(price));
    newAsks.forEach(([price]) => knownAskPrices.add(price));
    newBidPrices.value.clear();
    newAskPrices.value.clear();
  }

  function applyDeltaBatch(
    newBids: [string, string][],
    newAsks: [string, string][],
  ) {
    newBidPrices.value = new Set();
    newAskPrices.value = new Set();

    for (const [price, size] of newBids) {
      if (size === "0") {
        bids.value.delete(price);
      } else {
        if (!knownBidPrices.has(price)) {
          newBidPrices.value.add(price);
          knownBidPrices.add(price);
        }
        bids.value.set(price, size);
      }
    }

    for (const [price, size] of newAsks) {
      if (size === "0") {
        asks.value.delete(price);
      } else {
        if (!knownAskPrices.has(price)) {
          newAskPrices.value.add(price);
          knownAskPrices.add(price);
        }
        asks.value.set(price, size);
      }
    }
  }

  function setLastPrice(price: string) {
    prevLastPrice.value = lastPrice.value;
    lastPrice.value = price;
  }

  return {
    bids,
    asks,
    lastPrice,
    prevLastPrice,
    seqNum,
    sortedAsks,
    sortedBids,
    applySnapshot,
    applyDeltaBatch,
    setLastPrice,
  };
});
