"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import COCKTAILS from "../data/cocktails.json";
const CARDS = COCKTAILS.filter((c) => c.official);
import { SORT_TABS } from "../data/constants.json";

import { ChevronRightIcon } from "../components/icons";
import CocktailCard from "../components/CocktailCard";
import FilterBar from "../components/FilterBar";
import ChallengeHome from "../page/ChallengeHome";
import IngredientsHome from "../page/IngredientsHome";
import SiteHeader from "../components/SiteHeader";
import NoticeBanner from "../components/NoticeBanner";

// 폰 목업에 보여줄 pool 이미지 인덱스 (2열 3행 = 6개)
const PHONE_ITEMS = [0, 7, 2, 5, 8, 3];

// ─────────────────────────────────────────────
// 앱 배너 히어로
// ─────────────────────────────────────────────
function AppHero() {
  return (
    <div className="cocktail-main-banner">
      <div className="cocktail-main-banner-inner">
        {/* 왼쪽: 텍스트 */}
        <div className="cocktail-main-banner-left">
          <div className="cocktail-main-banner-icon">
            <span>마</span>
          </div>
          <h1 className="cocktail-main-banner-title">
            오늘의 칵테일,
            <br />
            <span className="cocktail-main-banner-accent">마실랭</span>
          </h1>
          <p className="cocktail-main-banner-desc">
            주류 경험의 새로운 기준이 되는
            <br />
            칵테일 라이프 플랫폼 마실랭을 시작해보세요
          </p>
        </div>

        {/* 가운데: 폰 목업 */}
        <div className="cocktail-main-banner-phone-wrap">
          <div className="cocktail-main-banner-phone">
            <div className="cocktail-main-banner-phone-notch" />
            <div className="cocktail-main-banner-phone-screen">
              <div className="cocktail-main-banner-phone-header">
                <span className="cocktail-main-banner-phone-brand">
                  마실랭<span style={{ color: "var(--coral)" }}>●</span>
                </span>
              </div>
              <div className="cocktail-main-banner-phone-grid">
                {PHONE_ITEMS.map((idx) => {
                  const d = CARDS[idx];
                  if (!d) return null;
                  return (
                    <div
                      key={idx}
                      className="cocktail-main-banner-phone-card"
                      style={{ background: d.gradient }}
                    >
                      <img
                        src={d.photo_0}
                        alt={d.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <span className="cocktail-main-banner-phone-card-name">{d.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: QR */}
        <div className="cocktail-main-banner-qr-wrap">
          <div className="cocktail-main-banner-qr-box">
            <svg
              viewBox="0 0 100 100"
              className="cocktail-main-banner-qr-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 좌상단 파인더 */}
              <rect
                x="5"
                y="5"
                width="30"
                height="30"
                rx="4"
                fill="none"
                stroke="#111"
                strokeWidth="4"
              />
              <rect x="13" y="13" width="14" height="14" rx="2" fill="#111" />
              {/* 우상단 파인더 */}
              <rect
                x="65"
                y="5"
                width="30"
                height="30"
                rx="4"
                fill="none"
                stroke="#111"
                strokeWidth="4"
              />
              <rect x="73" y="13" width="14" height="14" rx="2" fill="#111" />
              {/* 좌하단 파인더 */}
              <rect
                x="5"
                y="65"
                width="30"
                height="30"
                rx="4"
                fill="none"
                stroke="#111"
                strokeWidth="4"
              />
              <rect x="13" y="73" width="14" height="14" rx="2" fill="#111" />
              {/* 데이터 셀 (랜덤 패턴) */}
              {[
                [45, 5],
                [50, 5],
                [55, 5],
                [60, 5],
                [45, 12],
                [55, 12],
                [60, 12],
                [45, 19],
                [50, 19],
                [60, 19],
                [45, 26],
                [50, 26],
                [55, 26],
                [45, 33],
                [60, 33],
                [5, 45],
                [10, 45],
                [20, 45],
                [30, 45],
                [35, 45],
                [45, 45],
                [55, 45],
                [65, 45],
                [75, 45],
                [85, 45],
                [90, 45],
                [95, 45],
                [5, 52],
                [15, 52],
                [25, 52],
                [35, 52],
                [50, 52],
                [60, 52],
                [70, 52],
                [80, 52],
                [90, 52],
                [5, 59],
                [10, 59],
                [20, 59],
                [30, 59],
                [40, 59],
                [55, 59],
                [65, 59],
                [75, 59],
                [85, 59],
                [95, 59],
                [5, 66],
                [15, 66],
                [35, 66],
                [50, 66],
                [60, 66],
                [80, 66],
                [95, 66],
                [5, 73],
                [10, 73],
                [25, 73],
                [40, 73],
                [55, 73],
                [70, 73],
                [85, 73],
                [45, 73],
                [50, 73],
                [55, 73],
                [60, 73],
                [70, 73],
                [80, 73],
                [90, 73],
                [95, 73],
                [45, 80],
                [55, 80],
                [65, 80],
                [75, 80],
                [90, 80],
                [45, 87],
                [50, 87],
                [60, 87],
                [70, 87],
                [80, 87],
                [95, 87],
                [45, 94],
                [55, 94],
                [65, 94],
                [85, 94],
                [95, 94],
              ].map(([cx, cy], i) => (
                <rect
                  key={i}
                  x={cx}
                  y={cy}
                  width="4"
                  height="4"
                  rx="1"
                  fill="#111"
                />
              ))}
            </svg>
          </div>
          <p className="cocktail-main-banner-qr-label">앱 다운로드 QR</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 칵테일 페이지 콘텐츠
// ─────────────────────────────────────────────
function applyFilters(
  cards,
  { abv, base, theme, ibaOnly, rangeMin, rangeMax, search },
) {
  return cards.filter((card) => {
    if (abv === "low" && card.abv > 15) return false;
    if (abv === "high" && card.abv <= 15) return false;
    if (base && card.base !== base) return false;
    if (theme && card.theme !== theme) return false;
    if (ibaOnly && !card.iba) return false;
    const count = card.ingredients?.length ?? 0;
    if (count < rangeMin || count > rangeMax) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !card.name.toLowerCase().includes(q) &&
        !card.desc.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

function CocktailPage({ filterProps }) {
  const [sortTab, setSortTab] = useState("최신순");
  const filtered = applyFilters(CARDS, filterProps);

  return (
    <div className="page-wrap">
      <FilterBar {...filterProps} showIba={true} />
      <section className="pb-12">
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-title-bar" />
            <h3 className="section-title">정식 칵테일 리스트</h3>
            <span className="section-subtitle">
              {filtered.length === CARDS.length
                ? "전 세계 칵테일 레시피 모음"
                : `${filtered.length}개의 검색 결과`}
            </span>
          </div>
          <div className="section-sort">
            {SORT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSortTab(tab)}
                className={`btn btn-sm${sortTab === tab ? " btn-filled btn-gray-dark" : " btn-lined btn-gray-light"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="cocktail-grid">
          {filtered.length > 0 ? (
            filtered.map((card) => (
              <CocktailCard
                key={card.id}
                card={card}
                cardId={card.id}
                showAuthor={false}
              />
            ))
          ) : (
            <p
              style={{
                color: "var(--font-placeholder)",
                fontSize: 15,
                padding: "40px 0",
              }}
            >
              검색 결과가 없어요.
            </p>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="load-more-wrap">
            <button className="btn btn-lined btn-gray-light btn-xl">
              레시피 더 보기
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export default function MasilengHome() {
  const searchParams = useSearchParams();
  const [activeNav, setActiveNav] = useState(
    () => searchParams.get("tab") || "칵테일",
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveNav(tab);
  }, [searchParams]);
  const [abv, setAbv] = useState("");
  const [base, setBase] = useState("");
  const [theme, setTheme] = useState("");
  const [ibaOnly, setIbaOnly] = useState(false);
  const [rangeMin, setRangeMin] = useState(2);
  const [rangeMax, setRangeMax] = useState(10);
  const [search, setSearch] = useState("");

  const handleReset = () => {
    setAbv("");
    setBase("");
    setTheme("");
    setIbaOnly(false);
    setRangeMin(2);
    setRangeMax(10);
    setSearch("");
  };

  const filterProps = {
    abv,
    base,
    theme,
    ibaOnly,
    rangeMin,
    rangeMax,
    search,
    onAbvChange: setAbv,
    onBaseChange: setBase,
    onThemeChange: setTheme,
    onIbaToggle: () => setIbaOnly((v) => !v),
    onRangeMinChange: setRangeMin,
    onRangeMaxChange: setRangeMax,
    onSearchChange: setSearch,
    onReset: handleReset,
  };

  const isChallenge = activeNav === "도전!마실랭";
  const isIngredients = activeNav === "재료";

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--page-bg-ivory)",
        transition: "background 280ms ease",
      }}
    >
      <NoticeBanner />
      <SiteHeader activeNav={activeNav} onNavClick={setActiveNav} />

      {/* HERO — 칵테일 페이지에만 */}
      {!isChallenge && !isIngredients && <AppHero />}

      {/* 페이지 콘텐츠 */}
      {isChallenge ? (
        <ChallengeHome />
      ) : isIngredients ? (
        <IngredientsHome />
      ) : (
        <CocktailPage filterProps={filterProps} />
      )}
    </div>
  );
}
