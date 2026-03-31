import { useOrderBookStore } from "../stores/orderbook";
import type { TradeMessage } from "../types/orderbook";

const WS_URL = "wss://ws.btse.com/ws/futures";
const TOPIC = "tradeHistoryApi:BTCPFC";

export function useLastPriceWS() {
  const store = useOrderBookStore();
  let ws: WebSocket | null = null;

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws?.send(JSON.stringify({ op: "subscribe", args: [TOPIC] }));
    };

    ws.onmessage = (event) => {
      const msg: TradeMessage = JSON.parse(event.data);
      if (!msg?.data?.length) return;

      store.setLastPrice(String(msg.data[0].price));
    };

    ws.onclose = () => {
      ws = null;
    };
  }

  function disconnect() {
    ws?.send(JSON.stringify({ op: "unsubscribe", args: [TOPIC] }));
    ws?.close();
    ws = null;
  }

  return { connect, disconnect };
}
