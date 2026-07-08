"use client";

import { useState, useEffect, useCallback } from "react";

import { ChevronRightIcon } from "../components/icons";
import FilterBar from "../components/FilterBar";
import SortDropdown from "../components/SortDropdown";
import ChallengeCard, { CARDS } from "../components/ChallengeCard";

const NEW_COCKTAILS = CARDS.slice(-6).reverse();

// 스캐터 배치 설정 (challenge pool 인덱스 기준)
const SCATTER = [
  { x: 24, y: 96, w: 150, h: 150, i: 0 },
  { x: 190, y: 168, w: 152, h: 152, i: 1 },
  { x: 14, y: 264, w: 160, h: 200, i: 4 },
  { x: 198, y: 344, w: 148, h: 148, i: 6 },
  { x: 40, y: 484, w: 150, h: 150, i: 10 },
  { x: 206, y: 514, w: 150, h: 118, i: 12 },
  { r: 24, y: 96, w: 150, h: 150, i: 7 },
  { r: 190, y: 160, w: 152, h: 152, i: 3 },
  { r: 18, y: 266, w: 158, h: 198, i: 11 },
  { r: 200, y: 346, w: 148, h: 148, i: 9 },
  { r: 38, y: 486, w: 150, h: 150, i: 5 },
  { r: 206, y: 516, w: 150, h: 118, i: 13 },
];

function ChallengeHero() {
  const [items, setItems] = useState([]);

  const compute = useCallback(() => {
    const W = Math.min(1480, window.innerWidth);
    const offset = (window.innerWidth - W) / 2;
    return SCATTER.map((s, idx) => {
      const d = CARDS[s.i % CARDS.length];
      const left = s.x != null ? offset + s.x : offset + W - s.r - s.w;
      return { ...s, d, left, idx };
    });
  }, []);

  useEffect(() => {
    setItems(compute());
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setItems(compute()), 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, [compute]);

  return (
    <div className="challenge-main-banner">
      <div className="challenge-main-banner-bg" />
      <div className="challenge-main-banner-scatter-layer">
        <div className="challenge-main-banner-scatter">
          {items.map(({ left, y, w, h, d, idx }) => (
            <div
              key={idx}
              title={d?.name}
              className="challenge-main-banner-scatter-item challenge-main-banner-thumb"
              style={{
                left,
                top: y,
                width: w,
                height: h,
                background: d?.gradient,
                animationDelay: `${idx * 55}ms`,
              }}
            >
              <img
                src={d?.photo_0}
                alt={d?.name}
                className="challenge-main-banner-scatter-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="challenge-main-banner-content">
        <h1 className="challenge-main-banner-title">
          나만의 창작 레시피를
          <br />
          <span className="challenge-main-banner-accent">지금 등록해보세요</span>
        </h1>
        <p className="challenge-main-banner-subtitle">
          직접 만든 레시피를 공유하고 다른 바텐더들에게
          <br />
          나만의 칵테일을 선보여보세요.
        </p>
        <div className="challenge-main-banner-cta">
          <button className="challenge-main-banner-btn challenge-main-banner-btn-primary btn-xl">
            내 레시피 등록하기
          </button>
          <button className="challenge-main-banner-btn challenge-main-banner-btn-secondary btn-xl">레시피 둘러보기</button>
        </div>
      </div>
    </div>
  );
}


export default function ChallengeHome() {
  const [sortTab, setSortTab] = useState("최신순");
  const [abv, setAbv] = useState("");
  const [base, setBase] = useState("");
  const [theme, setTheme] = useState("");
  const [rangeMin, setRangeMin] = useState(2);
  const [rangeMax, setRangeMax] = useState(10);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem("masileng_user");
    if (s) setCurrentUser(JSON.parse(s));
  }, []);

  const handleReset = () => {
    setAbv("");
    setBase("");
    setTheme("");
    setRangeMin(2);
    setRangeMax(10);
    setSearch("");
  };

  const filterProps = {
    abv,
    base,
    theme,
    ibaOnly: false,
    rangeMin,
    rangeMax,
    search,
    onAbvChange: setAbv,
    onBaseChange: setBase,
    onThemeChange: setTheme,
    onIbaToggle: () => {},
    onRangeMinChange: setRangeMin,
    onRangeMaxChange: setRangeMax,
    onSearchChange: setSearch,
    onReset: handleReset,
  };

  const filtered = CARDS.filter((card) => {
    if (abv === "low" && card.abv > 15) return false;
    if (abv === "high" && card.abv <= 15) return false;
    if (base && card.base !== base) return false;
    if (theme && card.theme !== theme) return false;
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

  return (
    <>
      <ChallengeHero />

      <div className="page-wrap">
        <FilterBar {...filterProps} />
        <div className="section-sort">
          <SortDropdown value={sortTab} onChange={setSortTab} />
        </div>
        <section className="pb-12">
          <div className="section-header">
            <span className="section-title-bar" />
            <h3 className="section-title">금주의 신규 칵테일</h3>
            <button className="btn btn-transparent btn-md" style={{marginLeft:"auto"}}>
              더보기 <ChevronRightIcon />
            </button>
          </div>
          <div className="cocktail-grid">
            {NEW_COCKTAILS.map((card) => (
              <ChallengeCard
                key={card.id}
                card={card}
                currentUser={currentUser}
              />
            ))}
          </div>
        </section>

        <section className="pb-12">
          <div className="section-header">
            <span className="section-title-bar" />
            <h3 className="section-title">도전!마실랭 리스트</h3>
            <span className="section-subtitle">
              {filtered.length === CARDS.length
                ? "1,248개의 창작 레시피"
                : `${filtered.length}개의 검색 결과`}
            </span>
          </div>

          <div className="cocktail-grid">
            {filtered.length > 0 ? (
              filtered.map((card) => (
                <ChallengeCard
                  key={card.id}
                  card={card}
                  currentUser={currentUser}
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
    </>
  );
}
