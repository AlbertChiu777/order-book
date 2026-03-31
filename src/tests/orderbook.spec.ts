import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useOrderBookStore } from "../stores/orderbook";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("applySnapshot", () => {
  it("正確設定 bids 和 asks", () => {
    const store = useOrderBookStore();
    store.applySnapshot(
      [
        ["100", "10"],
        ["90", "5"],
      ],
      [
        ["110", "3"],
        ["120", "7"],
      ],
      1,
    );
    expect(store.bids.get("100")).toBe("10");
    expect(store.asks.get("110")).toBe("3");
  });

  it("seqNum 正確更新", () => {
    const store = useOrderBookStore();
    store.applySnapshot([], [], 42);
    expect(store.seqNum).toBe(42);
  });
});

describe("applyDeltaBatch", () => {
  it("新增和更新 entry", () => {
    const store = useOrderBookStore();
    store.applySnapshot([["100", "10"]], [], 1);
    store.applyDeltaBatch(
      [
        ["100", "20"],
        ["90", "5"],
      ],
      [],
    );
    expect(store.bids.get("100")).toBe("20");
    expect(store.bids.get("90")).toBe("5");
  });

  it("size 為 0 時刪除 entry", () => {
    const store = useOrderBookStore();
    store.applySnapshot([["100", "10"]], [], 1);
    store.applyDeltaBatch([["100", "0"]], []);
    expect(store.bids.has("100")).toBe(false);
  });
});

describe("setLastPrice", () => {
  it("更新 lastPrice 並保留 prevLastPrice", () => {
    const store = useOrderBookStore();
    store.setLastPrice("21000");
    store.setLastPrice("21500");
    expect(store.lastPrice).toBe("21500");
    expect(store.prevLastPrice).toBe("21000");
  });
});
