"use client";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.padro.my_cocktail_app";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/%EB%A7%88%EC%8B%A4%EB%9E%AD-%ED%95%A8%EA%BB%98-%EB%A7%8C%EB%93%A4%EC%96%B4%EA%B0%80%EB%8A%94-%EC%B9%B5%ED%85%8C%EC%9D%BC-%EA%B0%80%EC%9D%B4%EB%93%9C/id1623101096";

import { useEffect, useState } from "react";

export default function AppLanding() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /android/i.test(ua);
    const isIphone = /iphone|ipod/i.test(ua);
    const isIpad =
      /ipad/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isAndroid) {
      window.location.replace(PLAY_STORE_URL);
      return;
    }

    if (isIphone || isIpad) {
      window.location.replace(APP_STORE_URL);
      return;
    }

    setShowFallback(true);
  }, []);

  if (!showFallback) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "var(--page-bg-ivory)" }}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
      style={{ background: "var(--page-bg-ivory)" }}
    >
      <img src="/logo.svg" alt="마실랭" className="h-10 mb-8" />
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--gray-1)" }}
      >
        내 손안의 레시피, 마실랭
      </h1>
      <p className="text-base mb-8" style={{ color: "var(--gray-3)" }}>
        모바일에서 QR 코드를 스캔해주세요.
      </p>
      <img
        src="/download_qr.png"
        alt="앱 다운로드 QR 코드"
        className="w-40 h-40 rounded-2xl bg-white p-3 shadow-sm mb-8"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--gray-0)" }}
        >
          App Store에서 다운로드
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--gray-0)" }}
        >
          Google Play에서 다운로드
        </a>
      </div>
    </div>
  );
}
