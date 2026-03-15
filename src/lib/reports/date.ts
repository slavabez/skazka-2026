function pad(v: number) {
  return `${v}`.padStart(2, "0");
}

export function getTodayForQuery(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function getMonthStartForQuery(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
}

function toQueryDate(input: Date): string {
  return `${input.getFullYear()}-${pad(input.getMonth() + 1)}-${pad(input.getDate())}`;
}

export function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    startDate: toQueryDate(start),
    endDate: toQueryDate(now),
    label: new Intl.DateTimeFormat("ru-RU", {
      month: "long",
      year: "numeric",
    }).format(now),
  };
}

export function getPreviousMonthRange() {
  const now = new Date();
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const start = new Date(
    previousMonthDate.getFullYear(),
    previousMonthDate.getMonth(),
    1,
  );
  const end = new Date(
    previousMonthDate.getFullYear(),
    previousMonthDate.getMonth() + 1,
    0,
  );

  return {
    startDate: toQueryDate(start),
    endDate: toQueryDate(end),
    label: new Intl.DateTimeFormat("ru-RU", {
      month: "long",
      year: "numeric",
    }).format(previousMonthDate),
  };
}
