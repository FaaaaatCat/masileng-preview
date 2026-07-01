"use client";
import NoticeBanner from '../components/NoticeBanner';
import CocktailForm from '../components/CocktailForm';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "../css/cocktail-detail.css";

import COCKTAILS from "../data/cocktails.json";
import INGREDIENTS from "../data/ingredients.json";
import { getCardDetail, getCardTags } from "../data/detail-helpers.js";
import SiteHeader from "../components/SiteHeader";
import ProfileAvatar from "../components/ProfileAvatar";
import {
  ChevronRightIcon,
  ArrowLeftIcon,
  ShareIcon,
  FlameIcon,
  TagIcon,
  EditIcon,
  TrashIcon,
  SwapIcon,
  PlusIcon,
  ExpandIcon,
  ChevronLeftIcon,
  XIcon,
} from "../components/icons";

// 재료명 → ingredients.json 항목 매핑
const ING_MAP = new Map(INGREDIENTS.map((i) => [i.n, i]));

// ─ 테마 배경 매핑 ─
const THEME_BG_MAP = {
  Sour: "Property 1=sour.png",
  Party: "Property 1=party.png",
  Sparkling: "Property 1=sparkling.png",
  City: "Property 1=city.png",
  Tropical: "Property 1=tropical.png",
  Fruity: "Property 1=frutiy.png",
  Creamy: "Property 1=creamy.png",
  Hot: "Property 1=hot.png",
};


const THEME_SILHOUETTE = {
  sour: "sour",
  party: "party",
  creamy: "creamy",
  sparkling: "sparkling",
  city: "city",
  tropical: "tropical",
  fruity: "fruity",
  hot: "hot",
};

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function ThemePattern({ silhouette }) {
  const SIZE = 308;
  const COLS = 14;
  const ROWS = 2;

  const tiles = [];
  const seed0 = silhouette.charCodeAt(0);
  for (let row = 0; row < ROWS; row++) {
    const offsetX = row % 2 === 1 ? SIZE / 2 : 0;
    for (let col = 0; col < COLS; col++) {
      // 두 개의 독립 난수로 판단해 연속 제거가 덜 생기도록
      const r1 = seededRand(seed0 * 7 + row * 31 + col * 13);
      const r2 = seededRand(seed0 * 3 + row * 17 + col * 29 + 5);
      if (r1 < 0.55 && r2 < 0.73) continue;
      tiles.push({
        key: `${row}-${col}`,
        left: col * SIZE + offsetX - SIZE / 2,
        bottom: row * SIZE,
      });
    }
  }

  return (
    <div className="detail-theme-pattern">
      {tiles.map(({ key, left, bottom }) => (
        <img
          key={key}
          src={`/theme/silhouette/${silhouette}.svg`}
          alt=""
          style={{ left, bottom }}
          draggable={false}
        />
      ))}
    </div>
  );
}

// ─ icons ─
const HeartIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.4 3.5-6.4 3.5z" />
  </svg>
);

function parseMl(amount) {
  const m = amount?.match(/^(\d+(?:\.\d+)?)ml$/i);
  return m ? parseFloat(m[1]) : 0;
}

function computeRatios(ingredients) {
  const mls = ingredients.map((ing) => parseMl(ing.amount));
  const total = mls.reduce((a, b) => a + b, 0);
  if (total === 0) return ingredients.map(() => null);
  return mls.map((v) => (v > 0 ? Math.round((v / total) * 100) : null));
}

function FlavorDots({ value, max = 5 }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`flavor-dot${i < value ? " filled" : ""}`} />
      ))}
    </div>
  );
}

/* 헤더 – MasilengHome과 동일 구조 */

const CHALLENGE_CARDS = COCKTAILS.filter((c) => !c.official);

const FIRST_BG = "#FFB3C6";
const FIRST_IMG = "profile_img";

function CommentAvatar({ user, size = 32 }) {
  const bg = user?.profileBg || FIRST_BG;
  const img = user?.profileImg || FIRST_IMG;
  return (
    <div
      className="profile-avatar-wrap"
      style={{ width: size, height: size, background: bg }}
    >
      <img src={`/character_illust/profile_img/${img}.png`} alt={user?.profileName || user?.name || "guest"} />
    </div>
  );
}

export default function CocktailDetail({
  card,
  cardId,
  backHref = "/",
  showIllust = true,
  isOfficial = false,
}) {
  const [liked, setLiked] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [lightbox, setLightbox] = useState(null); // null | index
  const [unitMode, setUnitMode] = useState("ml");
  const [authorDropOpen, setAuthorDropOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const authorRef = useRef(null);

  // ── 편집 모드 state
  const [isEditing, setIsEditing] = useState(false);
  const [overrideData, setOverrideData] = useState(null);
  const [editInitialValues, setEditInitialValues] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem("masileng_user");
    if (s) setCurrentUser(JSON.parse(s));
  }, []);

  const handleCommentDelete = (id) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCommentEditSave = (id) => {
    if (!editingText.trim()) return;
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: editingText.trim() } : c)),
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleCommentSubmit = () => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: currentUser,
      text: commentText.trim(),
      time: new Date().toLocaleString("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setComments((prev) => [...prev, newComment]);
    setCommentText("");
  };

  const isMyRecipe =
    !isOfficial &&
    currentUser &&
    (currentUser.profileName || currentUser.name) === card.user;

  const startEditing = () => {
    const cardSrc = getCardDetail({ ...card, ...overrideData });
    setEditInitialValues({
      title:        overrideData?.title        ?? card.name,
      desc:         overrideData?.desc         ?? card.desc,
      abv:          overrideData?.abv          ?? card.abv,
      base:         overrideData?.base         ?? card.base,
      theme:        overrideData?.theme        ?? card.theme,
      diffMode:     overrideData?.diffMode     ?? 'ai',
      difficulty:   overrideData?.difficulty   ?? 0,
      photoPreview: overrideData?.photoPreview ?? null,
      ingredients: (overrideData?.ingredients ?? cardSrc.ingredients).map((ing, i) => {
        const raw = ing.amount ?? '';
        if (raw === '적당량') return { id: i + 1, name: ing.name, amount: '', unit: '적당량' };
        const unit   = raw.replace(/^[d.]+s*/, '') || 'ml';
        const amount = raw.replace(/[^0-9.]/g, '');
        return { id: i + 1, name: ing.name, amount, unit };
      }),
      steps: (overrideData?.steps ?? cardSrc.steps).map((s, i) => ({
        id: i + 1,
        text: typeof s === 'string' ? s : s.text,
      })),
    });
    setIsEditing(true);
  };

  const saveEditing = (data) => {
    setOverrideData(data);
    setIsEditing(false);
  };
  useEffect(() => {
    if (!authorDropOpen) return;
    const handler = (e) => {
      if (authorRef.current && !authorRef.current.contains(e.target))
        setAuthorDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [authorDropOpen]);

  const displayCard = overrideData
    ? {
        ...card,
        name: overrideData.title,
        desc: overrideData.desc,
        abv: overrideData.abv,
        base: overrideData.base,
        theme: overrideData.theme,
      }
    : card;
  const {
    ingredients: derivedIngredients,
    steps: derivedSteps,
    flavor,
    abvLabel,
    difficulty,
  } = getCardDetail(displayCard);
  const ingredients = overrideData?.ingredients ?? derivedIngredients;
  const steps =
    overrideData?.steps?.map((s) => (typeof s === "string" ? s : s)) ??
    derivedSteps;
  const tags = getCardTags(displayCard);
  const ratios = computeRatios(ingredients);

  const thumbImgs = [card.photo_0, card.photo_1, card.photo_2].filter(Boolean);
  const activeImg = thumbImgs[activeThumb] ?? thumbImgs[0];

  const difficultyClass =
    difficulty === "아주 간단"
      ? "easy"
      : difficulty === "쉬움"
        ? "easy"
        : difficulty === "보통"
          ? "medium"
          : difficulty === "중급"
            ? "medium"
            : "hard";

  // 영문명: desc 에서 추출, 없으면 pool 이미지명

  // ── 편집 모드 렌더
  if (isEditing) return (
    <CocktailForm
      mode="edit"
      initialValues={editInitialValues}
      existingPhoto={card.photo_0}
      onSubmit={saveEditing}
      onCancel={() => setIsEditing(false)}
    />
  );

  return (
    <>
      <NoticeBanner />
      <SiteHeader />

      <div
        className="detail-page"
        style={
          card.theme
            ? { background: `var(--page-${card.theme.toLowerCase()})` }
            : undefined
        }
      >
        {card.theme && THEME_SILHOUETTE[card.theme.toLowerCase()] && (
          <ThemePattern
            silhouette={THEME_SILHOUETTE[card.theme.toLowerCase()]}
          />
        )}
        <div className="detail-inner">
          <div className="detail-grid">
            {/* ── 왼쪽: 뒤로가기 + 이미지 갤러리 ── */}
            <div className="detail-left">
              {/* 1. 뒤로가기 버튼 – detail-left 첫 번째 자식 */}
              <Link href="/" className="detail-back-btn">
                <ArrowLeftIcon />
                목록으로
              </Link>

              <div className="detail-gallery-main" style={undefined}>
                <img
                  src={
                    activeThumb === 0 && overrideData?.photoPreview
                      ? overrideData.photoPreview
                      : activeImg
                  }
                  alt={card.name}
                  onClick={() => setLightbox(activeThumb)}
                  onError={(e) => {
                    e.target.src = "/theme.png";
                  }}
                />
                <button
                  className="detail-gallery-expand"
                  onClick={() => setLightbox(activeThumb)}
                  aria-label="확대"
                >
                  <ExpandIcon />
                </button>
              </div>
              {showIllust && (
                <div
                  className={`grid gap-2 h-[80px]`}
                  style={{
                    gridTemplateColumns: `repeat(${thumbImgs.length}, 1fr)`,
                  }}
                >
                  {thumbImgs.map((url, idx) => (
                    <div
                      key={idx}
                      className={`detail-thumb${activeThumb === idx ? " active" : ""}`}
                      onClick={() => setActiveThumb(idx)}
                    >
                      <img
                        src={url}
                        alt=""
                        onError={(e) => {
                          e.target.src = "/theme.png";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {isMyRecipe && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-subfilled btn-brand btn-lg"
                    style={{ flex: 1 }}
                    onClick={startEditing}
                  >
                    <EditIcon />
                    수정하기
                  </button>
                  <button
                    className="btn btn-subfilled btn-gray-light btn-lg"
                    style={{ flex: 1 }}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <TrashIcon />
                    삭제하기
                  </button>
                </div>
              )}

              {showDeleteConfirm && (
                <div
                  className="common-popup-backdrop"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <div
                    className="common-popup-modal popup-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="common-popup-header">
                      <h2 className="common-title-lg">레시피 삭제</h2>
                    </div>
                    <div className="common-popup-body" style={{ gap: 12 }}>
                      <p
                        className="common-body-md-light"
                        style={{ color: "var(--font-sub)" }}
                      >
                        정말 이 레시피를 삭제할까요?
                        <br />
                        삭제 후에는 복구할 수 없어요.
                      </p>
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button
                          className="btn btn-lined btn-gray-light btn-md"
                          style={{ flex: 1 }}
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          취소
                        </button>
                        <button
                          className="btn btn-filled btn-red btn-md"
                          style={{ flex: 1 }}
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            alert("삭제 기능은 준비 중이에요.");
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── 오른쪽: 정보 ── */}
            <div className="detail-right">
              {/* 기본 정보 카드 */}
              <div className="common-card">
                <div className="common-card-inner">
                  <div className="flex items-center gap-2.5">
                    {/* 테마 배경 + 칵테일 일러스트 */}
                    <div className="size-20 overflow-hidden shrink-0 relative">
                      {THEME_BG_MAP[card.theme] && (
                        <img
                          className="detail-cocktail-icon-bg"
                          src={`/theme/${encodeURIComponent(THEME_BG_MAP[card.theme])}`}
                          alt=""
                        />
                      )}
                      {showIllust && card.cocktail_illust && (
                        <img
                          className="detail-cocktail-icon-illust"
                          src={card.cocktail_illust}
                          alt={card.name}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="detail-cocktail-name">{displayCard.name}</h1>
                    </div>
                    <button
                      className={`btn btn-md ${liked ? " btn-subfilled btn-brand" : "btn-lined btn-gray-light"}`}
                      style={{ borderRadius: "var(--r-full)" }}
                      onClick={() => setLiked((v) => !v)}
                    >
                      <HeartIcon filled={liked} />
                      좋아요 {card.likes + (liked ? 1 : 0)}
                    </button>
                    <button
                      className="btn btn-lined btn-gray-light"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "var(--r-full)",
                        padding: 0,
                        flexShrink: 0,
                      }}
                      onClick={() =>
                        navigator.share?.({
                          title: card.name,
                          url: window.location.href,
                        })
                      }
                      aria-label="공유하기"
                    >
                      <ShareIcon />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        className="btn btn-subfilled btn-gray-light btn-xs"
                        style={{ borderRadius: "var(--r-full)" }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <p
                    className="common-body-lg-light"
                    style={{ color: "var(--font-sub)" }}
                  >
                    {displayCard.desc}
                  </p>

                  {/* 맛 프로필 도트 박스 */}
                  <div className="detail-flavor-box">
                    {[
                      { label: "당도", val: flavor.sweet },
                      { label: "산미", val: flavor.sour },
                      { label: "쌉쌀함", val: flavor.bitter },
                      { label: "바디감", val: flavor.body },
                    ].map(({ label, val }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 h-[18px]"
                      >
                        <span className="detail-flavor-label">{label}</span>
                        <FlavorDots value={val} />
                      </div>
                    ))}
                  </div>

                  {/* 5 & 7. 마실랭 공식: 브랜드색 + 흰M, 일반: userProfile.png */}
                  <div className="relative" ref={authorRef}>
                    <button
                      className={[
                        !isOfficial && !card.iba && "detail-author--clickable",
                        authorDropOpen && "detail-author--open",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => {
                        if (!isOfficial && !card.iba)
                          setAuthorDropOpen((v) => !v);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor:
                          !isOfficial && !card.iba ? "pointer" : "default",
                        font: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div className="size-10 rounded-full overflow-hidden shrink-0">
                        {isOfficial || card.iba ? (
                          <span className="detail-author-avatar-official">
                            M
                          </span>
                        ) : (
                          <ProfileAvatar user={currentUser} size={40} />
                        )}
                      </div>
                      <span className="detail-author-name">
                        {isOfficial || card.iba
                          ? "마실랭 공식"
                          : card.user + "님의 레시피"}
                      </span>
                      {!isOfficial && !card.iba && (
                        <span
                          className={`detail-author-chevron${authorDropOpen ? " detail-author-chevron--up" : ""}`}
                        >
                          <ChevronRightIcon />
                        </span>
                      )}
                    </button>
                    {authorDropOpen &&
                      (() => {
                        const userCards = CHALLENGE_CARDS.filter(
                          (c) => c.user === card.user,
                        );
                        return (
                          <div className="detail-author-dropdown">
                            <p className="detail-author-dropdown-header">
                              @{card.user}의 레시피
                            </p>
                            {userCards.map((uc) => (
                              <Link
                                key={uc.id}
                                href={`/challenge/${uc.id}`}
                                className="detail-author-dropdown-item"
                                onClick={() => setAuthorDropOpen(false)}
                              >
                                {uc.photo_0 && (
                                  <div
                                    className="size-10 rounded-[10px] overflow-hidden shrink-0"
                                    style={{ background: uc.gradient }}
                                  >
                                    <img
                                      src={uc.photo_0}
                                      alt={uc.name}
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                                <span className="flex-1 min-w-0 truncate">
                                  {uc.name}
                                </span>
                                <ChevronRightIcon />
                              </Link>
                            ))}
                          </div>
                        );
                      })()}
                  </div>
                </div>
                {/* common-card-inner */}
              </div>

              {/* 스탯 row */}
              <div className="flex flex-row gap-2">
                {[
                  { icon: <FlameIcon />, label: "도수", value: abvLabel },
                  {
                    icon: <TagIcon />,
                    label: "테마",
                    value: card.theme ?? "—",
                  },
                  {
                    icon: <StarIcon />,
                    label: "난이도",
                    value: difficulty,
                    valueClass: `detail-stat-badge ${difficultyClass}`,
                  },
                ].map(({ icon, label, value, valueClass }) => (
                  <div className="common-card flex-1" key={label}>
                    <div className="common-card-inner justify-center">
                      <div className="flex items-center gap-2">
                        <div className="detail-stat-icon">{icon}</div>
                        <span className="common-body-sm-bold">{label}</span>
                        <div style={{ flex: 1 }}></div>
                        <span className={valueClass ?? "common-title-md"}>
                          {value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 재료 카드 */}
              <div className="common-card">
                <div className="common-card-header common-card-header--spread">
                  <h2 className="common-title-md">재료 정보</h2>
                  <button
                    className="btn btn-sm btn-lined btn-gray-light"
                    onClick={() =>
                      setUnitMode((v) => (v === "ml" ? "ratio" : "ml"))
                    }
                  >
                    <SwapIcon />
                    단위 변경
                  </button>
                </div>
                <div className="common-card-inner">
                  <div className="flex flex-col gap-5">
                    {[...ingredients]
                      .sort((a, b) => {
                        const SUB = ["민트잎", "오렌지 필", "올리브"];
                        return SUB.includes(a.name) - SUB.includes(b.name);
                      })
                      .map((ing, idx) => {
                        const ratio = ratios[ingredients.indexOf(ing)];
                        const ingData = ING_MAP.get(ing.name);
                        const ingId = ingData?.id;
                        const isSub = [
                          "민트잎",
                          "오렌지 필",
                          "올리브",
                        ].includes(ing.name);
                        const inner = (
                          <>
                            <div
                              className="detail-ing-emoji"
                              style={
                                isSub
                                  ? { background: "var(--purple-soft)", border: "1.5px solid var(--purple-line)" }
                                  : !ingData?.photo
                                  ? { background: "var(--gray-soft, #e5e7eb)", color: "var(--font-placeholder)", fontSize: "16px" }
                                  : undefined
                              }
                            >
                              {ingData?.photo ? (
                                <img
                                  src={ingData.photo}
                                  alt={ing.name}
                                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                  onError={(e) => { e.target.replaceWith(Object.assign(document.createTextNode("?"))); }}
                                />
                              ) : "?"}
                            </div>
                            <span className="detail-ing-name">{ing.name}</span>
                            <span className="detail-ing-type">{ing.type}</span>
                            {ratio !== null && (
                              <span className="detail-ing-ratio-val">
                                {ratio}%
                              </span>
                            )}
                            {isSub && (
                              <span className="detail-ing-sub-label">
                                부재료
                                <span className="detail-ing-sub-tooltip-wrap">
                                  <span className="detail-ing-sub-tooltip-btn">
                                    ?
                                  </span>
                                  <span className="detail-ing-sub-tooltip-box">
                                    없어도 되지만 있으면 좋은 재료
                                  </span>
                                </span>
                              </span>
                            )}
                            <span className="detail-ing-amount">
                              {ing.amount}
                            </span>
                          </>
                        );
                        return ingId ? (
                          <Link
                            key={idx}
                            href={`/ingredient/${ingId}`}
                            className="flex items-center gap-4 no-underline detail-ing-item--link"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <div key={idx} className="flex items-center gap-4">
                            {inner}
                          </div>
                        );
                      })}
                  </div>
                </div>
                {/* common-card-inner */}
              </div>

              {/* 광고 배너 */}
              <div className="ad-banner-test">Google 광고 배너</div>

              {/* 레시피 카드 */}
              <div className="common-card">
                <div className="common-card-header common-card-header--spread">
                  <h2 className="common-title-md">만드는 방법</h2>
                  {isOfficial && (
                    <button
                      className="btn btn-sm btn-lined btn-gray-light"
                      onClick={() =>
                        window.open(
                          `https://www.youtube.com/results?search_query=${encodeURIComponent(card.name + " 칵테일 만들기")}`,
                          "_blank",
                        )
                      }
                    >
                      <YoutubeIcon />
                      유튜브로 보기
                    </button>
                  )}
                </div>
                <div className="common-card-inner">
                  <div className="flex flex-col">
                    {steps.map((step, idx) => (
                      <div key={idx} className="detail-step-item">
                        <div className="detail-step-num">{idx + 1}</div>
                        <p className="detail-step-text">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* common-card-inner */}
              </div>

              {/* 댓글 카드 */}
              <div className="common-card">
                <div className="common-card-header">
                  <h2 className="common-title-md">
                    댓글{" "}
                    {comments.length > 0 && (
                      <span style={{ color: "var(--coral)", fontWeight: 700 }}>
                        {comments.length}
                      </span>
                    )}
                  </h2>
                </div>
                <div className="common-card-inner">
                  {comments.length === 0 ? (
                    <p className="detail-comment-empty">
                      아직 댓글이 없어요. 첫 댓글을 남겨보세요!
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4 mb-1">
                      {comments.map((c) => {
                        const isMyComment =
                          currentUser &&
                          (currentUser.profileName || currentUser.name) ===
                            (c.user.profileName || c.user.name);
                        const isEditing = editingId === c.id;
                        return (
                          <div key={c.id} className="flex gap-2.5 items-start">
                            <CommentAvatar user={c.user} size={32} />
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="detail-comment-author">
                                  {c.user.profileName || c.user.name}
                                </span>
                                <span className="detail-comment-time">
                                  {c.time}
                                </span>
                                {isMyComment && !isEditing && (
                                  <div className="flex gap-1.5 ml-auto">
                                    <button
                                      className="detail-comment-action-btn"
                                      onClick={() => {
                                        setEditingId(c.id);
                                        setEditingText(c.text);
                                      }}
                                    >
                                      수정
                                    </button>
                                    <button
                                      className="detail-comment-action-btn detail-comment-action-delete"
                                      onClick={() => handleCommentDelete(c.id)}
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                              {isEditing ? (
                                <div className="flex gap-1.5 items-center">
                                  <input
                                    className="detail-comment-input"
                                    value={editingText}
                                    onChange={(e) =>
                                      setEditingText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleCommentEditSave(c.id);
                                      if (e.key === "Escape") {
                                        setEditingId(null);
                                        setEditingText("");
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <button
                                    className="btn btn-filled btn-brand btn-sm"
                                    style={{
                                      borderRadius: "var(--r-full)",
                                      whiteSpace: "nowrap",
                                    }}
                                    onClick={() => handleCommentEditSave(c.id)}
                                  >
                                    저장
                                  </button>
                                  <button
                                    className="btn btn-lined btn-gray-light btn-sm"
                                    style={{
                                      borderRadius: "var(--r-full)",
                                      whiteSpace: "nowrap",
                                    }}
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditingText("");
                                    }}
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <p className="detail-comment-text">{c.text}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div
                    className="flex items-center gap-2.5 border-t border-[var(--ui-line-light)]"
                    style={{ marginTop: 16, paddingTop: 16 }}
                  >
                    <CommentAvatar user={currentUser} size={32} />
                    <input
                      className="detail-comment-input"
                      type="text"
                      placeholder="댓글을 입력하세요..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommentSubmit();
                      }}
                    />
                    <button
                      className="btn btn-filled btn-brand btn-md"
                      style={{ borderRadius: "var(--r-full)" }}
                      onClick={handleCommentSubmit}
                    >
                      등록
                    </button>
                  </div>
                </div>
              </div>

              {/* 로그인 필요 팝업 */}
              {showLoginPopup && (
                <div
                  className="common-popup-backdrop"
                  onClick={() => setShowLoginPopup(false)}
                >
                  <div
                    className="common-popup-modal popup-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="common-popup-header">
                      <h2 className="common-title-lg">로그인이 필요해요</h2>
                    </div>
                    <div className="common-popup-body" style={{ gap: 12 }}>
                      <p
                        className="common-body-md-light"
                        style={{ color: "var(--font-sub)" }}
                      >
                        댓글을 작성하려면 로그인이 필요합니다.
                      </p>
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button
                          className="btn btn-lined btn-gray-light btn-md"
                          style={{ flex: 1 }}
                          onClick={() => setShowLoginPopup(false)}
                        >
                          취소
                        </button>
                        <Link
                          href="/login"
                          className="btn btn-filled btn-brand btn-md"
                          style={{ flex: 1, justifyContent: "center" }}
                          onClick={() => setShowLoginPopup(false)}
                        >
                          로그인하기
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="닫기"
          >
            <XIcon />
          </button>

          {thumbImgs.length > 1 && (
            <button
              className="lightbox-arrow lightbox-arrow--prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(
                  (lightbox - 1 + thumbImgs.length) % thumbImgs.length,
                );
              }}
              aria-label="이전"
            >
              <ChevronLeftIcon />
            </button>
          )}

          <div
            className="lightbox-img-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={thumbImgs[lightbox]}
              alt={card.name}
              className="lightbox-img"
              onError={(e) => {
                e.target.src = "/theme.png";
              }}
            />
          </div>

          {thumbImgs.length > 1 && (
            <button
              className="lightbox-arrow lightbox-arrow--next"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % thumbImgs.length);
              }}
              aria-label="다음"
            >
              <ChevronRightIcon />
            </button>
          )}

          {thumbImgs.length > 1 && (
            <div className="lightbox-counter">
              {lightbox + 1} / {thumbImgs.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
