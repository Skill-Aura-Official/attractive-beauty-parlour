import { describe, it, expect } from "vitest";
import {
  formatINR,
  discountedPrice,
  parseTimeToMinutes,
  isValidHappyHoursWindow,
  getHappyHoursState,
  MAX_HAPPY_HOURS_DISCOUNT,
  MAX_FACIAL_DISCOUNT,
} from "@/lib/campaign";

describe("formatINR", () => {
  it("formats prices in Indian rupees", () => {
    expect(formatINR(2499)).toBe("₹2,499");
    expect(formatINR("3999")).toBe("₹3,999");
  });
  it("returns empty string for invalid values", () => {
    expect(formatINR(null)).toBe("");
    expect(formatINR("abc")).toBe("");
  });
});

describe("discountedPrice", () => {
  it("calculates the promotional price correctly", () => {
    expect(discountedPrice(1000, 30)).toBe(700);
    expect(discountedPrice(999, 50)).toBe(500); // rounds to nearest rupee
    expect(discountedPrice(1500, 0)).toBe(1500);
  });
  it("returns null when base price or discount is not configured", () => {
    expect(discountedPrice(null, 30)).toBeNull();
    expect(discountedPrice(1000, null)).toBeNull();
  });
});

describe("campaign discount caps", () => {
  it("Happy Hours never exceeds 50% and facials never exceed 30%", () => {
    expect(MAX_HAPPY_HOURS_DISCOUNT).toBe(50);
    expect(MAX_FACIAL_DISCOUNT).toBe(30);
  });
});

describe("parseTimeToMinutes", () => {
  it("parses HH:MM times", () => {
    expect(parseTimeToMinutes("11:00")).toBe(660);
    expect(parseTimeToMinutes("09:30")).toBe(570);
  });
  it("rejects invalid times", () => {
    expect(parseTimeToMinutes("25:00")).toBeNull();
    expect(parseTimeToMinutes("bad")).toBeNull();
    expect(parseTimeToMinutes(null)).toBeNull();
  });
});

describe("isValidHappyHoursWindow", () => {
  it("accepts an exactly two-hour window", () => {
    expect(isValidHappyHoursWindow("11:00", "13:00")).toBe(true);
  });
  it("rejects windows that are not exactly two hours", () => {
    expect(isValidHappyHoursWindow("11:00", "12:00")).toBe(false);
    expect(isValidHappyHoursWindow("11:00", "13:30")).toBe(false);
  });
  it("rejects missing times", () => {
    expect(isValidHappyHoursWindow(null, "13:00")).toBe(false);
  });
});

describe("getHappyHoursState", () => {
  it("reports unconfigured when no daily window is set (no invented time)", () => {
    const state = getHappyHoursState({ is_published: true, start_date: "2026-10-29" });
    expect(state).toBe("unconfigured");
  });
  it("reports active inside the configured window (IST)", () => {
    // 2026-10-29 12:30 IST == 07:00 UTC
    const now = new Date("2026-10-29T07:00:00Z");
    const state = getHappyHoursState(
      { is_published: true, start_date: "2026-10-29", daily_start_time: "12:00", daily_end_time: "14:00" },
      now
    );
    expect(state).toBe("active");
  });
  it("reports closed_for_today outside the window", () => {
    const now = new Date("2026-10-29T10:00:00Z"); // 15:30 IST
    const state = getHappyHoursState(
      { is_published: true, start_date: "2026-10-29", daily_start_time: "12:00", daily_end_time: "14:00" },
      now
    );
    expect(state).toBe("closed_for_today");
  });
  it("reports not_started before the configured start date", () => {
    const now = new Date("2026-10-20T07:00:00Z");
    const state = getHappyHoursState({ is_published: true, start_date: "2026-10-29" }, now);
    expect(state).toBe("not_started");
  });
  it("reports unpublished when the campaign is off", () => {
    expect(getHappyHoursState({ is_published: false })).toBe("unpublished");
  });
});
