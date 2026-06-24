"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import "../css/MasilengHome.css";

import POOL_RAW from "../data/challenge_pool.json";
import CARDS_RAW from "../data/challenge_cards.json";
import { IMG_BASE, SORT_TABS } from "../data/constants.json";

import { HeartIcon, ChatIcon, ChevronRightIcon } from "./icons";
import FilterBar from "./FilterBar";

const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));
const CARDS = CARDS_RAW.map((c, i) => ({ ...c, _idx: i }));

const AVATAR_COLORS = [
  "#FFB3C6", "#B5EAD7", "#C4B5FD", "#BAD6F8",
  "#FEFDC1", "#FFCFC9", "#FFB700", "#C8E600",
  "#4ECDC4", "#87CEEB", "#2563EB", "#B0BEC5",
  "#607D8B", "#E63946", "#F472B6", "#9C27B0",
  "#FED7AA", "#A7F3D0", "#FCA5A5", "#93C5FD",
];
const AVATAR_IMGS = [
  "profile_img",
  ...Array.from({ length: 27 }, (_, i) => `profile_img-${i + 1}`),
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function UserAvatar({ username, size = 28, overrideBg, overrideImg }) {
  const h = hashStr(username);
  const bg = overrideBg ?? AVATAR_COLORS[h % AVATAR_COLORS.length];
  const img = overrideImg ?? AVATAR_IMGS[(h >> 4) % AVATAR_IMGS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, overflow: "hidden", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img
        src={`/character_illust/profile_img/${img}.png`}
        alt={username}
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }}
      />
    </div>
  );
}

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
      const d = POOL[s.i];
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
              title={d.n}
              className="challenge-main-banner-scatter-item challenge-main-banner-thumb"
              style={{
                left,
                top: y,
                width: w,
                height: h,
                background: d.g,
                animationDelay: `${idx * 55}ms`,
              }}
            >
              <img
                src={d.url}
                alt={d.n}
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

function ChallengeCard({ card, currentUser }) {
  const d = POOL[card.i];
  const [dropOpen, setDropOpen] = useState(false);
  const wrapRef = useRef(null);

  const userCards = CARDS.filter((c) => c.u === card.u);
  const isMe = currentUser && (currentUser.profileName || currentUser.name) === card.u;

  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropOpen]);

  return (
    <div className="relative flex flex-col" ref={wrapRef}>
      <Link href={`/challenge/${card._idx}`} style={{ textDecoration: "none" }}>
        <article className="common-card-item cursor-pointer">
          <div className="common-card-item-img-wrap common-card-item-img-wrap--cover">
            <div className="common-card-item-bg" style={{ background: d.g }} />
            <img
              src={d.url}
              alt={d.n}
              className="common-card-item-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="common-card-item-overlay" />
            <button
              className={`common-card-item-author${dropOpen ? " common-card-item-author--open" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropOpen((v) => !v);
              }}
            >
              <UserAvatar
                username={card.u}
                size={28}
                overrideBg={isMe ? (currentUser.profileBg ?? AVATAR_COLORS[0]) : undefined}
                overrideImg={isMe ? (currentUser.profileImg ?? AVATAR_IMGS[0]) : undefined}
              />
              <span className="common-card-item-author-name">{card.u}</span>
            </button>
            <div className="common-card-item-desc-layer">
              <p className="common-card-item-desc">{card.desc}</p>
            </div>
          </div>
          <h4 className="common-title-lg">{card.t}</h4>
          <div className="common-card-item-meta">
            <span className="common-card-item-meta-item">
              <HeartIcon />
              {card.likes}
            </span>
            <span className="common-card-item-meta-item">
              <ChatIcon />
              {card.cmt}
            </span>
          </div>
        </article>
      </Link>

      {dropOpen && (
        <div className="common-card-item-author-dropdown">
          <p className="common-card-item-author-dropdown-header">@{card.u}의 레시피</p>
          {userCards.map((uc) => (
            <Link
              key={uc._idx}
              href={`/challenge/${uc._idx}`}
              className="common-card-item-author-dropdown-item"
              onClick={() => setDropOpen(false)}
            >
              <span className="common-card-item-author-dropdown-name">{uc.t}</span>
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
    if (abv && card.abv !== abv) return false;
    if (base && card.base !== base) return false;
    if (theme && card.theme !== theme) return false;
    if (card.count < rangeMin || card.count > rangeMax) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !card.t.toLowerCase().includes(q) &&
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

        <section className="pb-12">
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
              <ChallengeCard
                key={card._idx}
                card={card}
                currentUser={currentUser}
              />
            ))}
          </div>
        </section>

        <section className="pb-12">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-title-bar" />
              <h3 className="section-title">도전!마실랭 리스트</h3>
              <span className="section-subtitle">
                {filtered.length === CARDS.length
                  ? "1,248개의 창작 레시피"
                  : `${filtered.length}개의 검색 결과`}
              </span>
            </div>
            <div className="section-sort">
              {SORT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSortTab(tab)}
                  className={`btn btn-sm ${sortTab === tab ? " btn-filled btn-gray-dark" : " btn-lined btn-gray-light"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="cocktail-grid">
            {filtered.length > 0 ? (
              filtered.map((card) => (
                <ChallengeCard
                  key={card._idx}
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
