import { useOrderBookStore } from "../stores/orderbook";
import type { TradeMessage } from "../types/orderbook";
import { useManagedWebSocket } from "./useManagedWebSocket";

const WS_URL = "wss://ws.btse.com/ws/futures";
const TOPIC = "tradeHistoryApi:BTCPFC";

export function useLastPriceWS() {
  const store = useOrderBookStore();

  const client = useManagedWebSocket<TradeMessage>({
    url: WS_URL,
    subscribeMessage: { op: "subscribe", args: [TOPIC] },
    unsubscribeMessage: { op: "unsubscribe", args: [TOPIC] },
    onMessage: (msg) => {
      if (!msg?.data?.length) return;
      store.setLastPrice(String(msg.data[0].price));
    },
  });

  return {
    status: client.status,
    reconnectAttempts: client.reconnectAttempts,
    connect: client.connect,
    disconnect: client.disconnect,
  };
}
