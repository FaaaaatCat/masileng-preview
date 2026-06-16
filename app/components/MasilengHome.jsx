"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// 상수 데이터
// ─────────────────────────────────────────────
const IMG_BASE = "https://www.thecocktaildb.com/images/media/drink/";

const POOL = [
  {
    n: "마가리타",
    f: "5noda61589575158",
    g: "linear-gradient(160deg,oklch(.88 .11 95),oklch(.74 .15 88))",
  },
  {
    n: "모히토",
    f: "metwgh1606770327",
    g: "linear-gradient(160deg,oklch(.85 .13 145),oklch(.66 .16 150))",
  },
  {
    n: "올드 패션드",
    f: "vrwquq1478252802",
    g: "linear-gradient(160deg,oklch(.7 .13 65),oklch(.45 .12 55))",
  },
  {
    n: "위스키 사워",
    f: "hbkfsh1589574990",
    g: "linear-gradient(160deg,oklch(.88 .11 85),oklch(.72 .15 70))",
  },
  {
    n: "다이키리",
    f: "mrz9091589574515",
    g: "linear-gradient(160deg,oklch(.92 .06 95),oklch(.82 .1 100))",
  },
  {
    n: "마이 타이",
    f: "twyrrp1439907470",
    g: "linear-gradient(160deg,oklch(.78 .16 55),oklch(.6 .18 45))",
  },
  {
    n: "코스모폴리탄",
    f: "kpsajh1504368362",
    g: "linear-gradient(160deg,oklch(.7 .18 18),oklch(.55 .17 16))",
  },
  {
    n: "맨해튼",
    f: "yk70e31606771240",
    g: "linear-gradient(160deg,oklch(.6 .16 32),oklch(.4 .14 28))",
  },
  {
    n: "피나 콜라다",
    f: "cpf4j51504371346",
    g: "linear-gradient(160deg,oklch(.94 .04 95),oklch(.86 .07 92))",
  },
  {
    n: "블러디 메리",
    f: "t6caa21582485702",
    g: "linear-gradient(160deg,oklch(.6 .2 28),oklch(.42 .18 26))",
  },
  {
    n: "롱아일랜드",
    f: "rrtssw1472668972",
    g: "linear-gradient(160deg,oklch(.62 .12 70),oklch(.45 .1 60))",
  },
  {
    n: "스팅어",
    f: "2ahv791504352433",
    g: "linear-gradient(160deg,oklch(.92 .05 120),oklch(.84 .08 130))",
  },
  {
    n: "모스코 뮬",
    f: "3pylqc1504370988",
    g: "linear-gradient(160deg,oklch(.82 .1 75),oklch(.7 .13 65))",
  },
  {
    n: "마티니",
    f: "vyxwut1468875960",
    g: "linear-gradient(160deg,oklch(.9 .05 100),oklch(.8 .08 105))",
  },
].map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

const SCATTER_CONFIG = [
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

const CARDS = [
  {
    i: 10,
    u: "강준표",
    t: "섹스 인 더 드라이브",
    desc: "복숭아향 스타트 → 오렌지향 마무리 전채적으로 밝다",
    likes: 312,
    cmt: 24,
  },
  {
    i: 3,
    u: "블루디바인",
    t: "위스키 사워",
    desc: "[IBA공식] 위스키 베이스의 칵테일, 상큼하고 달콤한 밸런스가 뛰어나다",
    likes: 498,
    cmt: 51,
  },
  {
    i: 7,
    u: "블루디바인",
    t: "리멤버 더 메인",
    desc: "위스키 베이스의 칵테일. 이름은 1898년 1월 25일 침몰된 USS 메인 호에서 유래",
    likes: 276,
    cmt: 18,
  },
  {
    i: 2,
    u: "흔네",
    t: "카디네일(카르디날레)",
    desc: "네그로니의 변형 칵테일로, IBA 정식 칵테일입니다",
    likes: 204,
    cmt: 12,
  },
  {
    i: 6,
    u: "r0_t1m",
    t: "새벽 2시",
    desc: "색감이 새벽같아서 이름 붙였습니다 달달하게 편하게 마실 수 있는 칵테일",
    likes: 631,
    cmt: 73,
  },
  {
    i: 5,
    u: "r0_t1m",
    t: "옛기억",
    desc: "옛 생각을 할때마다 느꼈던 감정을 칵테일로 표현하고 싶었어요",
    likes: 389,
    cmt: 33,
  },
  {
    i: 0,
    u: "우디",
    t: "마가리타 트위스트",
    desc: "클래식 마가리타에 트위스트를 가미한 상큼한 여름 칵테일",
    likes: 455,
    cmt: 40,
  },
  {
    i: 8,
    u: "미도리",
    t: "스파클링 콜라다",
    desc: "피나콜라다에 스파클링 워터를 더해 청량감을 살린 열대 칵테일",
    likes: 512,
    cmt: 47,
  },
  {
    i: 1,
    u: "라임러버",
    t: "애플 모히토",
    desc: "신선한 민트와 사과 향이 어우러진 여름 최고의 칵테일",
    likes: 298,
    cmt: 21,
  },
  {
    i: 12,
    u: "한밤중",
    t: "미드나잇 뮬",
    desc: "모스코 뮬에 블랙베리 시럽을 더해 밤하늘 색깔을 담았어요",
    likes: 367,
    cmt: 29,
  },
  {
    i: 9,
    u: "오션",
    t: "블러디 선셋",
    desc: "블러디 메리를 베이스로 일몰의 붉은 노을을 표현한 칵테일",
    likes: 421,
    cmt: 36,
  },
  {
    i: 11,
    u: "카페인",
    t: "프로즌 스팅어",
    desc: "얼음을 갈아 만든 프로즌 타입의 스팅어, 여름에 최고",
    likes: 587,
    cmt: 62,
  },
  {
    i: 4,
    u: "선라이즈",
    t: "다이키리 클래식",
    desc: "쿠바에서 탄생한 럼 베이스의 클래식 칵테일, 라임의 상큼함이 일품",
    likes: 344,
    cmt: 28,
  },
  {
    i: 13,
    u: "진마니아",
    t: "마티니 온 더 락",
    desc: "전통 드라이 마티니를 얼음 위에 올려 부드럽게 즐기는 버전",
    likes: 291,
    cmt: 22,
  },
  {
    i: 0,
    u: "트로피컬",
    t: "망고 마가리타",
    desc: "신선한 망고 퓨레를 더한 트로피컬 마가리타, 달콤함과 산미의 완벽한 조화",
    likes: 478,
    cmt: 44,
  },
  {
    i: 6,
    u: "네온밤",
    t: "코스모 블루",
    desc: "코스모폴리탄에 블루 큐라소를 더해 은하수 빛깔을 담아낸 창작 칵테일",
    likes: 533,
    cmt: 58,
  },
  {
    i: 1,
    u: "민트킹",
    t: "로얄 모히토",
    desc: "스파클링 와인으로 베이스를 더한 고급스러운 모히토 변형",
    likes: 267,
    cmt: 19,
  },
  {
    i: 7,
    u: "위스키랩",
    t: "스모키 사워",
    desc: "아이슬레이 위스키의 피트향이 살아있는 강렬한 위스키 사워",
    likes: 392,
    cmt: 35,
  },
  {
    i: 3,
    u: "버번러버",
    t: "올드 켄터키",
    desc: "버번 위스키와 피치 비터스의 만남, 미국 남부의 향기를 담다",
    likes: 315,
    cmt: 27,
  },
  {
    i: 8,
    u: "비치클럽",
    t: "코코넛 선셋",
    desc: "피나 콜라다에 그레나딘을 더해 석양빛 그라디언트를 완성한 여름 칵테일",
    likes: 449,
    cmt: 41,
  },
  {
    i: 2,
    u: "이탈리아",
    t: "아페롤 스프리츠",
    desc: "이탈리아의 국민 칵테일, 아페롤과 프로세코의 상큼 쌉싸름한 조화",
    likes: 601,
    cmt: 68,
  },
  {
    i: 9,
    u: "스파이시",
    t: "피카냐 마리",
    desc: "할라피뇨를 인퓨징한 보드카로 만든 스파이시 블러디 메리",
    likes: 283,
    cmt: 24,
  },
  {
    i: 5,
    u: "럼크래프트",
    t: "다크 앤 스토미",
    desc: "다크 럼과 진저 비어의 만남, 폭풍우 같은 강렬함이 뒤따르는 칵테일",
    likes: 356,
    cmt: 31,
  },
  {
    i: 11,
    u: "민트향기",
    t: "그래스호퍼",
    desc: "민트 리큐르와 크림 드 카카오의 달콤 상쾌한 조합, 민트초코 러버에게 추천",
    likes: 412,
    cmt: 38,
  },
  {
    i: 4,
    u: "쿠바나이트",
    t: "헤밍웨이 다이키리",
    desc: "헤밍웨이가 즐겨 마셨다는 전설의 다이키리, 그레이프프루트와 마라스키노 리큐르 추가",
    likes: 328,
    cmt: 30,
  },
  {
    i: 12,
    u: "진저맨",
    t: "모스코 뮬 클래식",
    desc: "구리 머그에 담아야 제맛, 보드카와 진저 비어의 청량한 조합",
    likes: 495,
    cmt: 53,
  },
  {
    i: 13,
    u: "클래식바",
    t: "깁슨",
    desc: "마티니의 변형으로 올리브 대신 칵테일 어니언이 들어가는 클래식 칵테일",
    likes: 241,
    cmt: 17,
  },
  {
    i: 0,
    u: "산토리니",
    t: "그리스 선셋",
    desc: "우조와 자몽 주스로 만든 지중해 감성의 여름 드링크",
    likes: 374,
    cmt: 32,
  },
  {
    i: 10,
    u: "홍콩바",
    t: "롱 아일랜드 아이스티",
    desc: "5가지 베이스 스피릿이 들어가는 강력한 칵테일, 색이 아이스티를 닮았다",
    likes: 556,
    cmt: 61,
  },
  {
    i: 6,
    u: "뉴욕밤",
    t: "메트로폴리탄",
    desc: "코스모폴리탄의 업그레이드 버전, 블랙커런트 보드카로 더욱 풍부한 과일향",
    likes: 318,
    cmt: 26,
  },
];

const NAV_ITEMS = ["칵테일", "재료", "도전!마실랭"];
const SORT_TABS = ["최신순", "인기순", "댓글순"];

// ─────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────

/** 하트 아이콘 */
const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="13"
    height="13"
  >
    <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />
  </svg>
);

/** 댓글 아이콘 */
const ChatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="13"
    height="13"
  >
    <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z" />
  </svg>
);

/** 다운로드 아이콘 */
const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="15"
    height="15"
    style={{ opacity: 0.95 }}
  >
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

/** 검색 아이콘 */
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    style={{ color: "var(--ink-3)", flexShrink: 0 }}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

/** 셀렉트 화살표 아이콘 */
const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
    style={{ display: "block" }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// ─────────────────────────────────────────────
// Hero 스캐터 컴포넌트
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
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {items.map(({ left, y, w, h, d, idx }) => (
        <div
          key={idx}
          title={d.n}
          style={{
            position: "absolute",
            left,
            top: y,
            width: w,
            height: h,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 10px 34px -16px rgba(20,12,10,.4)",
            background: d.g,
            pointerEvents: "auto",
            cursor: "pointer",
            animationDelay: `${idx * 55}ms`,
          }}
          className="thumb-float"
        >
          <img
            src={d.url}
            alt={d.n}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 듀얼 레인지 슬라이더 컴포넌트
// ─────────────────────────────────────────────
function DualRangeSlider({ min, max, onMinChange, onMaxChange }) {
  const total = 8;
  const pMin = ((min - 2) / total) * 100;
  const pMax = ((max - 2) / total) * 100;
  const isActive = min > 2 || max < 10;

  const handleMinChange = (e) => {
    const v = Math.min(Number(e.target.value), max);
    onMinChange(v);
  };
  const handleMaxChange = (e) => {
    const v = Math.max(Number(e.target.value), min);
    onMaxChange(v);
  };

  return (
    <div
      style={{
        height: 54,
        padding: "0 18px",
        borderRadius: 14,
        border: `1.5px solid ${isActive ? "var(--coral)" : "var(--line)"}`,
        background: isActive ? "var(--coral-soft)" : "#fff",
        display: "flex",
        alignItems: "center",
        gap: 14,
        minWidth: 260,
        boxShadow: "0 1px 3px rgba(20,12,10,.04)",
        transition: "border-color .15s, background .15s",
      }}
    >
      <span
        style={{
          fontSize: 14.5,
          fontWeight: 600,
          color: "var(--ink)",
          whiteSpace: "nowrap",
        }}
      >
        재료 수
      </span>
      <div style={{ flex: 1, position: "relative", height: 6 }}>
        {/* 트랙 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--line)",
            borderRadius: 99,
          }}
        />
        {/* 필 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            height: "100%",
            background: "var(--coral)",
            borderRadius: 99,
            left: `${pMin}%`,
            width: `${pMax - pMin}%`,
            pointerEvents: "none",
          }}
        />
        {/* 썸 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pMin}%`,
            transform: "translate(-50%,-50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid var(--coral)",
            boxShadow: "0 1px 6px -1px rgba(200,60,80,.4)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pMax}%`,
            transform: "translate(-50%,-50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid var(--coral)",
            boxShadow: "0 1px 6px -1px rgba(200,60,80,.4)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
        {/* inputs */}
        <input
          type="range"
          min={2}
          max={10}
          step={1}
          value={min}
          onChange={handleMinChange}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            margin: 0,
            height: 6,
            opacity: 0,
            cursor: "pointer",
            zIndex: min >= max - 1 ? 5 : 4,
          }}
        />
        <input
          type="range"
          min={2}
          max={10}
          step={1}
          value={max}
          onChange={handleMaxChange}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            margin: 0,
            height: 6,
            opacity: 0,
            cursor: "pointer",
            zIndex: 3,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--coral-strong)",
          whiteSpace: "nowrap",
          minWidth: 70,
          textAlign: "right",
        }}
      >
        {min}~{max >= 10 ? "10+" : max}개
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// 칵테일 카드 컴포넌트
// ─────────────────────────────────────────────
function CocktailCard({ card }) {
  const [hovered, setHovered] = useState(false);
  const d = POOL[card.i];

  return (
    <article
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: "var(--r-md)",
          overflow: "hidden",
          boxShadow: hovered ? "var(--shadow-hover)" : "var(--shadow)",
          background: "var(--line-2)",
          transform: hovered ? "translateY(-4px)" : "none",
          transition: "transform .2s ease, box-shadow .2s ease",
        }}
      >
        {/* 배경 그라디언트 */}
        <div style={{ position: "absolute", inset: 0, background: d.g }} />
        {/* 이미지 */}
        <img
          src={d.url}
          alt={d.n}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
            display: "block",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        {/* 딤 오버레이 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: hovered
              ? "rgba(0,0,0,.30)"
              : "linear-gradient(to top, rgba(0,0,0,.42) 0%, rgba(0,0,0,.05) 34%, transparent 60%)",
            transition: "background .2s ease",
          }}
        />
        {/* 작성자 (hover시 숨김) */}
        <div
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            zIndex: 3,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 9px 4px 4px",
            borderRadius: 999,
            background: "rgba(20,14,12,.34)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,.16)",
            opacity: hovered ? 0 : 1,
            transition: "opacity .2s ease",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--coral), oklch(0.78 0.14 40))",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "rgba(255,255,255,.94)",
              letterSpacing: "-0.01em",
            }}
          >
            @{card.u}
          </span>
        </div>
        {/* 호버 설명 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            textAlign: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity .2s ease",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {card.desc}
          </p>
        </div>
      </div>
      {/* 제목 */}
      <h4
        style={{
          marginTop: 12,
          padding: "0 2px",
          fontSize: 17,
          fontWeight: 700,
          color: "var(--ink)",
          letterSpacing: "-0.03em",
          lineHeight: 1.3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {card.t}
      </h4>
      {/* 메타 */}
      <div
        style={{
          marginTop: 5,
          padding: "0 2px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 12.5,
          color: "var(--ink-3)",
          fontWeight: 500,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <HeartIcon />
          {card.likes}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <ChatIcon />
          {card.cmt}
        </span>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// 필터 바 컴포넌트
// ─────────────────────────────────────────────
function FilterBar({
  abv,
  base,
  rangeMin,
  rangeMax,
  onAbvChange,
  onBaseChange,
  onRangeMinChange,
  onRangeMaxChange,
  search,
  onSearchChange,
}) {
  return (
    <div
      style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}
    >
      {/* 도수 */}
      <div style={{ position: "relative" }}>
        <select
          value={abv}
          onChange={(e) => onAbvChange(e.target.value)}
          style={{
            height: 54,
            padding: "0 42px 0 18px",
            borderRadius: 14,
            border: `1.5px solid ${abv ? "var(--coral)" : "var(--line)"}`,
            background: abv ? "var(--coral-soft)" : "#fff",
            fontSize: 14.5,
            fontWeight: 600,
            color: abv ? "var(--coral-strong)" : "var(--ink)",
            fontFamily: "inherit",
            cursor: "pointer",
            appearance: "none",
            minWidth: 140,
            letterSpacing: "-0.01em",
            boxShadow: "0 1px 3px rgba(20,12,10,.04)",
            outline: "none",
            transition: ".15s",
          }}
        >
          <option value="">도수</option>
          <option value="none">무알콜</option>
          <option value="low">약한 도수</option>
          <option value="high">강한 도수</option>
        </select>
        <span
          style={{
            position: "absolute",
            right: 13,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--ink-3)",
          }}
        >
          <ChevronIcon />
        </span>
      </div>

      {/* 재료 수 */}
      <DualRangeSlider
        min={rangeMin}
        max={rangeMax}
        onMinChange={onRangeMinChange}
        onMaxChange={onRangeMaxChange}
      />

      {/* 베이스주 */}
      <div style={{ position: "relative" }}>
        <select
          value={base}
          onChange={(e) => onBaseChange(e.target.value)}
          style={{
            height: 54,
            padding: "0 42px 0 18px",
            borderRadius: 14,
            border: `1.5px solid ${base ? "var(--coral)" : "var(--line)"}`,
            background: base ? "var(--coral-soft)" : "#fff",
            fontSize: 14.5,
            fontWeight: 600,
            color: base ? "var(--coral-strong)" : "var(--ink)",
            fontFamily: "inherit",
            cursor: "pointer",
            appearance: "none",
            minWidth: 140,
            letterSpacing: "-0.01em",
            boxShadow: "0 1px 3px rgba(20,12,10,.04)",
            outline: "none",
            transition: ".15s",
          }}
        >
          <option value="">베이스주</option>
          {["럼", "보드카", "위스키", "진", "데킬라", "브랜디", "소주"].map(
            (v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ),
          )}
        </select>
        <span
          style={{
            position: "absolute",
            right: 13,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--ink-3)",
          }}
        >
          <ChevronIcon />
        </span>
      </div>

      {/* 검색 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 14,
          height: 54,
          padding: "0 8px 0 20px",
          background: "#fff",
          border: "2px solid var(--coral-line)",
          borderRadius: 14,
          transition: ".15s",
        }}
      >
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="만들고 싶은 칵테일, 또는 재료를 검색하세요"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "none",
            fontSize: 16,
            color: "var(--ink)",
            fontFamily: "inherit",
          }}
        />
        <button
          style={{
            height: 40,
            padding: "0 20px",
            borderRadius: 10,
            background: "var(--coral)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14.5,
            border: "none",
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export default function MasilengHome() {
  const [activeNav, setActiveNav] = useState("칵테일");
  const [sortTab, setSortTab] = useState("최신순");
  const [abv, setAbv] = useState("");
  const [base, setBase] = useState("");
  const [rangeMin, setRangeMin] = useState(2);
  const [rangeMax, setRangeMax] = useState(10);
  const [search, setSearch] = useState("");

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
        :root {
          --coral: oklch(0.66 0.17 18);
          --coral-strong: oklch(0.60 0.19 18);
          --coral-soft: oklch(0.95 0.035 18);
          --coral-line: oklch(0.90 0.05 18);
          --ink: oklch(0.26 0.012 50);
          --ink-2: oklch(0.46 0.012 50);
          --ink-3: oklch(0.62 0.010 50);
          --line: oklch(0.92 0.004 50);
          --line-2: oklch(0.95 0.004 50);
          --bg: oklch(0.995 0.002 60);
          --near-black: oklch(0.22 0.01 50);
          --r-md: 14px;
          --r-lg: 20px;
          --shadow: 0 1px 2px rgba(20,12,10,.04), 0 8px 24px -14px rgba(20,12,10,.18);
          --shadow-hover: 0 2px 4px rgba(20,12,10,.05), 0 18px 40px -18px rgba(20,12,10,.28);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          background: var(--bg); color: var(--ink);
          -webkit-font-smoothing: antialiased; letter-spacing: -0.01em;
        }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes floatIn { from { transform: translateY(18px) scale(.96); } to { transform: none; } }
          .thumb-float { animation: floatIn .6s cubic-bezier(.2,.7,.2,1) both; }
        }
        .thumb-float:hover { transform: translateY(-6px) scale(1.03) !important; box-shadow: 0 22px 50px -18px rgba(20,12,10,.5) !important; z-index: 5; }
        .cocktail-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px 22px; }
        @media (max-width: 1300px) { .cocktail-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 900px)  { .cocktail-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 1180px) { .hero-scatter { display: none !important; } }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,.82)",
          backdropFilter: "saturate(180%) blur(14px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: 1480, margin: "0 auto", padding: "0 40px" }}>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              height: 68,
            }}
          >
            {/* 브랜드 */}
            <a
              href="#"
              style={{
                fontWeight: 800,
                fontSize: 25,
                letterSpacing: "-0.04em",
                color: "var(--coral-strong)",
                display: "flex",
                alignItems: "baseline",
                gap: 1,
                textDecoration: "none",
              }}
            >
              <span>마실랭</span>
              <span style={{ color: "var(--coral)", fontSize: 18 }}>●</span>
            </a>
            {/* 메뉴 */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav(item);
                  }}
                  style={{
                    position: "relative",
                    fontSize: 16,
                    fontWeight: activeNav === item ? 700 : 600,
                    color:
                      activeNav === item
                        ? "var(--coral-strong)"
                        : "var(--ink-2)",
                    padding: "10px 14px",
                    borderRadius: 8,
                    textDecoration: "none",
                    transition: "color .15s, background .15s",
                  }}
                >
                  {item}
                  {activeNav === item && (
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        right: 14,
                        bottom: -14,
                        height: 3,
                        background: "var(--coral)",
                        borderRadius: "3px 3px 0 0",
                      }}
                    />
                  )}
                </a>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            {/* 액션 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: "var(--ink-2)",
                  padding: "9px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                로그인
              </button>
              <button
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: 11,
                  background:
                    "linear-gradient(135deg, var(--coral-strong) 0%, oklch(0.55 0.20 32) 100%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px -6px rgba(200,60,80,.55)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,.15) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
                <DownloadIcon />
                App 다운로드
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* 배경 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 60% at 50% 12%, var(--coral-soft) 0%, transparent 60%), linear-gradient(180deg, #fff 0%, var(--bg) 100%)",
          }}
        />
        {/* 스캐터 */}
        <div
          className="hero-scatter"
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        >
          <HeroScatter />
        </div>
        {/* 히어로 내용 */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1480,
            margin: "0 auto",
            padding: "96px 40px 86px",
            minHeight: 680,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              color: "var(--ink)",
            }}
          >
            마실랭에서
            <br />
            <span style={{ color: "var(--coral)" }}>오늘의 칵테일</span> 만나기
          </h1>
          <p
            style={{
              marginTop: 22,
              maxWidth: 520,
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--ink-2)",
            }}
          >
            전 세계 칵테일 레시피를 발견하고, 마실랭 유저들의 창작 레시피로
            나만의 한 잔을 직접 만들어보세요.
          </p>
          <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
            {[
              { label: "레시피 둘러보기", primary: true },
              { label: "내 레시피 등록하기", primary: false },
            ].map(({ label, primary }) => (
              <a
                key={label}
                href="#"
                style={{
                  height: 50,
                  padding: "0 26px",
                  borderRadius: 13,
                  fontSize: 15.5,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  background: primary ? "var(--coral)" : "var(--coral-soft)",
                  color: primary ? "#fff" : "var(--coral-strong)",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 페이지 콘텐츠 */}
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "0 40px" }}>
        {/* 필터 바 */}
        <FilterBar
          abv={abv}
          base={base}
          rangeMin={rangeMin}
          rangeMax={rangeMax}
          search={search}
          onAbvChange={setAbv}
          onBaseChange={setBase}
          onRangeMinChange={setRangeMin}
          onRangeMaxChange={setRangeMax}
          onSearchChange={setSearch}
        />

        {/* 칵테일 리스트 */}
        <section style={{ padding: "36px 0 80px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 22,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span
                style={{
                  width: 4,
                  height: 22,
                  background: "var(--coral)",
                  borderRadius: 3,
                  display: "block",
                }}
              />
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                }}
              >
                정식 칵테일 리스트
              </h3>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink-3)",
                  marginLeft: 2,
                }}
              >
                전 세계 칵테일 레시피 모음
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {SORT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSortTab(tab)}
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    padding: "8px 15px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    background: sortTab === tab ? "var(--ink)" : "none",
                    color: sortTab === tab ? "#fff" : "var(--ink-2)",
                    transition: ".15s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="cocktail-grid">
            {CARDS.map((card, idx) => (
              <CocktailCard key={idx} card={card} />
            ))}
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 46 }}
          >
            <button
              style={{
                padding: "13px 32px",
                borderRadius: 12,
                border: "1px solid var(--line)",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--ink)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              레시피 더 보기
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
