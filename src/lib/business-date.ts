export function getBusinessDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function createReceiptNumber(date: string, sequence: number): string {
  return `POS-${date.replaceAll("-", "")}-${String(sequence).padStart(4, "0")}`;
}
