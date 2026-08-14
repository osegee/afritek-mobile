// lib/format.ts

export function formatNaira(value: number): string {
  return `₦${value.toLocaleString("en-NG")}`;
}
