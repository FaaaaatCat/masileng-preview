"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "../css/cocktail-detail.css";

import POOL_RAW from "../data/pool.json";
import INGREDIENTS_DATA from "../data/ingredients.json";
import CHALLENGE_CARDS_RAW from "../data/challenge_cards.json";
import { IMG_BASE } from "../data/constants.json";
import { getCardDetail, getCardTags } from "../data/detail-helpers.js";
import { SelectFilter } from "../components/FilterBar";
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
  UploadBoxIcon,
  SearchIcon,
  ExpandIcon,
  ChevronLeftIcon,
  XIcon,
} from "../components/icons";

// 재료 표시명 → ingredients.json id 매핑
const ING_LINK_MAP = {
  "화이트 럼": 1,
  럼: 1,
  보드카: 2,
  "드라이 진": 3,
  진: 3,
  "실버 데킬라": 4,
  데킬라: 4,
  위스키: 5,
  "버번 위스키": 6,
  버번: 6,
  브랜디: 7,
  꼬냑: 8,
  "트리플 섹": 11,
  깔루아: 13,
  아마레토: 14,
  캄파리: 15,
  토닉워터: 19,
  탄산수: 20,
  소다수: 20,
  "라임 주스": 23,
  라임주스: 23,
  "레몬 주스": 24,
  레몬주스: 24,
  "오렌지 주스": 25,
  "크랜베리 주스": 26,
  라임: 28,
  레몬: 29,
  민트잎: 31,
  민트: 31,
  그레나딘: 32,
  "슈거 시럽": 33,
  "설탕 시럽": 33,
  "계란 흰자": 34,
  생크림: 35,
  "앙고스투라 비터스": 36,
};

const DEFAULT_POOL = POOL_RAW.map((d) => ({
  ...d,
  url: `${IMG_BASE}${d.f}.jpg`,
}));

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

// ─ 칵테일 일러스트 매핑 ─
const ILLUST_MAP = {
  애플마티니: "1_애플마티니.png",
  "B-52": "2_B-52.png",
  "바카디 칵테일": "3_바카디 칵테일.png",
  "블랙 러시안": "4_블랙 러시안.png",
  "블러디 메리": "5_블러디 메리.png",
  "블로우 잡": "6_블로우 잡.png",
  "블루 하와이": "7_블루 하와이.png",
  "블루 카미카제": "8_블루 카미카제.png",
  "블루 라군": "9_블루 라군.png",
  "블루 오션": "10_블루 오션.png",
  BMW: "11_BMW.png",
  "보일러 메이커": "12_보일러 메이커.png",
  "브랜디 에그노그": "13_브랜디 에그노그.png",
  브롱크스: "14_브롱크스.png",
  코스모폴리탄: "15_코스모폴리탄.png",
  "쿠바 리브레": "16_쿠바 리브레.png",
  다이키리: "17_다이키리.png",
  "더티 마티니": "18_더티 마티니.png",
  "에스프레소 마티니": "19_에스프레소 마티니.png",
  깁슨: "20_깁슨.png",
  김렛: "21_김렛.png",
  진피즈: "22_진피즈.png",
  진토닉: "23_진토닉.png",
  갓파더: "24_갓파더.png",
  갓마더: "25_갓마더.png",
  골드러쉬: "26_골드러쉬.png",
  그래스호퍼: "27_그래스호퍼.png",
  "그린 멕시칸": "28_그린 멕시칸.png",
  "하비 월뱅어": "29_하비 월뱅어.png",
  하이볼: "30_하이볼.png",
  "핫 토디": "31_핫 토디.png",
  허리케인: "32_허리케인.png",
  잭콕: "33_잭콕.png",
  예거밤: "34_예거밤.png",
  젤리피쉬: "35_젤리피쉬.png",
  키르: "36_키르.png",
  레이디킬러: "37_레이디킬러.png",
  런던콜링: "38_런던콜링.png",
  "롱아일랜드 아이스티": "39_롱아일랜드 아이스티.png",
  마이타이: "40_마이타이.png",
  맨하탄: "41_맨하탄.png",
  마가리타: "42_마가리타.png",
  마티니: "43_마티니.png",
  "미도리 사워": "44_미도리 사워.png",
  모히또: "45_모히또.png",
  "모스코 뮬": "46_모스코 뮬.png",
  머드슬라이드: "47_머드슬라이드.png",
  네그로니: "48_네그로니.png",
  "뉴욕 사워": "49_뉴욕 사워.png",
  "올드 패션드": "50_올드 패션드.png",
  오르가즘: "51_오르가즘.png",
  페인킬러: "52_페인킬러.png",
  "피나 콜라다": "53_피나 콜라다.png",
  "라모즈 피즈": "54_라모즈 피즈.png",
  "러스티 네일": "55_러스티 네일.png",
  샹그리아: "56_샹그리아.png",
  스크류드라이버: "57_스크류드라이버.png",
  씨브리즈: "58_씨브리즈.png",
  섹스온더비치: "59_섹스온더비치.png",
  "사이드 카": "60_사이드 카.png",
  "실버 불렛": "61_실버 불렛.png",
  "싱가포르 슬링": "62_싱가포르 슬링.png",
  "데킬라 선라이즈": "63_데킬라 선라이즈.png",
  "보드카 마티니": "64_보드카 마티니.png",
  "화이트 러시안": "65_화이트 러시안.png",
  꿀주: "66_꿀주.png",
  에너자이저주: "67_에너자이저주.png",
  고진감래주: "68_고진감래주.png",
  한라토닉: "69_한라토닉.png",
  로이로저스: "70_로이로저스.png",
  "셜리 템플": "71_셜리 템플.png",
  "버진 콜라다": "72_버진 콜라다.png",
  "민트 줄렙": "253_민트 줄렙.png",
  "화이트 레이디": "325_화이트 레이디.png",
  불바디에: "335_불바디에.png",
  알렉산더: "388_알렉산더.png",
  아메리카노: "389_아메리카노.png",
  엔젤페이스: "390_엔젤페이스.png",
  에비에이션: "391_에비에이션.png",
  "비트윈 더 시트": "393_비트윈 더 시트.png",
  "브랜디 크러스타": "394_브랜디 크러스타.png",
  카지노: "395_카지노.png",
  "클로버 클럽": "396_클로버 클럽.png",
  "드라이 마티니": "397_드라이 마티니.png",
  행키팽키: "398_행키팽키.png",
  "존 콜린스": "399_존 콜린스.png",
  마르티네즈: "400_마르티네즈.png",
  "메리 픽포드": "405_메리 픽포드.png",
  "몽키 글랜드": "406_몽키 글랜드.png",
  파라다이스: "408_파라다이스.png",
  "플랜터스 터치": "409_플랜터스 터치.png",
  "포르토 플립": "410_포르토 플립.png",
  사제락: "411_사제락.png",
  스팅어: "415_스팅어.png",
  턱시도: "416_턱시도.png",
  "뷰 카레": "417_뷰 카레.png",
  "위스키 사워": "418_위스키 사워.png",
  프렌치75: "454_프렌치75.png",
  "골든 드림": "455_골든 드림.png",
  "헤밍웨이 스페셜": "460_헤밍웨이 스페셜.png",
  "홀시스 넥": "461_홀시스 넥.png",
  "아이리쉬 커피": "462_아이리쉬 커피.png",
  미모사: "463_미모사.png",
  "피스코 사워": "464_피스코 사워.png",
  베스퍼: "465_베스퍼.png",
  좀비: "466_좀비.png",
  바라쿠다: "468_바라쿠다.png",
  "비스 니즈": "469_비스 니즈.png",
  브램블: "471_브램블.png",
  칸찬차라: "472_칸찬차라.png",
  페르난디토: "473_페르난디토.png",
  "프렌치 마티니": "474_프렌치 마티니.png",
  일레갈: "475_일레갈.png",
  "네이키드 앤 패이머스": "476_네이키드 앤 패이머스.png",
  "올드 쿠반": "477_올드 쿠반.png",
  "페이퍼 플레인": "478_페이퍼 플레인.png",
  페니실린: "483_페니실린.png",
  "스파이시 피프티": "484_스파이시 피프티.png",
  스프리츠: "485_스프리츠.png",
  "서퍼링 바스타드": "486_서퍼링 바스타드.png",
  티퍼레리: "487_티퍼레리.png",
  "토미스 마가리타": "488_토미스 마가리타.png",
  "트리니다드 사워": "489_트리니다드 사워.png",
  "VE.N.TO": "490_VE.N.TO.png",
  "옐로 버드": "491_옐로 버드.png",
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

const ILLUST_FILES = Object.values(ILLUST_MAP);
const CHALLENGE_CARDS = CHALLENGE_CARDS_RAW.map((c, i) => ({ ...c, _idx: i }));

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
  poolData,
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
  const [overrideData, setOverrideData] = useState(null); // 저장된 수정값
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editAbv, setEditAbv] = useState("high");
  const [editBase, setEditBase] = useState("위스키");
  const [editTheme, setEditTheme] = useState("Sour");
  const [editDifficulty, setEditDifficulty] = useState(0);
  const [editDiffMode, setEditDiffMode] = useState("ai");
  const [editIngredients, setEditIngredients] = useState([]);
  const [editSteps, setEditSteps] = useState([]);
  const [editOpenSuggestId, setEditOpenSuggestId] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState(null);
  const [editDragging, setEditDragging] = useState(false);
  const nextIngId = useRef(100);
  const nextStepId = useRef(100);
  const editFileRef = useRef(null);

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
    (currentUser.profileName || currentUser.name) === card.u;

  // ── 편집 헬퍼
  const getSuggestions = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INGREDIENTS_DATA.filter(
      (item) =>
        item.n.toLowerCase().includes(q) || item.en.toLowerCase().includes(q),
    ).slice(0, 8);
  };

  const startEditing = () => {
    const base = overrideData?.base ?? card.base;
    const theme = overrideData?.theme ?? card.theme;
    const src = getCardDetail({ ...card, ...overrideData });
    setEditTitle(overrideData?.title ?? card.t);
    setEditDesc(overrideData?.desc ?? card.desc);
    setEditAbv(overrideData?.abv ?? card.abv);
    setEditBase(base);
    setEditTheme(theme);
    setEditDiffMode(overrideData?.diffMode ?? "ai");
    setEditDifficulty(overrideData?.difficulty ?? 0);
    setEditIngredients(
      (overrideData?.ingredients ?? src.ingredients).map((ing, i) => {
        const raw = ing.amount ?? "";
        if (raw === "적당량")
          return { id: i + 1, name: ing.name, amount: "", unit: "적당량" };
        const unit = raw.replace(/^[\d.]+\s*/, "") || "ml";
        const amount = raw.replace(/[^0-9.]/g, "");
        return { id: i + 1, name: ing.name, amount, unit };
      }),
    );
    nextIngId.current = src.ingredients.length + 1;
    setEditSteps(
      (overrideData?.steps ?? src.steps).map((s, i) => ({
        id: i + 1,
        text: typeof s === "string" ? s : s.text,
      })),
    );
    nextStepId.current = src.steps.length + 1;
    setEditPhotoPreview(overrideData?.photoPreview ?? null);
    setIsEditing(true);
  };

  const handleEditPhotoFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setEditPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const saveEditing = () => {
    setOverrideData({
      title: editTitle.trim() || card.t,
      desc: editDesc,
      abv: editAbv,
      base: editBase,
      theme: editTheme,
      diffMode: editDiffMode,
      difficulty: editDifficulty,
      photoPreview: editPhotoPreview,
      ingredients: editIngredients.map((ing) => ({
        emoji: "🍹",
        name: ing.name,
        type: "",
        abvStr: null,
        amount: ing.unit === "적당량" ? "적당량" : `${ing.amount}${ing.unit}`,
      })),
      steps: editSteps.map((s) => s.text),
    });
    setIsEditing(false);
  };

  const addEditIng = () => {
    setEditIngredients((prev) => [
      ...prev,
      { id: nextIngId.current++, name: "", amount: "", unit: "ml" },
    ]);
  };
  const removeEditIng = (id) => {
    if (editIngredients.length <= 2) return;
    setEditIngredients((prev) => prev.filter((i) => i.id !== id));
  };
  const updateEditIng = (id, field, value) =>
    setEditIngredients((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const u = { ...i, [field]: value };
        if (field === "unit" && value === "적당량") u.amount = "";
        return u;
      }),
    );

  const addEditStep = () => {
    setEditSteps((prev) => [...prev, { id: nextStepId.current++, text: "" }]);
  };
  const removeEditStep = (id) =>
    setEditSteps((prev) => prev.filter((s) => s.id !== id));
  const updateEditStep = (id, value) =>
    setEditSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text: value } : s)),
    );

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
        t: overrideData.title,
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

  const POOL = poolData || DEFAULT_POOL;
  const POOL_LEN = POOL.length;

  const poolIdx = card.i % POOL_LEN;
  const mainImg = POOL[poolIdx];
  const thumb1Img = POOL[(poolIdx + 1) % POOL_LEN];
  const thumb2Img = POOL[(poolIdx + 2) % POOL_LEN];
  const thumbImgs = [mainImg, thumb1Img, thumb2Img];
  const activeImg = thumbImgs[activeThumb];

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
  if (isEditing) {
    const EDIT_THEMES = [
      { id: "Sour", ko: "상큼발랄", img: "/theme/sour.png" },
      { id: "Sparkling", ko: "탄산감", img: "/theme/sparkling.png" },
      { id: "Fruity", ko: "과일 잔뜩", img: "/theme/fruity.png" },
      { id: "City", ko: "쎈 도수", img: "/theme/city.png" },
      { id: "Creamy", ko: "크리미", img: "/theme/cramy.png" },
      { id: "Hot", ko: "향신료", img: "/theme/hot.png" },
      { id: "Party", ko: "대중적인", img: "/theme/party.png" },
      { id: "Tropical", ko: "이국적인", img: "/theme/tropical.png" },
    ];

    return (
      <>
        <SiteHeader />
        <div className="upload-page">
          <div className="upload-inner">
            {/* Hero */}
            <div style={{ marginBottom: 40 }}>
              <button className="btn btn-transparent btn-md" onClick={() => setIsEditing(false)}>
                <ArrowLeftIcon />
                페이지로 돌아가기
              </button>
              <h1 className="upload-heading">{editTitle || card.t}</h1>
              <p className="common-body-lg-light">
                레시피를 수정하고 있어요 ✏️
              </p>
            </div>

            <div className="upload-grid">
              {/* ── 왼쪽 */}
              <div className="upload-left">
                {/* 기본 정보 */}
                <div className="common-card">
                  <div className="common-card-header">
                    <span className="upload-card-icon">📋</span>
                    <h2 className="common-title-md">기본 정보</h2>
                  </div>
                  <div className="common-card-inner">
                    <div className="upload-field">
                      <label className="upload-label">칵테일 이름 *</label>
                      <input
                        className="common-input"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="upload-field">
                      <label className="upload-label">한 줄 소개</label>
                      <textarea
                        className="common-textarea"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="upload-field">
                      <label className="upload-label upload-label--icon">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="none"
                        >
                          <path d="M12 2.5l2.636 5.597 6.044.877-4.37 4.188 1.031 5.943L12 16.25l-5.34 2.855 1.03-5.943-4.37-4.188 6.044-.877z" />
                        </svg>{" "}
                        난이도
                      </label>
                      <div className="upload-diff-row">
                        <button
                          className={`btn btn-sm upload-diff-btn${editDiffMode === "ai" ? " btn-filled btn-brand" : " btn-lined btn-gray-light"}`}
                          onClick={() => {
                            setEditDiffMode("ai");
                            setEditDifficulty(0);
                          }}
                        >
                          AI 추천
                        </button>
                        <button
                          className={`btn btn-sm upload-diff-btn${editDiffMode === "manual" ? " btn-filled btn-brand" : " btn-lined btn-gray-light"}`}
                          onClick={() => setEditDiffMode("manual")}
                        >
                          직접 선택
                        </button>
                        <div
                          className={`upload-stars${editDiffMode === "manual" ? " manual" : " ai"}`}
                        >
                          {editDiffMode === "ai" ? (
                            <span className="upload-stars-ai-msg">
                              AI가 레시피를 읽고 자동으로 난이도를
                              추천해드립니다
                            </span>
                          ) : (
                            [1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                className={`upload-star${editDifficulty >= n ? " filled" : ""}`}
                                onClick={() => setEditDifficulty(n)}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill={
                                    editDifficulty >= n
                                      ? "currentColor"
                                      : "none"
                                  }
                                  stroke="currentColor"
                                  strokeWidth={
                                    editDifficulty >= n ? "0" : "1.8"
                                  }
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M12 2.5l2.636 5.597 6.044.877-4.37 4.188 1.031 5.943L12 16.25l-5.34 2.855 1.03-5.943-4.37-4.188 6.044-.877z" />
                                </svg>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 카테고리 태그 */}
                <div className="common-card">
                  <div className="common-card-header">
                    <span className="upload-card-icon">🏷️</span>
                    <h2 className="common-title-md">카테고리 태그</h2>
                  </div>
                  <div className="common-card-inner">
                    <div className="upload-theme-grid">
                      {EDIT_THEMES.map((t) => (
                        <button
                          key={t.id}
                          className={`upload-theme-item${editTheme === t.id ? " active" : ""}`}
                          onClick={() => setEditTheme(t.id)}
                        >
                          <img
                            src={t.img}
                            alt={t.id}
                            className="upload-theme-img"
                          />
                          <span className="upload-theme-en">{t.id}</span>
                          <span className="upload-theme-ko">{t.ko}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 재료 */}
                <div className="common-card">
                  <div className="common-card-header">
                    <span className="upload-card-icon">🧪</span>
                    <h2 className="common-title-md">재료</h2>
                  </div>
                  <div className="common-card-inner">
                    <div className="upload-ing-list">
                      {editIngredients.map((ing, idx) => {
                        const isNoAmt = ing.unit === "적당량";
                        return (
                          <div key={ing.id} className="upload-ing-row">
                            <div className="upload-ing-num">{idx + 1}</div>
                            <div className="upload-ing-inputs">
                              <div
                                className={`common-input-wrap${ing.name ? " has-value" : ""}`}
                                style={{ position: "relative" }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none",
                                    color: "var(--font-placeholder)",
                                    display: "flex",
                                  }}
                                >
                                  <SearchIcon />
                                </span>
                                <input
                                  className={`common-input common-input--icon${ing.name ? " has-value" : ""}`}
                                  type="text"
                                  placeholder="재료명 검색"
                                  value={ing.name}
                                  onChange={(e) => {
                                    updateEditIng(
                                      ing.id,
                                      "name",
                                      e.target.value,
                                    );
                                    setEditOpenSuggestId(ing.id);
                                  }}
                                  onFocus={() =>
                                    ing.name && setEditOpenSuggestId(ing.id)
                                  }
                                  onBlur={() =>
                                    setTimeout(
                                      () => setEditOpenSuggestId(null),
                                      150,
                                    )
                                  }
                                />
                                {editOpenSuggestId === ing.id &&
                                  ing.name.trim() &&
                                  getSuggestions(ing.name).length > 0 && (
                                    <div className="ing-suggest-dropdown">
                                      {getSuggestions(ing.name).map((item) => (
                                        <div
                                          key={item.id}
                                          className="ing-suggest-item"
                                          onMouseDown={() => {
                                            updateEditIng(
                                              ing.id,
                                              "name",
                                              item.n,
                                            );
                                            setEditOpenSuggestId(null);
                                          }}
                                        >
                                          <span className="ing-suggest-name">
                                            {item.n}
                                          </span>
                                          <span className="ing-suggest-cat">
                                            {item.cat}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                              <input
                                className={`common-input common-input--amount${isNoAmt ? " disabled" : ""}`}
                                type="text"
                                placeholder="용량"
                                value={isNoAmt ? "" : ing.amount}
                                disabled={isNoAmt}
                                onChange={(e) =>
                                  updateEditIng(
                                    ing.id,
                                    "amount",
                                    e.target.value,
                                  )
                                }
                              />
                              <SelectFilter
                                value={ing.unit}
                                onChange={(v) =>
                                  updateEditIng(ing.id, "unit", v)
                                }
                                placeholder="단위"
                                size="medium"
                                styleVariant="select-style-default"
                              >
                                <optgroup label="계량 단위">
                                  <option value="ml">ml</option>
                                  <option value="oz">oz</option>
                                  <option value="tsp">tsp</option>
                                  <option value="tbsp">tbsp</option>
                                  <option value="dash">dash</option>
                                </optgroup>
                                <optgroup label="기타">
                                  <option value="적당량">적당량</option>
                                  <option value="개">개</option>
                                  <option value="조각">조각</option>
                                </optgroup>
                              </SelectFilter>
                            </div>
                            <button
                              className="upload-ing-del"
                              onClick={() => removeEditIng(ing.id)}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="upload-add-btn btn-lg"
                      onClick={addEditIng}
                    >
                      <PlusIcon /> 재료 추가
                    </button>
                  </div>
                </div>

                {/* 조제 방법 */}
                <div className="common-card">
                  <div className="common-card-header">
                    <span className="upload-card-icon">📝</span>
                    <h2 className="common-title-md">조제 방법</h2>
                  </div>
                  <div className="common-card-inner">
                    <div className="upload-steps-list">
                      {editSteps.map((step, idx) => (
                        <div key={step.id} className="upload-step-row">
                          <div className="upload-step-num-wrap">
                            <div className="upload-ing-num">{idx + 1}</div>
                          </div>
                          <textarea
                            className="common-textarea upload-step"
                            value={step.text}
                            onChange={(e) =>
                              updateEditStep(step.id, e.target.value)
                            }
                            rows={2}
                          />
                          {editSteps.length > 1 && (
                            <button
                              className="upload-ing-del"
                              onClick={() => removeEditStep(step.id)}
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      className="upload-add-btn btn-lg"
                      onClick={addEditStep}
                    >
                      <PlusIcon /> 단계 추가
                    </button>
                  </div>
                </div>
              </div>

              {/* ── 오른쪽 sticky */}
              <div className="upload-right">
                {/* 대표 사진 */}
                <div className="common-card">
                  <div className="common-card-inner upload-card-body--photo">
                    <p className="common-title-sm">대표 사진</p>
                    <p
                      className="common-body-sm-light"
                      style={{ color: "var(--font-placeholder)" }}
                    >
                      잘리지 않게 약간 여백을 두고 촬영해주세요
                    </p>
                    <div
                      className={`upload-photo-zone${editDragging ? " dragging" : ""}${editPhotoPreview || mainImg ? " has-photo" : ""}`}
                      onClick={() => editFileRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setEditDragging(true);
                      }}
                      onDragLeave={() => setEditDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setEditDragging(false);
                        handleEditPhotoFile(e.dataTransfer.files[0]);
                      }}
                    >
                      {editPhotoPreview ? (
                        <img
                          src={editPhotoPreview}
                          alt="대표 사진"
                          className="upload-photo-preview"
                        />
                      ) : mainImg ? (
                        <img
                          src={mainImg.url}
                          alt="현재 대표 사진"
                          className="upload-photo-preview"
                        />
                      ) : (
                        <div className="upload-photo-empty">
                          <div className="upload-photo-icon-wrap">
                            <UploadBoxIcon />
                          </div>
                          <p className="upload-photo-text">
                            사진을 드래그하거나 클릭하세요
                          </p>
                          <p className="upload-photo-sub">
                            JPG, PNG, WEBP 지원
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={editFileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleEditPhotoFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="common-card">
                  <div className="common-card-inner">
                    <p className="common-title-sm">레시피 요약</p>
                    <div className="upload-summary">
                      <div className="upload-summary-row">
                        <span className="upload-summary-label">
                          칵테일 이름
                        </span>
                        <span className="upload-summary-value">
                          {editTitle || "—"}
                        </span>
                      </div>
                      <div className="upload-summary-row">
                        <span className="upload-summary-label">베이스주</span>
                        <span className="upload-summary-value">{editBase}</span>
                      </div>
                      <div className="upload-summary-row">
                        <span className="upload-summary-label">도수</span>
                        <span className="upload-summary-value">
                          {
                            {
                              none: "무알콜",
                              low: "낮은 도수",
                              high: "높은 도수",
                            }[editAbv]
                          }
                        </span>
                      </div>
                      <div className="upload-summary-row">
                        <span className="upload-summary-label">재료</span>
                        <span className="upload-summary-value">
                          {editIngredients.filter((i) => i.name.trim()).length}
                          가지
                        </span>
                      </div>
                      <div className="upload-summary-row">
                        <span className="upload-summary-label">테마</span>
                        {editTheme && (
                          <span className="upload-summary-tag">
                            {editTheme}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="upload-actions">
                  <button
                    className={`btn btn-filled btn-gradient-2 btn-lg${editTitle.trim() ? "" : " btn-disable"}`}
                    disabled={!editTitle.trim()}
                    onClick={saveEditing}
                  >
                    수정 완료
                  </button>
                  <button
                    className="btn btn-lined btn-gray-light btn-lg"
                    onClick={() => setIsEditing(false)}
                  >
                    취소
                  </button>
                  <p className="upload-notice">
                    수정사항은 새로고침 시 초기화됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
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
                      : activeImg.url
                  }
                  alt={card.t}
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
                    <div className="flex-1 min-w-0">
                      <h1 className="detail-cocktail-name">{displayCard.t}</h1>
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
                          title: card.t,
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
                          : card.u + "님의 레시피"}
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
                                      className="size-10 rounded-[10px] overflow-hidden shrink-0"
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
                                  <span className="flex-1 min-w-0 truncate">
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
                        const ingId = ING_LINK_MAP[ing.name];
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
                                  ? {
                                      background: "var(--purple-soft)",
                                      border: "1.5px solid var(--purple-line)",
                                    }
                                  : undefined
                              }
                            >
                              {ing.emoji}
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
                          `https://www.youtube.com/results?search_query=${encodeURIComponent(card.t + " 칵테일 만들기")}`,
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
              src={thumbImgs[lightbox]?.url}
              alt={card.t}
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
