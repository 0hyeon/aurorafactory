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
export const formatPhoneNumber = (phone: string): string => {
  // "+82 10-4109-6590" => "01041096590"
  return phone
    .replace(/\s+/g, "") // 공백 제거
    .replace(/^\+82/, "0") // 국가번호 +82를 0으로 대체
    .replace(/-/g, ""); // 하이픈 제거
};
