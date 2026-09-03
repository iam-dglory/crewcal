import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
} from "date-fns";

export function getMonthGrid(monthParam?: string) {
  const base = monthParam ? new Date(`${monthParam}-01T00:00:00`) : new Date();
  const first = startOfMonth(base);
  const last = endOfMonth(base);
  const gridStart = startOfWeek(first, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(last, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return {
    monthLabel: format(first, "MMMM yyyy"),
    from: format(gridStart, "yyyy-MM-dd"),
    to: format(gridEnd, "yyyy-MM-dd"),
    days: days.map((d) => format(d, "yyyy-MM-dd")),
    currentMonthKey: format(first, "yyyy-MM"),
    prevMonth: format(subMonths(first, 1), "yyyy-MM"),
    nextMonth: format(addMonths(first, 1), "yyyy-MM"),
  };
}
