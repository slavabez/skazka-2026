import { describe, expect, it, vi } from "vitest";
import {
  getCurrentMonthRange,
  getMonthStartForQuery,
  getPreviousMonthRange,
  getTodayForQuery,
} from "./date";

describe("reports date helpers", () => {
  it("returns today and month start in query format", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));

    expect(getTodayForQuery()).toBe("2026-03-15");
    expect(getMonthStartForQuery()).toBe("2026-03-01");

    vi.useRealTimers();
  });

  it("returns current month range", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));

    const range = getCurrentMonthRange();
    expect(range.startDate).toBe("2026-03-01");
    expect(range.endDate).toBe("2026-03-15");
    expect(range.label).toContain("2026");

    vi.useRealTimers();
  });

  it("returns previous month range", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));

    const range = getPreviousMonthRange();
    expect(range.startDate).toBe("2026-02-01");
    expect(range.endDate).toBe("2026-02-28");
    expect(range.label).toContain("2026");

    vi.useRealTimers();
  });
});
