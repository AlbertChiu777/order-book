export type QuoteType = "buy" | "sell";

export interface QuoteEntry {
  price: string;
  size: string;
}

export interface OrderBookData {
  type: "snapshot" | "delta";
  bids: [string, string][];
  asks: [string, string][];
  seqNum: number;
  prevSeqNum: number;
}

export interface OrderBookMessage {
  topic: string;
  data: OrderBookData;
}

export interface TradeData {
  price: number;
  side: "BUY" | "SELL";
  size: number;
  serialId: number;
  symbol: string;
  timestamp: number;
}

export interface TradeMessage {
  topic: string;
  data: TradeData[];
}

export interface QuoteRow {
  price: string;
  size: string;
  total: number;
  barPercent: number;
}

export interface QuoteRowWithMeta extends QuoteRow {
  isNew: boolean;
}
