"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { XIcon, ArrowRightIcon } from "../components/icons";

const STEPS = [
  {
    num: "01",
    img: "/character_illust/process_1.png",
    title: "레시피 작성",
    desc: "칵테일 이름, 재료, 조제 방법, 대표 사진까지 꼼꼼히 입력해주세요.",
  },
  {
    num: "02",
    img: "/character_illust/process_2.png",
    title: "레시피 등록",
    desc: "모든 내용을 입력하면 레시피가 등록되어 홈페이지에 공개됩니다.",
  },
  {
    num: "03",
    img: "/character_illust/process_3.png",
    title: "모두에게 공유",
    desc: "멋진 레시피를 혼자만 알기 아쉽지 않나요? 주변에 공유해봅시다.",
  },
];

const GUIDELINES = [
  {
    icon: "📸",
    text: "대표 사진은 실제 제작한 칵테일 사진으로 업로드해주세요.",
  },
  { icon: "🧪", text: "재료는 정확한 분량과 단위를 기입해주세요." },
  {
    icon: "📋",
    text: "타인의 레시피를 무단으로 도용하는 경우 반려될 수 있습니다.",
  },
  { icon: "⚠️", text: "적합하지 않은 콘텐츠는 등록이 제한될 수 있습니다." },
];

const HOF_CARDS = [
  { rank: 1, emoji: "🍹", name: "미드나이트 로즈", likes: "2.4k" },
  { rank: 2, emoji: "🍸", name: "선셋 마가리타", likes: "1.8k" },
  { rank: 3, emoji: "🥂", name: "블루 라군 스피릿", likes: "1.3k" },
];

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function UploadIntroPage() {
  const revealRef = useScrollReveal();

  return (
    <>
      <div className="upload-intro-page" ref={revealRef}>
        <Link href="/" className="upload-intro-close" aria-label="홈으로">
          <XIcon />
        </Link>

        {/* ── Hero ── */}
        <section className="upload-intro-layout">
          <div className="upload-intro-phone-wrap">
            <div className="upload-intro-circle" />
            <div className="upload-intro-phone">
              <div className="upload-intro-phone-screen">
                <div className="upload-intro-screen-content">
                  <div className="upload-intro-recipe-img-placeholder" />
                  <div className="upload-intro-recipe-info">
                    <div className="upload-intro-recipe-badge">✨ NEW</div>
                    <div className="upload-intro-recipe-name">
                      미드나이트 로즈
                    </div>
                    <div className="upload-intro-recipe-desc">
                      달콤하고 부드러운 로즈 플레이버
                    </div>
                    <div className="upload-intro-recipe-tags">
                      <span className="upload-intro-recipe-tag">Fruity</span>
                      <span className="upload-intro-recipe-tag">Creamy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="upload-intro-text-wrap">
            <span className="common-tag common-tag--coral upload-badge">✨ 레시피 업로드</span>
            <h1 className="upload-intro-heading">
              당신의 레시피를
              <br />
              기다리고 있어요
            </h1>
            <p className="upload-intro-sub">
              직접 만든 특별한 레시피를 마실랭에 등록해 보세요. 전 세계 칵테일
              애호가들의 새로운 즐거움이 될 수 있습니다. 새로운 칵테일 영감이
              떠올랐나요? 지금 바로 공유 해주세요!
            </p>
            <div className="upload-intro-actions">
              <Link
                href="/upload/form"
                className="btn btn-filled btn-gradient-1 btn-xl"
              >
                레시피 작성하기
                <ArrowRightIcon />
              </Link>
              <Link href="/" className="btn btn-lined btn-gray-light btn-xl">
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </section>

        {/* ── Process Steps ── */}
        <section className="upload-intro-section">
          <div className="page-wrap page-wrap--sm upload-intro-section-inner">
            <h2 className="upload-intro-section-title reveal">등록 프로세스</h2>
            <p className="upload-intro-section-sub reveal reveal-delay-1">
              3단계면 충분해요
            </p>
            <div className="upload-intro-steps">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className={`upload-intro-step reveal reveal-delay-${i + 1}`}
                >
                  <div className="upload-intro-step-icon">
                    <Image src={step.img} alt={step.title} width={180} height={180} />
                  </div>
                  <div className="upload-intro-step-num">{step.num}</div>
                  <h3 className="upload-intro-step-title">{step.title}</h3>
                  <p className="upload-intro-step-desc">{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="upload-intro-step-arrow" aria-hidden>
                      ›
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guidelines ── */}
        <section className="upload-intro-section upload-intro-section--gray">
          <div
            className="page-wrap page-wrap--sm upload-intro-section-inner"
            style={{ marginBottom: "40px" }}
          >
            <h2 className="upload-intro-section-title reveal">
              등록 가이드라인
            </h2>
            <p className="upload-intro-section-sub reveal reveal-delay-1">
              품질 있는 레시피 커뮤니티를 위해 지켜주세요
            </p>
            <div className="upload-intro-guidelines">
              {GUIDELINES.map((g, i) => (
                <div
                  key={g.text}
                  className={`upload-intro-guideline reveal reveal-delay-${i + 1}`}
                >
                  <span className="upload-intro-guideline-icon">{g.icon}</span>
                  <span className="upload-intro-guideline-text">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Hall of Fame ── */}
        <section className="upload-intro-hof">
          <div className="page-wrap page-wrap--sm">
            <div className="upload-intro-hof-badge reveal">🏆 명예의 전당</div>
            <h2 className="upload-intro-hof-heading reveal reveal-delay-1">
              좋아요가 쌓이면
              <br />
              <em>명예의 전당</em>에 오릅니다
            </h2>
            <p className="upload-intro-hof-sub reveal reveal-delay-2">
              커뮤니티의 사랑을 받은 레시피는 마실랭 명예의 전당에 등재됩니다.
              <br />
              지금 레시피를 올리고 최고의 바텐더로 인정받아보세요.
            </p>
            <div className="upload-intro-hof-cards">
              {HOF_CARDS.map((card, i) => (
                <div
                  key={card.rank}
                  className={`upload-intro-hof-card upload-intro-hof-card--${card.rank} reveal reveal-delay-${i + 1}`}
                >
                  <div
                    className={`upload-intro-hof-card-rank upload-intro-hof-card-rank--${card.rank}`}
                  >
                    {card.rank === 1
                      ? "🥇 1st"
                      : card.rank === 2
                        ? "🥈 2nd"
                        : "🥉 3rd"}
                  </div>
                  <div className="upload-intro-hof-card-img">{card.emoji}</div>
                  <div className="upload-intro-hof-card-name">{card.name}</div>
                  <div className="upload-intro-hof-card-likes">
                    ♥ {card.likes}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/upload/form"
              className="btn btn-filled btn-gradient-1 btn-lg upload-intro-hof-cta reveal reveal-delay-2"
            >
              지금 레시피 등록하기
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

