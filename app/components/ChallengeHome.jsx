"use client";

import { useState } from "react";
import "../css/MasilengHome.css";

import POOL_RAW      from "../data/challenge_pool.json";
import CARDS         from "../data/challenge_cards.json";
import { IMG_BASE, SORT_TABS } from "../data/constants.json";

import { HeartIcon, ChatIcon, ChevronRightIcon } from "./icons";
import FilterBar from "./FilterBar";

const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

const NEW_COCKTAILS = CARDS.slice(-6).reverse();

const BANNER_LEFT  = [1, 2, 0];
const BANNER_RIGHT = [6, 9];

function ChallengeBanner() {
  return (
    <div className="challenge-banner">
      {BANNER_LEFT.map((poolIdx, i) => {
        const d = POOL[poolIdx];
        return (
          <div key={`l${i}`} className={`challenge-banner-card challenge-banner-card-l${i}`}
            style={{ background: d.g }}>
            <img src={d.url} alt={d.n} onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        );
      })}

      <div className="challenge-banner-content">
        <span className="challenge-banner-label">도전 마실랭</span>
        <h2 className="challenge-banner-title">
          나만의 창작 레시피를<br />지금 등록해보세요
        </h2>
        <p className="challenge-banner-desc">
          직접 만든 레시피를 공유하고 다른 바텐더들에게<br />나만의 칵테일을 선보여보세요.
        </p>
        <button className="btn-challenge-register">내 레시피 등록하기</button>
      </div>

      {BANNER_RIGHT.map((poolIdx, i) => {
        const d = POOL[poolIdx];
        return (
          <div key={`r${i}`} className={`challenge-banner-card challenge-banner-card-r${i}`}
            style={{ background: d.g }}>
            <img src={d.url} alt={d.n} onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        );
      })}
    </div>
  );
}

function ChallengeCard({ card }) {
  const d = POOL[card.i];
  return (
    <article className="card">
      <div className="card-img-wrap">
        <div className="card-bg" style={{ background: d.g }} />
        <img src={d.url} alt={d.n} className="card-img"
          onError={(e) => { e.target.style.display = "none"; }} />
        <div className="card-overlay" />
        <div className="card-author">
          <div className="card-author-avatar" />
          <span className="card-author-name">@{card.u}</span>
        </div>
        <div className="card-desc-layer">
          <p className="card-desc">{card.desc}</p>
        </div>
      </div>
      <h4 className="card-title">{card.t}</h4>
      <div className="card-meta">
        <span className="card-meta-item"><HeartIcon />{card.likes}</span>
        <span className="card-meta-item"><ChatIcon />{card.cmt}</span>
      </div>
    </article>
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

  const handleReset = () => {
    setAbv(""); setBase(""); setTheme("");
    setRangeMin(2); setRangeMax(10); setSearch("");
  };

  const filterProps = {
    abv, base, theme, ibaOnly: false, rangeMin, rangeMax, search,
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
    if (abv && card.abv !== abv) return false;
    if (base && card.base !== base) return false;
    if (theme && card.theme !== theme) return false;
    if (card.count < rangeMin || card.count > rangeMax) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!card.t.toLowerCase().includes(q) && !card.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <>
      <ChallengeBanner />

      <div className="page-wrap">
        <FilterBar {...filterProps} />

        <div className="new-cocktail-section">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-title-bar" />
              <h3 className="section-title">금주의 신규 칵테일</h3>
            </div>
            <button className="btn-more-text">
              더보기 <ChevronRightIcon />
            </button>
          </div>
          <div className="new-cocktail-row">
            {NEW_COCKTAILS.map((card, idx) => (
              <ChallengeCard key={idx} card={card} />
            ))}
          </div>
        </div>

        <section className="section-list">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-title-bar" />
              <h3 className="section-title">도전!마실랭 리스트</h3>
              <span className="section-subtitle">
                {filtered.length === CARDS.length ? "1,248개의 창작 레시피" : `${filtered.length}개의 검색 결과`}
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
              ? filtered.map((card, idx) => <ChallengeCard key={idx} card={card} />)
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
    </>
  );
}
