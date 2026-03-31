import { useOrderBookStore } from "../stores/orderbook";
import type { OrderBookMessage } from "../types/orderbook";

const WS_URL = "wss://ws.btse.com/ws/oss/futures";
const TOPIC = "update:BTCPFC";
const FLUSH_INTERVAL = 100;

export function useOrderBookWS() {
  const store = useOrderBookStore();
  let ws: WebSocket | null = null;
  let currentSeqNum = 0;
  let flushTimer: ReturnType<typeof setInterval> | null = null;

  const pendingBids = new Map<string, string>();
  const pendingAsks = new Map<string, string>();

  function flush() {
    if (pendingBids.size === 0 && pendingAsks.size === 0) return;
    store.applyDeltaBatch(
      Array.from(pendingBids.entries()) as [string, string][],
      Array.from(pendingAsks.entries()) as [string, string][],
    );
    pendingBids.clear();
    pendingAsks.clear();
  }

  function subscribe() {
    ws?.send(JSON.stringify({ op: "subscribe", args: [TOPIC] }));
  }

  function unsubscribe() {
    ws?.send(JSON.stringify({ op: "unsubscribe", args: [TOPIC] }));
  }

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      subscribe();
      flushTimer = setInterval(flush, FLUSH_INTERVAL);
    };

    ws.onmessage = (event) => {
      const msg: OrderBookMessage = JSON.parse(event.data);
      if (!msg?.data) return;

      const { type, bids, asks, seqNum, prevSeqNum } = msg.data;

      if (type === "snapshot") {
        pendingBids.clear();
        pendingAsks.clear();
        store.applySnapshot(bids, asks, seqNum);
        currentSeqNum = seqNum;
        return;
      }

      if (type === "delta") {
        if (prevSeqNum !== currentSeqNum) {
          unsubscribe();
          subscribe();
          return;
        }
        currentSeqNum = seqNum;

        for (const [price, size] of bids) pendingBids.set(price, size);
        for (const [price, size] of asks) pendingAsks.set(price, size);
      }
    };

    ws.onclose = () => {
      ws = null;
    };
  }

  function disconnect() {
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
    unsubscribe();
    ws?.close();
    ws = null;
  }

  return { connect, disconnect };
}
