import { describe, it, expect } from "vitest";
import { formatNumber } from "../utils/formatNumber";

describe("formatNumber", () => {
  it("整數加千分位", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("小數保留", () => {
    expect(formatNumber(21726.5)).toBe("21,726.5");
  });

  it("string 輸入", () => {
    expect(formatNumber("19836")).toBe("19,836");
    expect(formatNumber("21679.5")).toBe("21,679.5");
  });

  it("0 回傳 0", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("無效值回傳 0", () => {
    expect(formatNumber("abc")).toBe("0");
  });
});
