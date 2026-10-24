// Shared campaign logic for Happy Hours & Facial Offers.
// Business rules:
// - Happy Hours: max 50% discount, daily two-hour window (Asia/Kolkata)
// - Facial Offers: max 30% discount, selected facials only

export const MAX_HAPPY_HOURS_DISCOUNT = 50;
export const MAX_FACIAL_DISCOUNT = 30;

export const formatINR = (value: number | string | null | undefined): string => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
};

/** Exact discounted price, rounded to the nearest rupee. Returns null when inputs are missing/invalid. */
export const discountedPrice = (
  base: number | string | null | undefined,
  pct: number | null | undefined
): number | null => {
  const b = Number(base);
  const p = Number(pct);
  if (!Number.isFinite(b) || !Number.isFinite(p)) return null;
  if (p <= 0) return Math.round(b);
  return Math.round(b * (1 - p / 100));
};

/** "HH:MM" -> minutes since midnight. Returns null for invalid input. */
export const parseTimeToMinutes = (time: string | null | undefined): number | null => {
  if (!time) return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
};

/** Happy Hours window must be exactly two hours. */
export const isValidHappyHoursWindow = (
  start: string | null | undefined,
  end: string | null | undefined
): boolean => {
  const s = parseTimeToMinutes(start);
  const e = parseTimeToMinutes(end);
  if (s === null || e === null) return false;
  return e - s === 120;
};

export type HappyHoursState =
  | "unpublished"
  | "not_started"
  | "unconfigured" // published, but no daily window configured yet
  | "active"
  | "closed_for_today"
  | "ended";

export interface HappyHoursStatusInput {
  is_published?: boolean | null;
  start_date?: string | null;
  end_date?: string | null;
  daily_start_time?: string | null;
  daily_end_time?: string | null;
}

/** Current wall-clock time in Asia/Kolkata as minutes since midnight + weekday. */
export const istNow = (now: Date = new Date()): { minutes: number; weekday: number } => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const h = Number(get("hour")) % 24;
  const m = Number(get("minute"));
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { minutes: h * 60 + m, weekday: weekdays.indexOf(get("weekday")) };
};

/** Compute the public-facing Happy Hours state from the configured schedule. */
export const getHappyHoursState = (
  c: HappyHoursStatusInput,
  now: Date = new Date()
): HappyHoursState => {
  if (c.is_published === false) return "unpublished";
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(now); // YYYY-MM-DD
  const start = c.start_date ?? null;
  const end = c.end_date ?? null;
  if (start && today < start) return "not_started";
  if (end && today > end) return "ended";

  const s = parseTimeToMinutes(c.daily_start_time);
  const e = parseTimeToMinutes(c.daily_end_time);
  if (s === null || e === null) return "unconfigured";
  const { minutes } = istNow(now);
  if (minutes < s) return "closed_for_today";
  if (minutes >= e) return "closed_for_today";
  return "active";
};
