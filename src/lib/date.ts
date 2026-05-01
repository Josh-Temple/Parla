export function getLocalDayRange(now: Date): { start: Date; end: Date } {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

export function isSameLocalDay(iso: string, now: Date): boolean {
  const d = new Date(iso);
  const { start, end } = getLocalDayRange(now);
  return d >= start && d < end;
}
