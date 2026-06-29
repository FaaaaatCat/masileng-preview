"use client";

import React from "react";
import Link from "next/link";

const FLOATING_EMOJIS = [
  {
    emoji: "🍋",
    top: "18%",
    left: "6%",
    size: 28,
    delay: 0,
    duration: 6.2,
    rotate: -8,
  },
  {
    emoji: "🍓",
    top: "10%",
    left: "88%",
    size: 24,
    delay: 1.1,
    duration: 5.5,
    rotate: -8,
  },
  {
    emoji: "🌿",
    top: "42%",
    left: "82%",
    size: 20,
    delay: 2.3,
    duration: 7.1,
    rotate: 4,
  },
  {
    emoji: "🫧",
    top: "55%",
    left: "10%",
    size: 22,
    delay: 0.7,
    duration: 6.8,
    rotate: -7,
  },
  {
    emoji: "🍊",
    top: "8%",
    left: "54%",
    size: 18,
    delay: 1.8,
    duration: 5.9,
    rotate: 7,
  },
  {
    emoji: "❄️",
    top: "66%",
    left: "34%",
    size: 17,
    delay: 3.1,
    duration: 8.0,
    rotate: -2,
  },
  {
    emoji: "🫒",
    top: "62%",
    left: "91%",
    size: 16,
    delay: 2.0,
    duration: 6.4,
    rotate: 2,
  },
  {
    emoji: "🍹",
    top: "38%",
    left: "2%",
    size: 23,
    delay: 0.4,
    duration: 7.3,
    rotate: -7,
  },
];

export default function RecommendIntroPage() {
  return (
    <div className="recommend-page-root intro-start">
      {/* 배경 글로우 */}
      <div className="recommend-intro-bg-glow recommend-intro-bg-glow--top" />
      <div className="recommend-intro-bg-glow recommend-intro-bg-glow--left" />
      <div className="recommend-intro-bg-glow recommend-intro-bg-glow--bottom" />

      {/* 떠다니는 이모지 */}
      {FLOATING_EMOJIS.map((item, i) => (
        <span
          key={i}
          className="recommend-intro-float-emoji"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            "--delay": `${item.delay}s`,
            "--dur": `${item.duration}s`,
            "--rot": `${item.rotate}deg`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.emoji}
        </span>
      ))}

      {/* 메인 콘텐츠 */}
      <div className="recommend-page-wrap">
        <Link href="/" className="recommend-intro-close" aria-label="홈으로">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>

        {/* 배지 */}
        <div className="dark-badge">
          <span />
          AI 칵테일 추천 서비스
        </div>

        {/* 헤딩 */}
        <div className="recommend-intro-heading">
          <p>오늘 밤,</p>
          <span>최고의 한 잔</span>
          <p>찾아드릴게요.</p>
        </div>

        {/* 서브 텍스트 */}
        <p
          className="common-title-md"
          style={{ textAlign: "center", color: "var(--gray-3)" }}
        >
          날씨 · 상황 · 장소 ·
          <strong style={{ color: "var(--gray-4)", margin: "0 2px 0 8px" }}>
            3가지만 선택
          </strong>
          하면 즉시 추천해드려요.
        </p>

        {/* 진행 카드 */}
        <div className="flex w-100 gap-2 items-center">
          {[
            {
              num: "01",
              img: "/recommend_icon/Property 1=1.sun.png",
              title: "날씨 선택",
            },
            {
              num: "02",
              img: "/recommend_icon/Property 1=1.party.png",
              title: "상황 선택",
            },
            {
              num: "03",
              img: "/recommend_icon/Property 1=1.home.png",
              title: "장소 선택",
            },
          ].map((s, i, arr) => (
            <React.Fragment key={s.num}>
              <div className="recommend-intro-card-step">
                <img
                  src={s.img}
                  alt={s.title}
                  className="recommend-intro-card-step-img"
                />
                <span
                  className="common-body-sm-light"
                  style={{ color: "gray" }}
                >
                  {s.num}
                </span>
                <span
                  className="common-body-sm-bold"
                  style={{ color: "lightgray" }}
                >
                  {s.title}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span className="recommend-intro-card-arrow">›</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA 버튼 */}
        <Link
          href="/recommend/form"
          className="w-100 btn btn-filled btn-gradient-1 btn-xxl"
          style={{ marginTop: 20 }}
        >
          <span className="recommend-intro-cta-shimmer" />
          칵테일 추천받기 →
        </Link>

        {/* 홈으로 돌아가기 버튼 */}
        <Link
          href="/"
          className="btn btn-transparent btn-dark btn-xxl"
          aria-label="홈으로"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
