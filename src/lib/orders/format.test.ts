import { describe, expect, it, vi } from "vitest";
import {
  format1CDocumentNumber,
  formatDateShort,
  formatPrice,
  getDateFor1C,
  isValidDateForQuery,
  translateDeliveryType,
} from "./format";

describe("orders format utils", () => {
  it("formats date for 1C as YYYY-MM-DD", () => {
    expect(getDateFor1C(new Date("2026-03-15T08:00:00.000Z"))).toBe(
      "2026-03-15",
    );
  });

  it("uses current date when input is missing", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T12:00:00.000Z"));

    expect(getDateFor1C()).toBe("2026-02-01");

    vi.useRealTimers();
  });

  it("formats document number by trimming leading zeros", () => {
    expect(format1CDocumentNumber("0001-000045")).toBe("1-45");
    expect(format1CDocumentNumber("unexpected-format")).toBe(
      "unexpected-format",
    );
  });

  it("translates delivery type values", () => {
    expect(translateDeliveryType("ДоКлиента")).toBe("Доставка до клиента");
    expect(translateDeliveryType("Самовывоз")).toBe("Самовывоз");
    expect(translateDeliveryType("Courier")).toBe("Courier");
  });

  it("validates query date format", () => {
    expect(isValidDateForQuery("2026-03-15")).toBe(true);
    expect(isValidDateForQuery("15-03-2026")).toBe(false);
  });

  it("formats price in KZT", () => {
    expect(formatPrice(1234)).toContain("₸");
  });

  it("formats date strings and date objects consistently", () => {
    const fromString = formatDateShort("2026-03-15T00:00:00.000Z");
    const fromDate = formatDateShort(new Date("2026-03-15T00:00:00.000Z"));

    expect(fromString).toBe(fromDate);
    expect(fromString.length).toBeGreaterThan(0);
  });
});
