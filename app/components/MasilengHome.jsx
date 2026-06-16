"use client";

import { useState, useEffect, useCallback } from "react";
import "../css/MasilengHome.css";

import POOL_RAW       from "../data/pool.json";
import SCATTER_CONFIG from "../data/scatterConfig.json";
import CARDS          from "../data/cards.json";
import { IMG_BASE, NAV_ITEMS, SORT_TABS } from "../data/constants.json";

import { ChevronRightIcon, UploadIcon } from "./icons";
import CocktailCard, { POOL } from "./CocktailCard";
import FilterBar from "./FilterBar";
import ChallengeHome from "./ChallengeHome";

// ─────────────────────────────────────────────
// Hero 스캐터
// ─────────────────────────────────────────────
function HeroScatter() {
  const [items, setItems] = useState([]);

  const compute = useCallback(() => {
    const W = Math.min(1480, window.innerWidth);
    const offset = (window.innerWidth - W) / 2;
    return SCATTER_CONFIG.map((s, idx) => {
      const d = POOL[s.i];
      const left = s.x != null ? offset + s.x : offset + W - s.r - s.w;
      return { ...s, d, left, idx };
    });
  }, []);

  useEffect(() => {
    setItems(compute());
    let timer;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(() => setItems(compute()), 120); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(timer); };
  }, [compute]);

  return (
    <div className="scatter-layer">
      {items.map(({ left, y, w, h, d, idx }) => (
        <div key={idx} title={d.n}
          className="scatter-item thumb-float"
          style={{ left, top: y, width: w, height: h, background: d.g, animationDelay: `${idx * 55}ms` }}
        >
          <img src={d.url} alt={d.n} className="scatter-img"
            onError={(e) => { e.target.style.display = "none"; }} />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 칵테일 페이지 콘텐츠
// ─────────────────────────────────────────────
function applyFilters(cards, { abv, base, theme, ibaOnly, rangeMin, rangeMax, search }) {
  return cards.filter((card) => {
    if (abv && card.abv !== abv) return false;
    if (base && card.base !== base) return false;
    if (theme && card.theme !== theme) return false;
    if (ibaOnly && !card.iba) return false;
    if (card.count < rangeMin || card.count > rangeMax) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!card.t.toLowerCase().includes(q) && !card.desc.toLowerCase().includes(q)) return false;
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
      <section className="section-list">
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
              <button key={tab} onClick={() => setSortTab(tab)}
                className={`btn-sort${sortTab === tab ? " active" : ""}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="cocktail-grid">
          {filtered.length > 0
            ? filtered.map((card, idx) => <CocktailCard key={idx} card={card} showAuthor={false} />)
            : <p style={{ color: "var(--ink-3)", fontSize: 15, padding: "40px 0" }}>검색 결과가 없어요.</p>
          }
        </div>
        {filtered.length > 0 && (
          <div className="load-more-wrap">
            <button className="btn-more">레시피 더 보기</button>
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
  const [activeNav, setActiveNav] = useState("칵테일");
  const [abv, setAbv] = useState("");
  const [base, setBase] = useState("");
  const [theme, setTheme] = useState("");
  const [ibaOnly, setIbaOnly] = useState(false);
  const [rangeMin, setRangeMin] = useState(2);
  const [rangeMax, setRangeMax] = useState(10);
  const [search, setSearch] = useState("");

  const handleReset = () => {
    setAbv(""); setBase(""); setTheme(""); setIbaOnly(false);
    setRangeMin(2); setRangeMax(10); setSearch("");
  };

  const filterProps = {
    abv, base, theme, ibaOnly, rangeMin, rangeMax, search,
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

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="site-header-inner">
          <nav className="site-nav">
            <a href="#" className="site-brand">
              <span>마실랭</span>
              <span className="site-brand-dot">●</span>
            </a>
            <div className="nav-menu">
              {NAV_ITEMS.map((item) => (
                <a key={item} href="#"
                  onClick={(e) => { e.preventDefault(); setActiveNav(item); }}
                  className={`nav-link${activeNav === item ? " active" : ""}`}
                >
                  {item}
                  {activeNav === item && <span className="nav-link-underline" />}
                </a>
              ))}
              <span className="nav-divider" />
              <a href="#" className="nav-link">추천</a>
              <a href="#" className="nav-link nav-link-download">앱 다운로드</a>
            </div>
            <div className="nav-spacer" />
            <div className="nav-actions">
              <button className="btn-login">로그인</button>
              <button className="btn-recipe-upload"><UploadIcon />레시피 업로드</button>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO — 칵테일 페이지에만 */}
      {!isChallenge && (
        <div className="hero">
          <div className="hero-bg" />
          <div className="hero-scatter-layer hero-scatter">
            <HeroScatter />
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              마실랭에서<br />
              <span className="hero-accent">오늘의 칵테일</span> 만나기
            </h1>
            <p className="hero-subtitle">
              전 세계 칵테일 레시피를 발견하고, 마실랭 유저들의 창작 레시피로 나만의 한 잔을 직접 만들어보세요.
            </p>
            <div className="hero-cta">
              <a href="#" className="btn-cta btn-cta-primary">레시피 둘러보기</a>
              <a href="#" className="btn-cta btn-cta-secondary">AI에게 추천받기</a>
            </div>
          </div>
        </div>
      )}

      {/* 페이지 콘텐츠 */}
      {isChallenge
        ? <ChallengeHome />
        : <CocktailPage filterProps={filterProps} />
      }
    </>
  );
}
