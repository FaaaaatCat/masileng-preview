import type { Metadata } from "next";
import AppLanding from "./AppLanding";

export const metadata: Metadata = {
  title: "마실랭 앱 다운로드",
  description: "함께 만들어가는 칵테일 가이드, 마실랭 앱을 다운로드하세요.",
  openGraph: {
    title: "마실랭 앱 다운로드",
    description: "함께 만들어가는 칵테일 가이드, 마실랭 앱을 다운로드하세요.",
    images: ["/main_phone.png"],
  },
};

export default function Page() {
  return <AppLanding />;
}
