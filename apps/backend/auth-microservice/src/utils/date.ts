export function getOnlyDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
