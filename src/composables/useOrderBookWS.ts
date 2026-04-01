import { useOrderBookStore } from '../stores/orderbook'
import type { OrderBookMessage } from '../types/orderbook'

const WS_URL = 'wss://ws.btse.com/ws/oss/futures'
const TOPIC = 'update:BTCPFC'

export function useOrderBookWS() {
  const store = useOrderBookStore()
  let ws: WebSocket | null = null
  let currentSeqNum = 0

  function subscribe() {
    ws?.send(JSON.stringify({ op: 'subscribe', args: [TOPIC] }))
  }

  function unsubscribe() {
    ws?.send(JSON.stringify({ op: 'unsubscribe', args: [TOPIC] }))
  }

  function connect() {
    ws = new WebSocket(WS_URL)

    ws.onopen = () => subscribe()

    ws.onmessage = (event) => {
      const msg: OrderBookMessage = JSON.parse(event.data)
      if (!msg?.data) return

      const { type, bids, asks, seqNum, prevSeqNum } = msg.data

      if (type === 'snapshot') {
        store.applySnapshot(bids, asks, seqNum)
        currentSeqNum = seqNum
        return
      }

      if (type === 'delta') {
        if (prevSeqNum !== currentSeqNum) {
          unsubscribe()
          subscribe()
          return
        }
        currentSeqNum = seqNum
        store.applyDeltaBatch(bids, asks)
      }
    }

    ws.onclose = () => {
      ws = null
    }
  }

  function disconnect() {
    unsubscribe()
    ws?.close()
    ws = null
  }

  return { connect, disconnect }
}
