"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import COCKTAILS from "../data/cocktails.json";
const CARDS = COCKTAILS.filter((c) => c.official);
import CocktailCard from "../components/CocktailCard";
import FilterBar from "../components/FilterBar";
import SortDropdown from "../components/SortDropdown";
import ChallengeHome from "../page/ChallengeHome";
import IngredientsHome from "../page/IngredientsHome";
import SiteHeader from "../components/SiteHeader";
import NoticeBanner from "../components/NoticeBanner";
import { ArrowRightIcon } from "../components/icons";

// ─────────────────────────────────────────────
// 앱 배너 히어로
// ─────────────────────────────────────────────
function AppHero() {
  return (
    <div className="cocktail-main-banner">
      <div className="cocktail-main-banner-inner">
        {/* 본문: 폰 스크린샷 + 텍스트/QR */}
        <div className="cocktail-main-banner-body">
          <div className="cocktail-main-banner-phone-wrap">
            <img
              src="/main_phone_2.png"
              alt="마실랭 앱 화면"
              className="cocktail-main-banner-phone"
            />
          </div>
          <div className="cocktail-main-banner-right">
            <div className="cocktail-main-banner-text-wrap">
              <p className="cocktail-main-banner-desc">지금 시작하세요</p>
              <div className="cocktail-main-banner-title-wrap">
                <h1 className="cocktail-main-banner-title">내 손안의 레시피</h1>
                <div className="divider"></div>
                <h1 className="cocktail-main-banner-title">
                  <b> Masileng</b>
                </h1>
              </div>
            </div>
            <div className="cocktail-main-banner-qr-card">
              <img
                src="/download_qr.png"
                alt="앱 다운로드 QR"
                className="cocktail-main-banner-qr"
              />
              <span className="cocktail-main-banner-qr-label">
                앱 다운로드 QR
              </span>
            </div>
            <Link href="/app" className="btn btn-filled btn-brand btn-md md:hidden! cocktail-main-banner-download-btn">
              앱 다운로드
              <span className="cocktail-main-banner-download-btn-icon">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>
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
  const sorted =
    sortTab === "인기순"
      ? [...filtered].sort((a, b) => b.likes - a.likes)
      : filtered;

  return (
    <div className="page-wrap">
      <div className="filter-sort-row">
        <FilterBar {...filterProps} showIba={true} />
        <SortDropdown
          className="section-sort"
          value={sortTab}
          onChange={setSortTab}
        />
      </div>
      <section className="pb-12">
        <div className="section-header">
          <span className="section-title-bar" />
          <h3 className="section-title">정식 칵테일 리스트</h3>
          <span className="section-subtitle">
            {filtered.length === CARDS.length
              ? "전 세계 칵테일 레시피 모음"
              : `${filtered.length}개의 검색 결과`}
          </span>
          <SortDropdown
            className="section-sort"
            value={sortTab}
            onChange={setSortTab}
          />
        </div>
        <div className="cocktail-grid">
          {filtered.length > 0 ? (
            sorted.map((card) => (
              <CocktailCard key={card.id} card={card} cardId={card.id} />
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
