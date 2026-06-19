"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CARDS from "../data/cards.json";
import CHALLENGE_CARDS from "../data/challenge_cards.json";
import POOL_RAW from "../data/challenge_pool.json";
import INGREDIENTS from "../data/ingredients.json";
import { IMG_BASE } from "../data/constants.json";
import SiteHeader from "../components/SiteHeader";
import "../css/mypage.css";

const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

const AVATAR_COLORS = [
  "#F34B65", "#FFC355", "#6C63FF", "#3ABEF9",
  "#52C87A", "#F98162", "#9B51E0",
];

const TABS = ["내 냉장고", "내 레시피", "좋아요"];

const CAT_EMOJI = {
  "술(강한 도수)": "🥃",
  "술(약한 도수)": "🍸",
  "음료수": "🥤",
  "주스": "🧃",
  "과일": "🍋",
  "기타": "🧪",
};

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [removedIds, setRemovedIds] = useState(new Set());
  const router = useRouter();

  const handleRemoveFridge = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setRemovedIds((prev) => new Set(prev).add(id));
      setRemovingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }, 450);
  };

  useEffect(() => {
    const s = localStorage.getItem("masileng_user");
    if (!s) { router.replace("/login"); return; }
    setUser(JSON.parse(s));
  }, [router]);

  if (!user) return null;

  const username = user.name;
  const charCode = username.charCodeAt(0);
  const avatarColor = AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  const initial = username[0];

  const myRecipes = CHALLENGE_CARDS
    .map((c, i) => ({ ...c, _id: i }))
    .filter((c) => c.u === username);

  const likedRecipes = CARDS.slice(0, 4).map((c, i) => ({ ...c, _id: i }));

  const myIngredients = INGREDIENTS.filter((ing) => ing.myIng);
  const fridgeItems = (myIngredients.length > 0 ? myIngredients : INGREDIENTS.slice(0, 12))
    .filter((ing) => !removedIds.has(ing.id));

  const tabCounts = [fridgeItems.length, myRecipes.length, likedRecipes.length];
  const totalLikes = myRecipes.reduce((s, c) => s + (c.likes || 0), 0);

  return (
    <>
      <SiteHeader />
      <div className="mypage-layout">
        {/* ── 좌측 사이드바 */}
        <aside>
          <div className="common-card mypage-sidebar-card">
            {/* 아바타 + 이름 */}
            <div className="mypage-profile-top">
              <div className="mypage-avatar-wrap">
                <div
                  className="mypage-avatar"
                  style={{ background: avatarColor }}
                >
                  {initial}
                </div>
              </div>
              <h1 className="mypage-username">{username}</h1>
              <p className="mypage-handle">
                @{username.toLowerCase().replace(/\s/g, "_")}
              </p>
              <button
                className="btn btn-sm btn-lined btn-gray-light mypage-profile-edit-btn"
                type="button"
              >
                <PencilIcon /> 프로필 편집
              </button>
            </div>

            {/* 통계 */}
            <div className="mypage-stats-row">
              <div className="mypage-stat-box">
                <span className="mypage-stat-value">{myRecipes.length}</span>
                <span className="mypage-stat-label">레시피</span>
              </div>
              <div className="mypage-stat-box">
                <span className="mypage-stat-value">
                  {totalLikes.toLocaleString()}
                </span>
                <span className="mypage-stat-label">받은 좋아요</span>
              </div>
              <div className="mypage-stat-box">
                <span className="mypage-stat-value">{fridgeItems.length}</span>
                <span className="mypage-stat-label">보유 재료</span>
              </div>
            </div>

            {/* 냉장고 재료 */}
            <div className="mypage-sidebar-fridge">
              <p className="common-title-sm">냉장고 재료</p>
              {fridgeItems.length > 0 ? (
                <div className="mypage-fridge-chips">
                  {fridgeItems.map((ing) => (
                    <span key={ing.id} className="common-tag">
                      {CAT_EMOJI[ing.cat] ?? "🧪"} {ing.n}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mypage-fridge-empty">보유 재료가 없어요.</p>
              )}
            </div>
          </div>
        </aside>

        {/* ── 우측 메인 */}
        <main className="mypage-main">
          <div className="common-card common-card--clip">
            {/* 탭 */}
            <div className="mypage-tabs">
              {TABS.map((tab, idx) => (
                <button
                  key={tab}
                  className={`mypage-tab-btn${activeTab === idx ? " active" : ""}`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab}
                  <span className="mypage-tab-count">{tabCounts[idx]}</span>
                </button>
              ))}
            </div>

            <div className="mypage-tab-content">
              {/* 내 냉장고 */}
              {activeTab === 0 &&
                (fridgeItems.length === 0 ? (
                  <div className="mypage-empty">
                    <span className="mypage-empty-icon">🧊</span>
                    <p className="mypage-empty-text">냉장고가 비어있어요.</p>
                  </div>
                ) : (
                  <>
                    <button
                      className="btn btn-lg btn-subfilled btn-brand mypage-shelf-cta"
                      type="button"
                    >
                      지금 갖고 있는 재료로 만들 수 있는 칵테일은? →
                    </button>
                    <div className="mypage-shelf-grid">
                      {fridgeItems.map((ing) => (
                        <Link
                          key={ing.id}
                          href={`/ingredient/${ing.id}`}
                          className={`mypage-shelf-card${removingIds.has(ing.id) ? " mypage-shelf-removing" : ""}`}
                        >
                          <div className="mypage-shelf-img-wrap">
                            <img
                              src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ing.en)}-Medium.png`}
                              alt={ing.n}
                              className="mypage-shelf-img"
                              onError={(e) => {
                                e.target.style.opacity = "0";
                              }}
                            />
                            <button
                              className="mypage-shelf-del-btn"
                              onClick={(e) => handleRemoveFridge(e, ing.id)}
                              title="냉장고에서 삭제"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width="16"
                                height="16"
                              >
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                          </div>
                          <div className="mypage-shelf-body">
                            <h4
                              className="common-title-md"
                              style={{ textAlign: "center",  }}
                            >
                              {ing.n}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ))}

              {/* 내 레시피 */}
              {activeTab === 1 &&
                (myRecipes.length === 0 ? (
                  <div className="mypage-empty">
                    <span className="mypage-empty-icon">🍹</span>
                    <p className="mypage-empty-text">
                      아직 등록한 레시피가 없어요.
                    </p>
                  </div>
                ) : (
                  <div className="mypage-recipe-list">
                    {myRecipes.map((card) => {
                      const poolImg = POOL[card.i % POOL.length];
                      return (
                        <Link
                          key={card._id}
                          href={`/challenge/${card._id}`}
                          className="mypage-recipe-item"
                        >
                          <div
                            className="mypage-recipe-thumb"
                            style={{ background: poolImg?.g }}
                          >
                            <img
                              src={poolImg?.url}
                              alt={card.t}
                              onError={(e) => {
                                e.target.src = "/theme.png";
                              }}
                            />
                          </div>
                          <div className="mypage-recipe-info">
                            <span className="mypage-recipe-name">{card.t}</span>
                            <span className="mypage-recipe-meta">
                              {card.base} · {card.theme}
                            </span>
                          </div>
                          <span className="mypage-recipe-likes">
                            ♥ {card.likes}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ))}

              {/* 좋아요 */}
              {activeTab === 2 &&
                (likedRecipes.length === 0 ? (
                  <div className="mypage-empty">
                    <span className="mypage-empty-icon">🤍</span>
                    <p className="mypage-empty-text">
                      좋아요한 레시피가 없어요.
                    </p>
                  </div>
                ) : (
                  <div className="mypage-recipe-list">
                    {likedRecipes.map((card) => (
                      <Link
                        key={card._id}
                        href={`/cocktail/${card._id}`}
                        className="mypage-recipe-item"
                      >
                        <div
                          className="mypage-recipe-thumb"
                          style={{ background: "var(--coral-soft)" }}
                        >
                          <img
                            src={`${IMG_BASE}${card.f ?? ""}.jpg`}
                            alt={card.t}
                            onError={(e) => {
                              e.target.src = "/theme.png";
                            }}
                          />
                        </div>
                        <div className="mypage-recipe-info">
                          <span className="mypage-recipe-name">{card.t}</span>
                          <span className="mypage-recipe-meta">
                            {card.base} · {card.theme}
                          </span>
                        </div>
                        <span className="mypage-recipe-likes">
                          ♥ {card.likes}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
