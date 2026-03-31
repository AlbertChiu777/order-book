import { describe, it, expect } from "vitest";
import { calcAccumulative } from "../utils/calcAccumulative";

const sellQuotes = [
  { price: "100", size: "10" },
  { price: "90", size: "5" },
  { price: "80", size: "3" },
];

const buyQuotes = [
  { price: "100", size: "10" },
  { price: "90", size: "5" },
  { price: "80", size: "3" },
];

describe("calcAccumulative - sell", () => {
  it("從最低價開始累計", () => {
    const result = calcAccumulative(sellQuotes, "sell");
    // 80(3) → 90(3+5=8) → 100(8+10=18)，還原後 100 在第一位
    expect(result[0].price).toBe("100");
    expect(result[0].total).toBe(18);
    expect(result[1].total).toBe(8);
    expect(result[2].total).toBe(3);
  });

  it("最高 total 的 barPercent 為 100", () => {
    const result = calcAccumulative(sellQuotes, "sell");
    expect(result[0].barPercent).toBe(100);
  });

  it("barPercent 計算正確", () => {
    const result = calcAccumulative(sellQuotes, "sell");
    expect(result[2].barPercent).toBeCloseTo((3 / 18) * 100);
  });
});

describe("calcAccumulative - buy", () => {
  it("從最高價開始累計", () => {
    const result = calcAccumulative(buyQuotes, "buy");
    expect(result[0].price).toBe("100");
    expect(result[0].total).toBe(10);
    expect(result[1].total).toBe(15);
    expect(result[2].total).toBe(18);
  });

  it("最後一筆 barPercent 為 100", () => {
    const result = calcAccumulative(buyQuotes, "buy");
    expect(result[result.length - 1].barPercent).toBe(100);
  });
});

describe("calcAccumulative - edge cases", () => {
  it("空陣列回傳空陣列", () => {
    expect(calcAccumulative([], "buy")).toEqual([]);
    expect(calcAccumulative([], "sell")).toEqual([]);
  });

  it("單筆 barPercent 為 100", () => {
    const result = calcAccumulative([{ price: "100", size: "10" }], "buy");
    expect(result[0].barPercent).toBe(100);
  });
});
