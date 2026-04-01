import { ref } from "vue";

type ConnectionStatus =
  | "idle"
  | "connecting"
  | "open"
  | "reconnecting"
  | "closed"
  | "error";

interface ManagedWebSocketOptions<TMessage> {
  url: string;
  reconnect?: boolean;
  reconnectDelayMs?: number;
  maxReconnectDelayMs?: number;
  subscribeMessage?: object | (() => object);
  unsubscribeMessage?: object | (() => object);
  parseMessage?: (raw: string) => TMessage;
  onOpen?: (socket: WebSocket) => void;
  onMessage: (message: TMessage, event: MessageEvent<string>) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
}

function resolvePayload(payload?: object | (() => object)) {
  if (!payload) return null;
  return typeof payload === "function" ? payload() : payload;
}

export function useManagedWebSocket<TMessage>({
  url,
  reconnect = true,
  reconnectDelayMs = 1_000,
  maxReconnectDelayMs = 10_000,
  subscribeMessage,
  unsubscribeMessage,
  parseMessage = JSON.parse as (raw: string) => TMessage,
  onOpen,
  onMessage,
  onError,
  onClose,
}: ManagedWebSocketOptions<TMessage>) {
  const status = ref<ConnectionStatus>("idle");
  const reconnectAttempts = ref(0);

  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let manuallyClosed = false;

  function clearReconnectTimer() {
    if (!reconnectTimer) return;
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  function sendJson(payload: object) {
    if (socket?.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(payload));
    return true;
  }

  function subscribe() {
    const payload = resolvePayload(subscribeMessage);
    if (!payload) return false;
    return sendJson(payload);
  }

  function unsubscribe() {
    const payload = resolvePayload(unsubscribeMessage);
    if (!payload) return false;
    return sendJson(payload);
  }

  function scheduleReconnect() {
    if (!reconnect || manuallyClosed || reconnectTimer) return;

    const delay = Math.min(
      reconnectDelayMs * 2 ** reconnectAttempts.value,
      maxReconnectDelayMs,
    );

    status.value = "reconnecting";
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
    reconnectAttempts.value += 1;
  }

  function connect() {
    clearReconnectTimer();

    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    manuallyClosed = false;
    status.value =
      reconnectAttempts.value > 0 ? "reconnecting" : "connecting";

    socket = new WebSocket(url);

    socket.onopen = () => {
      status.value = "open";
      reconnectAttempts.value = 0;
      subscribe();
      onOpen?.(socket as WebSocket);
    };

    socket.onmessage = (event) => {
      const message = parseMessage(event.data);
      onMessage(message, event as MessageEvent<string>);
    };

    socket.onerror = (event) => {
      status.value = "error";
      onError?.(event);
    };

    socket.onclose = (event) => {
      socket = null;
      status.value = manuallyClosed ? "closed" : "error";
      onClose?.(event);

      if (!manuallyClosed) {
        scheduleReconnect();
      }
    };
  }

  function disconnect() {
    manuallyClosed = true;
    clearReconnectTimer();
    unsubscribe();
    socket?.close();
    socket = null;
    status.value = "closed";
  }

  function reconnectNow() {
    manuallyClosed = false;
    clearReconnectTimer();
    socket?.close();
  }

  return {
    status,
    reconnectAttempts,
    connect,
    disconnect,
    reconnectNow,
    sendJson,
    subscribe,
    unsubscribe,
  };
}
