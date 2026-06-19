"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "../css/cocktail-detail.css";

import POOL_RAW from "../data/pool.json";
import INGREDIENTS_DATA from "../data/ingredients.json";
import CHALLENGE_CARDS_RAW from "../data/challenge_cards.json";
import { IMG_BASE } from "../data/constants.json";
import { getCardDetail, getCardTags } from "../data/detail-helpers.js";
import SiteHeader from "./SiteHeader";

// 재료 표시명 → ingredients.json id 매핑
const ING_LINK_MAP = {
  "화이트 럼": 1, "럼": 1,
  "보드카": 2,
  "드라이 진": 3, "진": 3,
  "실버 데킬라": 4, "데킬라": 4,
  "위스키": 5, "버번 위스키": 6, "버번": 6,
  "브랜디": 7, "꼬냑": 8,
  "트리플 섹": 11,
  "깔루아": 13, "아마레토": 14, "캄파리": 15,
  "토닉워터": 19, "탄산수": 20, "소다수": 20,
  "라임 주스": 23, "라임주스": 23,
  "레몬 주스": 24, "레몬주스": 24,
  "오렌지 주스": 25,
  "크랜베리 주스": 26,
  "라임": 28, "레몬": 29, "민트잎": 31, "민트": 31,
  "그레나딘": 32, "슈거 시럽": 33, "설탕 시럽": 33,
  "계란 흰자": 34, "생크림": 35,
  "앙고스투라 비터스": 36,
};

const DEFAULT_POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

// ─ 테마 배경 매핑 ─
const THEME_BG_MAP = {
  "Sour":      "Property 1=sour.png",
  "Party":     "Property 1=party.png",
  "Sparkling": "Property 1=sparkling.png",
  "City":      "Property 1=city.png",
  "Tropical":  "Property 1=tropical.png",
  "Fruity":    "Property 1=frutiy.png",
  "Creamy":    "Property 1=creamy.png",
  "Hot":       "Property 1=hot.png",
};

// ─ 칵테일 일러스트 매핑 ─
const ILLUST_MAP = {
  "애플마티니": "1_애플마티니.png",
  "B-52": "2_B-52.png",
  "바카디 칵테일": "3_바카디 칵테일.png",
  "블랙 러시안": "4_블랙 러시안.png",
  "블러디 메리": "5_블러디 메리.png",
  "블로우 잡": "6_블로우 잡.png",
  "블루 하와이": "7_블루 하와이.png",
  "블루 카미카제": "8_블루 카미카제.png",
  "블루 라군": "9_블루 라군.png",
  "블루 오션": "10_블루 오션.png",
  "BMW": "11_BMW.png",
  "보일러 메이커": "12_보일러 메이커.png",
  "브랜디 에그노그": "13_브랜디 에그노그.png",
  "브롱크스": "14_브롱크스.png",
  "코스모폴리탄": "15_코스모폴리탄.png",
  "쿠바 리브레": "16_쿠바 리브레.png",
  "다이키리": "17_다이키리.png",
  "더티 마티니": "18_더티 마티니.png",
  "에스프레소 마티니": "19_에스프레소 마티니.png",
  "깁슨": "20_깁슨.png",
  "김렛": "21_김렛.png",
  "진피즈": "22_진피즈.png",
  "진토닉": "23_진토닉.png",
  "갓파더": "24_갓파더.png",
  "갓마더": "25_갓마더.png",
  "골드러쉬": "26_골드러쉬.png",
  "그래스호퍼": "27_그래스호퍼.png",
  "그린 멕시칸": "28_그린 멕시칸.png",
  "하비 월뱅어": "29_하비 월뱅어.png",
  "하이볼": "30_하이볼.png",
  "핫 토디": "31_핫 토디.png",
  "허리케인": "32_허리케인.png",
  "잭콕": "33_잭콕.png",
  "예거밤": "34_예거밤.png",
  "젤리피쉬": "35_젤리피쉬.png",
  "키르": "36_키르.png",
  "레이디킬러": "37_레이디킬러.png",
  "런던콜링": "38_런던콜링.png",
  "롱아일랜드 아이스티": "39_롱아일랜드 아이스티.png",
  "마이타이": "40_마이타이.png",
  "맨하탄": "41_맨하탄.png",
  "마가리타": "42_마가리타.png",
  "마티니": "43_마티니.png",
  "미도리 사워": "44_미도리 사워.png",
  "모히또": "45_모히또.png",
  "모스코 뮬": "46_모스코 뮬.png",
  "머드슬라이드": "47_머드슬라이드.png",
  "네그로니": "48_네그로니.png",
  "뉴욕 사워": "49_뉴욕 사워.png",
  "올드 패션드": "50_올드 패션드.png",
  "오르가즘": "51_오르가즘.png",
  "페인킬러": "52_페인킬러.png",
  "피나 콜라다": "53_피나 콜라다.png",
  "라모즈 피즈": "54_라모즈 피즈.png",
  "러스티 네일": "55_러스티 네일.png",
  "샹그리아": "56_샹그리아.png",
  "스크류드라이버": "57_스크류드라이버.png",
  "씨브리즈": "58_씨브리즈.png",
  "섹스온더비치": "59_섹스온더비치.png",
  "사이드 카": "60_사이드 카.png",
  "실버 불렛": "61_실버 불렛.png",
  "싱가포르 슬링": "62_싱가포르 슬링.png",
  "데킬라 선라이즈": "63_데킬라 선라이즈.png",
  "보드카 마티니": "64_보드카 마티니.png",
  "화이트 러시안": "65_화이트 러시안.png",
  "꿀주": "66_꿀주.png",
  "에너자이저주": "67_에너자이저주.png",
  "고진감래주": "68_고진감래주.png",
  "한라토닉": "69_한라토닉.png",
  "로이로저스": "70_로이로저스.png",
  "셜리 템플": "71_셜리 템플.png",
  "버진 콜라다": "72_버진 콜라다.png",
  "민트 줄렙": "253_민트 줄렙.png",
  "화이트 레이디": "325_화이트 레이디.png",
  "불바디에": "335_불바디에.png",
  "알렉산더": "388_알렉산더.png",
  "아메리카노": "389_아메리카노.png",
  "엔젤페이스": "390_엔젤페이스.png",
  "에비에이션": "391_에비에이션.png",
  "비트윈 더 시트": "393_비트윈 더 시트.png",
  "브랜디 크러스타": "394_브랜디 크러스타.png",
  "카지노": "395_카지노.png",
  "클로버 클럽": "396_클로버 클럽.png",
  "드라이 마티니": "397_드라이 마티니.png",
  "행키팽키": "398_행키팽키.png",
  "존 콜린스": "399_존 콜린스.png",
  "마르티네즈": "400_마르티네즈.png",
  "메리 픽포드": "405_메리 픽포드.png",
  "몽키 글랜드": "406_몽키 글랜드.png",
  "파라다이스": "408_파라다이스.png",
  "플랜터스 터치": "409_플랜터스 터치.png",
  "포르토 플립": "410_포르토 플립.png",
  "사제락": "411_사제락.png",
  "스팅어": "415_스팅어.png",
  "턱시도": "416_턱시도.png",
  "뷰 카레": "417_뷰 카레.png",
  "위스키 사워": "418_위스키 사워.png",
  "프렌치75": "454_프렌치75.png",
  "골든 드림": "455_골든 드림.png",
  "헤밍웨이 스페셜": "460_헤밍웨이 스페셜.png",
  "홀시스 넥": "461_홀시스 넥.png",
  "아이리쉬 커피": "462_아이리쉬 커피.png",
  "미모사": "463_미모사.png",
  "피스코 사워": "464_피스코 사워.png",
  "베스퍼": "465_베스퍼.png",
  "좀비": "466_좀비.png",
  "바라쿠다": "468_바라쿠다.png",
  "비스 니즈": "469_비스 니즈.png",
  "브램블": "471_브램블.png",
  "칸찬차라": "472_칸찬차라.png",
  "페르난디토": "473_페르난디토.png",
  "프렌치 마티니": "474_프렌치 마티니.png",
  "일레갈": "475_일레갈.png",
  "네이키드 앤 패이머스": "476_네이키드 앤 패이머스.png",
  "올드 쿠반": "477_올드 쿠반.png",
  "페이퍼 플레인": "478_페이퍼 플레인.png",
  "페니실린": "483_페니실린.png",
  "스파이시 피프티": "484_스파이시 피프티.png",
  "스프리츠": "485_스프리츠.png",
  "서퍼링 바스타드": "486_서퍼링 바스타드.png",
  "티퍼레리": "487_티퍼레리.png",
  "토미스 마가리타": "488_토미스 마가리타.png",
  "트리니다드 사워": "489_트리니다드 사워.png",
  "VE.N.TO": "490_VE.N.TO.png",
  "옐로 버드": "491_옐로 버드.png",
};

// ─ icons ─
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    width="16" height="16">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
  </svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const SwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M17 3l4 4-4 4" /><path d="M3 7h18" />
    <path d="M7 21l-4-4 4-4" /><path d="M21 17H3" />
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
    <div className="flavor-dots">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`flavor-dot${i < value ? " filled" : ""}`} />
      ))}
    </div>
  );
}

/* 헤더 – MasilengHome과 동일 구조 */

const ILLUST_FILES = Object.values(ILLUST_MAP);
const CHALLENGE_CARDS = CHALLENGE_CARDS_RAW.map((c, i) => ({ ...c, _idx: i }));

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function CocktailDetail({ card, cardId, poolData, backHref = "/", showIllust = true, isOfficial = false }) {
  const [liked, setLiked] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [unitMode, setUnitMode] = useState("ml");
  const [authorDropOpen, setAuthorDropOpen] = useState(false);
  const authorRef = useRef(null);

  useEffect(() => {
    if (!authorDropOpen) return;
    const handler = (e) => {
      if (authorRef.current && !authorRef.current.contains(e.target)) setAuthorDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [authorDropOpen]);

  const { ingredients, steps, flavor, abvLabel, difficulty } = getCardDetail(card);
  const tags = getCardTags(card);
  const ratios = computeRatios(ingredients);

  const POOL = poolData || DEFAULT_POOL;
  const POOL_LEN = POOL.length;

  const poolIdx = card.i % POOL_LEN;
  const mainImg = POOL[poolIdx];
  const thumb1Img = POOL[(poolIdx + 1) % POOL_LEN];
  const thumb2Img = POOL[(poolIdx + 2) % POOL_LEN];
  const thumbImgs = [mainImg, thumb1Img, thumb2Img];
  const activeImg = thumbImgs[activeThumb];

  const difficultyClass = difficulty === "쉬움" ? "easy" : difficulty === "보통" ? "medium" : "hard";

  // 영문명: desc 에서 추출, 없으면 pool 이미지명

  return (
    <>
      <SiteHeader />

      <div className="detail-page">
        <div className="detail-inner">
          <div className="detail-grid">
            {/* ── 왼쪽: 뒤로가기 + 이미지 갤러리 ── */}
            <div className="detail-left">
              {/* 1. 뒤로가기 버튼 – detail-left 첫 번째 자식 */}
              <Link href="/" className="detail-back-btn">
                <ArrowLeftIcon />
                목록으로
              </Link>

              <div className="detail-gallery-main">
                <img
                  src={activeImg.url}
                  alt={card.t}
                  onError={(e) => {
                    e.target.src = "/theme.png";
                  }}
                />
              </div>
              <div className="detail-gallery-thumbs">
                {thumbImgs.map((img, idx) => (
                  <div
                    key={idx}
                    className={`detail-thumb${activeThumb === idx ? " active" : ""}`}
                    onClick={() => setActiveThumb(idx)}
                  >
                    <img
                      src={img.url}
                      alt={img.n}
                      onError={(e) => {
                        e.target.src = "/theme.png";
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                className="detail-share-btn"
                onClick={() =>
                  navigator.share?.({
                    title: card.t,
                    url: window.location.href,
                  })
                }
              >
                <ShareIcon />
                공유하기
              </button>
            </div>

            {/* ── 오른쪽: 정보 ── */}
            <div className="detail-right">
              {/* 기본 정보 카드 */}
              <div className="detail-card">
                <div className="detail-info-header">
                  {/* 테마 배경 + 칵테일 일러스트 */}
                  <div className="detail-cocktail-icon">
                    {THEME_BG_MAP[card.theme] && (
                      <img
                        className="detail-cocktail-icon-bg"
                        src={`/theme/${encodeURIComponent(THEME_BG_MAP[card.theme])}`}
                        alt=""
                      />
                    )}
                    {showIllust && (
                      <img
                        className="detail-cocktail-icon-illust"
                        src={`/cocktail_illust/${encodeURIComponent(
                          ILLUST_MAP[card.t] ??
                            ILLUST_FILES[cardId % ILLUST_FILES.length],
                        )}`}
                        alt={card.t}
                      />
                    )}
                  </div>
                  <div className="detail-title-wrap">
                    <h1 className="detail-cocktail-name">{card.t}</h1>
                  </div>
                  <button
                    className={`detail-like-btn${liked ? " liked" : ""}`}
                    onClick={() => setLiked((v) => !v)}
                  >
                    <HeartIcon filled={liked} />
                    좋아요 {card.likes + (liked ? 1 : 0)}
                  </button>
                </div>

                <div className="detail-tags">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className="detail-tag btn btn-subfilled btn-gray-light"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <p className="detail-desc">{card.desc}</p>

                {/* 맛 프로필 도트 박스 */}
                <div className="detail-flavor-box">
                  {[
                    { label: "당도", val: flavor.sweet },
                    { label: "산미", val: flavor.sour },
                    { label: "쌉쌀함", val: flavor.bitter },
                    { label: "바디감", val: flavor.body },
                  ].map(({ label, val }) => (
                    <div key={label} className="detail-flavor-row">
                      <span className="detail-flavor-label">{label}</span>
                      <FlavorDots value={val} />
                    </div>
                  ))}
                </div>

                {/* 5 & 7. 마실랭 공식: 브랜드색 + 흰M, 일반: userProfile.png */}
                <div className="detail-author-wrap" ref={authorRef}>
                  <button
                    className={`detail-author${!isOfficial && !card.iba ? " detail-author--clickable" : ""}${authorDropOpen ? " detail-author--open" : ""}`}
                    onClick={() => {
                      if (!isOfficial && !card.iba)
                        setAuthorDropOpen((v) => !v);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: !isOfficial && !card.iba ? "pointer" : "default",
                      font: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div className="detail-author-avatar">
                      {isOfficial || card.iba ? (
                        <span className="detail-author-avatar-official">M</span>
                      ) : (
                        <img src="/userProfile.png" alt="프로필" />
                      )}
                    </div>
                    <span className="detail-author-name">
                      {isOfficial || card.iba ? "마실랭 공식" : card.u}
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
                        (c) => c.u === card.u,
                      );
                      return (
                        <div className="detail-author-dropdown">
                          <p className="detail-author-dropdown-header">
                            @{card.u}의 레시피
                          </p>
                          {userCards.map((uc) => {
                            const ucImg = POOL[uc.i % POOL.length];
                            return (
                              <Link
                                key={uc._idx}
                                href={`/challenge/${uc._idx}`}
                                className="detail-author-dropdown-item"
                                onClick={() => setAuthorDropOpen(false)}
                              >
                                {ucImg && (
                                  <div
                                    className="detail-author-dropdown-thumb"
                                    style={{ background: ucImg.g }}
                                  >
                                    <img
                                      src={ucImg.url}
                                      alt={uc.t}
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                                <span className="detail-author-dropdown-name">
                                  {uc.t}
                                </span>
                                <ChevronRightIcon />
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })()}
                </div>
              </div>

              {/* 스탯 row */}
              <div className="detail-stats-row">
                <div className="detail-stat-card">
                  <div className="detail-stat-icon">
                    <FlameIcon />
                  </div>
                  <div className="detail-stat-body">
                    <span className="detail-stat-label">도수</span>
                    <span className="detail-stat-value">{abvLabel}</span>
                  </div>
                </div>
                <div className="detail-stat-card">
                  <div className="detail-stat-icon">
                    <TagIcon />
                  </div>
                  <div className="detail-stat-body">
                    <span className="detail-stat-label">테마</span>
                    <span className="detail-stat-value">
                      {card.theme ?? "—"}
                    </span>
                  </div>
                </div>
                <div className="detail-stat-card">
                  <div className="detail-stat-icon">
                    <StarIcon />
                  </div>
                  <div className="detail-stat-body">
                    <span className="detail-stat-label">난이도</span>
                    <span className={`detail-stat-badge ${difficultyClass}`}>
                      {difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* 재료 카드 */}
              <div className="detail-card">
                <div className="detail-section-header">
                  <h2 className="detail-section-title">재료 정보</h2>
                  <div className="detail-label-info"></div>
                  <button
                    className="detail-unit-btn btn btn-lined btn-gray-light"
                    onClick={() =>
                      setUnitMode((v) => (v === "ml" ? "ratio" : "ml"))
                    }
                  >
                    <SwitchIcon />
                    단위 변경
                  </button>
                </div>

                <div className="detail-ing-list">
                  {ingredients.map((ing, idx) => {
                    const ratio = ratios[idx];
                    const ingId = ING_LINK_MAP[ing.name];
                    const inner = (
                      <>
                        <div className="detail-ing-emoji">{ing.emoji}</div>
                        <span className="detail-ing-name">{ing.name}</span>
                        <span className="detail-ing-type">{ing.type}</span>
                        {ratio !== null && (
                          <span className="detail-ing-ratio-val">{ratio}%</span>
                        )}
                        <span className="detail-ing-amount">{ing.amount}</span>
                      </>
                    );
                    return ingId ? (
                      <Link
                        key={idx}
                        href={`/ingredient/${ingId}`}
                        className="detail-ing-item detail-ing-item--link"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={idx} className="detail-ing-item">
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 광고 배너 */}
              <div className="ad-banner-test">Google 광고 배너</div>

              {/* 레시피 카드 */}
              <div className="detail-card">
                <div className="detail-section-header">
                  <h2 className="detail-section-title">만드는 방법</h2>
                </div>
                <div className="detail-steps-list">
                  {steps.map((step, idx) => (
                    <div key={idx} className="detail-step-item">
                      <div className="detail-step-num">{idx + 1}</div>
                      <p className="detail-step-text">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 댓글 카드 */}
              <div className="detail-card">
                <h2 className="detail-section-title">댓글</h2>
                <p className="detail-comment-empty">
                  아직 댓글이 없어요. 첫 댓글을 남겨보세요!
                </p>
                <div className="detail-comment-input-wrap">
                  <div className="detail-comment-avatar" />
                  <input
                    className="detail-comment-input"
                    type="text"
                    placeholder="댓글을 입력하세요..."
                  />
                  <button className="detail-comment-submit">등록</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
