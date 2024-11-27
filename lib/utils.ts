import db from "@/lib/db";
import chalk from "chalk";

export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}
export function formatToWon(price: number | undefined) {
  if (price === undefined || price === null) {
    return "0"; // 혹은 원하는 기본값 설정
  }
  return price.toLocaleString("ko-KR");
}
export function cls(...classnames: string[]) {
  return classnames.join(" ");
}
