"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import "../css/MasilengHome.css";

import POOL_RAW      from "../data/challenge_pool.json";
import CARDS_RAW     from "../data/challenge_cards.json";
import { IMG_BASE, SORT_TABS } from "../data/constants.json";

import { HeartIcon, ChatIcon, ChevronRightIcon } from "./icons";
import FilterBar from "./FilterBar";

const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));
const CARDS = CARDS_RAW.map((c, i) => ({ ...c, _idx: i }));

const NEW_COCKTAILS = CARDS.slice(-6).reverse();

// 스캐터 배치 설정 (challenge pool 인덱스 기준)
const SCATTER = [
  { x: 24,  y: 96,  w: 150, h: 150, i: 0  },
  { x: 190, y: 168, w: 152, h: 152, i: 1  },
  { x: 14,  y: 264, w: 160, h: 200, i: 4  },
  { x: 198, y: 344, w: 148, h: 148, i: 6  },
  { x: 40,  y: 484, w: 150, h: 150, i: 10 },
  { x: 206, y: 514, w: 150, h: 118, i: 12 },
  { r: 24,  y: 96,  w: 150, h: 150, i: 7  },
  { r: 190, y: 160, w: 152, h: 152, i: 3  },
  { r: 18,  y: 266, w: 158, h: 198, i: 11 },
  { r: 200, y: 346, w: 148, h: 148, i: 9  },
  { r: 38,  y: 486, w: 150, h: 150, i: 5  },
  { r: 206, y: 516, w: 150, h: 118, i: 13 },
];

function ChallengeHero() {
  const [items, setItems] = useState([]);

  const compute = useCallback(() => {
    const W = Math.min(1480, window.innerWidth);
    const offset = (window.innerWidth - W) / 2;
    return SCATTER.map((s, idx) => {
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
    <div className="hero">
      <div className="hero-bg" />
      <div className="hero-scatter-layer">
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
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          나만의 창작 레시피를<br />
          <span className="hero-accent">지금 등록해보세요</span>
        </h1>
        <p className="hero-subtitle">
          직접 만든 레시피를 공유하고 다른 바텐더들에게<br />나만의 칵테일을 선보여보세요.
        </p>
        <div className="hero-cta">
          <button className="btn-cta btn-cta-primary">내 레시피 등록하기</button>
          <button className="btn-cta btn-cta-secondary">레시피 둘러보기</button>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ card }) {
  const d = POOL[card.i];
  const [dropOpen, setDropOpen] = useState(false);
  const wrapRef = useRef(null);

  const userCards = CARDS.filter((c) => c.u === card.u);

  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropOpen]);

  return (
    <div className="card-wrap" ref={wrapRef}>
      <Link href={`/challenge/${card._idx}`} style={{ textDecoration: "none" }}>
        <article className="card">
          <div className="card-img-wrap">
            <div className="card-bg" style={{ background: d.g }} />
            <img src={d.url} alt={d.n} className="card-img"
              onError={(e) => { e.target.style.display = "none"; }} />
            <div className="card-overlay" />
            <button
              className={`card-author${dropOpen ? " card-author--open" : ""}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDropOpen((v) => !v); }}
            >
              <img src="/userProfile.png" alt={card.u} className="card-author-profile-img" />
              <span className="card-author-name">{card.u}</span>
            </button>
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
      </Link>

      {dropOpen && (
        <div className="card-author-dropdown">
          <p className="card-author-dropdown-header">@{card.u}의 레시피</p>
          {userCards.map((uc) => (
            <Link
              key={uc._idx}
              href={`/challenge/${uc._idx}`}
              className="card-author-dropdown-item"
              onClick={() => setDropOpen(false)}
            >
              <span className="card-author-dropdown-name">{uc.t}</span>
              <ChevronRightIcon />
            </Link>
          ))}
        </div>
      )}
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
      <ChallengeHero />

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
            {NEW_COCKTAILS.map((card) => (
              <ChallengeCard key={card._idx} card={card} />
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
              ? filtered.map((card) => <ChallengeCard key={card._idx} card={card} />)
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
