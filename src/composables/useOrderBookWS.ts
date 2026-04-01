import { useOrderBookStore } from "../stores/orderbook";
import type { OrderBookMessage } from "../types/orderbook";
import { useManagedWebSocket } from "./useManagedWebSocket";

const WS_URL = "wss://ws.btse.com/ws/oss/futures";
const TOPIC = "update:BTCPFC";

export function useOrderBookWS() {
  const store = useOrderBookStore();
  let currentSeqNum = 0;

  const client = useManagedWebSocket<OrderBookMessage>({
    url: WS_URL,
    subscribeMessage: { op: "subscribe", args: [TOPIC] },
    unsubscribeMessage: { op: "unsubscribe", args: [TOPIC] },
    onOpen: () => {
      currentSeqNum = 0;
    },
    onMessage: (msg) => {
      if (!msg?.data) return;

      const { type, bids, asks, seqNum, prevSeqNum } = msg.data;

      if (type === "snapshot") {
        store.applySnapshot(bids, asks, seqNum);
        currentSeqNum = seqNum;
        return;
      }

      if (type === "delta") {
        if (prevSeqNum !== currentSeqNum) {
          currentSeqNum = 0;
          client.reconnectNow();
          return;
        }

        currentSeqNum = seqNum;
        store.applyDeltaBatch(bids, asks);
      }
    },
  });

  return {
    status: client.status,
    reconnectAttempts: client.reconnectAttempts,
    connect: client.connect,
    disconnect: client.disconnect,
  };
}
