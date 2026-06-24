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
import IngredientCard from "../components/IngredientCard";
import { getCardTags } from "../data/detail-helpers";
import "../css/mypage.css";

const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

const AVATAR_COLORS = [
  "#F34B65", "#FFC355", "#6C63FF", "#3ABEF9",
  "#52C87A", "#F98162", "#9B51E0",
];

const PROFILE_BG_COLORS = [
  "#FFB3C6", "#B5EAD7", "#C4B5FD", "#BAD6F8",
  "#FEFDC1", "#FFCFC9", "#FFB700", "#C8E600",
  "#4ECDC4", "#87CEEB", "#2563EB", "#B0BEC5",
  "#607D8B", "#E63946", "#F472B6", "#9C27B0",
  "#FED7AA", "#A7F3D0", "#FCA5A5", "#93C5FD",
];

const PROFILE_IMGS = [
  "profile_img",
  ...Array.from({ length: 27 }, (_, i) => `profile_img-${i + 1}`),
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

function DiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="4" ry="4" fill="#fff"/>
      <circle cx="8" cy="8" r="1.2" fill="#222" stroke="none"/>
      <circle cx="16" cy="8" r="1.2" fill="#222" stroke="none"/>
      <circle cx="8" cy="16" r="1.2" fill="#222" stroke="none"/>
      <circle cx="16" cy="16" r="1.2" fill="#222" stroke="none"/>
      <circle cx="12" cy="12" r="1.2" fill="#222" stroke="none"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ProfileEditPopup({ user, onClose, onSave }) {
  const [name, setName] = useState(user.profileName || user.name);
  const [bgColor, setBgColor] = useState(PROFILE_BG_COLORS[0]);
  const [imgKey, setImgKey] = useState(PROFILE_IMGS[0]);
  const [activeTab, setActiveTab] = useState("img"); // "img" | "color"
  const [editingName, setEditingName] = useState(false);

  const handleRandomize = () => {
    setImgKey(PROFILE_IMGS[Math.floor(Math.random() * PROFILE_IMGS.length)]);
    setBgColor(PROFILE_BG_COLORS[Math.floor(Math.random() * PROFILE_BG_COLORS.length)]);
  };

  const handleSave = () => {
    onSave({ profileName: name.trim() || user.name, profileBg: bgColor, profileImg: imgKey });
  };

  return (
    <div className="common-popup-backdrop" onClick={onClose}>
      <div className="common-popup-modal popup-sm profile-edit-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── 상단 헤더 */}
        <div className="common-popup-header">
          <button className="profile-edit-topbar-btn" onClick={onClose} type="button">취소</button>
          <p className="common-title-lg">프로필 편집</p>
          <button className="profile-edit-topbar-btn profile-edit-topbar-btn--confirm" onClick={handleSave} type="button">확인</button>
        </div>

        {/* ── 프리뷰 + 닉네임 */}
        <div className="profile-edit-preview-row">
          <div className="profile-edit-hero-wrap">
            <div className="profile-edit-hero" style={{ background: bgColor }}>
              <img
                className="profile-edit-hero-img"
                src={`/character_illust/profile_img/${imgKey}.png`}
                alt="preview"
              />
            </div>
            <button className="profile-edit-dice-btn" type="button" onClick={handleRandomize} title="랜덤 선택">
              <DiceIcon />
            </button>
          </div>
          <div className="profile-edit-name-wrap">
            <input
              className="profile-edit-name-input"
              type="text"
              value={name}
              maxLength={9}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임 입력"
            />
            <span className="profile-edit-name-count">{name.length}/9</span>
          </div>
        </div>

        {/* ── 탭 */}
        <div className="profile-edit-tabs">
          <button
            className={`profile-edit-tab${activeTab === "img" ? " active" : ""}`}
            type="button"
            onClick={() => setActiveTab("img")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          <button
            className={`profile-edit-tab${activeTab === "color" ? " active" : ""}`}
            type="button"
            onClick={() => setActiveTab("color")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" stroke="currentColor"/>
              <path d="M12 3a9 9 0 0 1 0 18" fill="url(#grad)" stroke="none"/>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e"/>
                  <stop offset="50%" stopColor="#a855f7"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </button>
        </div>

        {/* ── 탭 콘텐츠 */}
        <div className="profile-edit-panel">
          {activeTab === "img" ? (
            <div className="profile-edit-img-grid">
              {PROFILE_IMGS.map((key) => (
                <button
                  key={key}
                  className={`profile-edit-img-btn${imgKey === key ? " selected" : ""}`}
                  onClick={() => setImgKey(key)}
                  type="button"
                >
                  <img src={`/character_illust/profile_img/${key}.png`} alt={key} />
                  {imgKey === key && <span className="profile-edit-img-check"><CheckIcon /></span>}
                </button>
              ))}
            </div>
          ) : (
            <div className="profile-edit-color-grid">
              {PROFILE_BG_COLORS.map((color) => (
                <button
                  key={color}
                  className={`profile-edit-color-swatch${bgColor === color ? " selected" : ""}`}
                  style={{ background: color }}
                  onClick={() => setBgColor(color)}
                  type="button"
                >
                  {bgColor === color && <CheckIcon />}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [removedIds, setRemovedIds] = useState(new Set());
  const [showCocktailList, setShowCocktailList] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
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

  const handleProfileSave = (updates) => {
    const next = { ...user, ...updates };
    setUser(next);
    localStorage.setItem("masileng_user", JSON.stringify(next));
    setShowEditPopup(false);
  };

  if (!user) return null;

  const username = user.profileName || user.name;
  const avatarColor = user.profileBg || PROFILE_BG_COLORS[0];
  const profileImg = user.profileImg || PROFILE_IMGS[0];

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
      {showEditPopup && (
        <ProfileEditPopup
          user={user}
          onClose={() => setShowEditPopup(false)}
          onSave={handleProfileSave}
        />
      )}
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
                  {profileImg
                    ? <img src={`/character_illust/profile_img/${profileImg}.png`} alt={username} className="mypage-avatar-img" />
                    : initial}
                </div>
              </div>
              <h1 className="mypage-username">{username}</h1>
              <p className="mypage-handle">
                @{username.toLowerCase().replace(/\s/g, "_")}
              </p>
              <button
                className="btn btn-sm btn-lined btn-gray-light mypage-profile-edit-btn"
                type="button"
                onClick={() => setShowEditPopup(true)}
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
          </div>

          {/* 광고 배너 */}
          <div className="ad-banner-test" style={{height:"256px", marginTop:"16px"}}>
            <p className="ad-banner-test__label">광고 배너</p>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
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
                      onClick={() => setShowCocktailList((v) => !v)}
                    >
                      {showCocktailList
                        ? "← 재료함으로 돌아가기"
                        : "지금 갖고 있는 재료로 만들 수 있는 칵테일은? →"}
                    </button>

                    {showCocktailList ? (
                      <div className="mypage-cocktail-list">
                        {[
                          {
                            label: "지금 바로 제작 가능", badge: "ready",
                            cards: CARDS.slice(0, 3).map((c, i) => ({ ...c, missing: [], _cardIdx: i })),
                          },
                          {
                            label: "재료 1개 부족", badge: "miss1",
                            cards: [
                              { ...CARDS[3], missing: ["데킬라"], _cardIdx: 3 },
                              { ...CARDS[4], missing: ["트리플 섹"], _cardIdx: 4 },
                              { ...CARDS[5], missing: ["진저 비어"], _cardIdx: 5 },
                            ],
                          },
                          {
                            label: "재료 2개 부족", badge: "miss2",
                            cards: [
                              { ...CARDS[6], missing: ["럼", "라임 주스"], _cardIdx: 6 },
                              { ...CARDS[7], missing: ["버번 위스키", "아마로"], _cardIdx: 7 },
                              { ...CARDS[8], missing: ["코코넛 크림", "파인애플 주스"], _cardIdx: 8 },
                            ],
                          },
                        ].map(({ label, badge, cards }) => (
                          <div key={badge} className="mypage-cocktail-group">
                            <p className={`mypage-cocktail-group-label mypage-cocktail-badge--${badge}`}>
                              {label}
                            </p>
                            <div className="mypage-recipe-list">
                              {cards.map((card, idx) => {
                                const poolImg = POOL[card.i % POOL.length];
                                return (
                                  <Link
                                    key={idx}
                                    href={`/cocktail/${card._cardIdx}`}
                                    className="common-list-item"
                                  >
                                    <div
                                      className="common-list-item-thumb mypage-recipe-thumb"
                                      style={{ background: poolImg?.g }}
                                    >
                                      <img
                                        src={poolImg?.url}
                                        alt={card.t}
                                        onError={(e) => { e.target.src = "/theme.png"; }}
                                      />
                                    </div>
                                    <div className="common-list-item-info">
                                      <span className="common-list-item-title">{card.t}</span>
                                      <span className="common-list-item-desc">{card.desc}</span>
                                      <div className="common-list-item-tags">
                                        {getCardTags(card).map((tag) => (
                                          <span key={tag} className={`common-list-item-tag${tag === "#IBA" ? " tag-iba" : ""}`}>{tag}</span>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="common-list-item-action">
                                      {card.missing.length > 0 ? (
                                        card.missing.map((item) => (
                                          <button
                                            key={item}
                                            className="btn btn-xxs btn-subfilled btn-brand"
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              window.open(`https://www.coupang.com/np/search?q=${encodeURIComponent(item)}`, "_blank");
                                            }}
                                          >
                                            {item}
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                            </svg>
                                          </button>
                                        ))
                                      ) : (
                                        <span className="mypage-cocktail-ready-badge">제작 가능</span>
                                      )}
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="cocktail-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                        {fridgeItems.map((ing) => (
                          <IngredientCard
                            key={ing.id}
                            ing={ing}
                            isRemoving={removingIds.has(ing.id)}
                            onAction={handleRemoveFridge}
                            actionIcon={
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            }
                            actionTitle="냉장고에서 삭제"
                            imgHeight="200px"
                            titleSize="md"
                            titleCenter
                            actionBtnClassName="mypage-shelf-del-btn"
                          />
                        ))}
                      </div>
                    )}
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
                          className="common-list-item"
                        >
                          <div
                            className="common-list-item-thumb mypage-recipe-thumb"
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
                          <div className="common-list-item-info">
                            <span className="common-list-item-title">{card.t}</span>
                            <span className="common-list-item-desc">{card.desc}</span>
                            <div className="common-list-item-tags">
                              {getCardTags(card).map((tag) => (
                                <span key={tag} className={`common-list-item-tag${tag === "#IBA" ? " tag-iba" : ""}`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="common-list-item-action">
                            <span className="mypage-recipe-likes">♥ {card.likes}</span>
                          </div>
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
                    {likedRecipes.map((card) => {
                      const poolImg = POOL[card.i % POOL.length];
                      return (
                      <Link
                        key={card._id}
                        href={`/cocktail/${card._id}`}
                        className="common-list-item"
                      >
                        <div
                          className="common-list-item-thumb mypage-recipe-thumb"
                          style={{ background: poolImg?.g }}
                        >
                          <img
                            src={poolImg?.url}
                            alt={card.t}
                            onError={(e) => { e.target.src = "/theme.png"; }}
                          />
                        </div>
                        <div className="common-list-item-info">
                          <span className="common-list-item-title">{card.t}</span>
                          <span className="common-list-item-desc">{card.desc}</span>
                          <div className="common-list-item-tags">
                            {getCardTags(card).map((tag) => (
                              <span key={tag} className={`common-list-item-tag${tag === "#IBA" ? " tag-iba" : ""}`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="common-list-item-action">
                          <span className="mypage-recipe-likes">♥ {card.likes}</span>
                        </div>
                      </Link>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
