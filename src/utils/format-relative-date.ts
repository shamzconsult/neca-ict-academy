function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isYesterday(date: Date, now: Date) {
  const yesterday = startOfDay(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const target = startOfDay(date);
  return target.getTime() === yesterday.getTime();
}

function formatAbsoluteDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return formatAbsoluteDate(date);

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) {
    return diffSec <= 1 ? "Just now" : `${diffSec} seconds ago`;
  }
  if (diffMin < 60) {
    return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
  }
  if (diffHour < 24) {
    return diffHour === 1 ? "1 hour ago" : `${diffHour} hours ago`;
  }
  if (isYesterday(date, now)) {
    return "Yesterday";
  }

  return formatAbsoluteDate(date);
}

export function formatRelativeDateTitle(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
