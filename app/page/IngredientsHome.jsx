"use client";

import { useState, useEffect, useRef } from "react";
import INGREDIENTS from "../data/ingredients.json";
import { BoxPlusIcon } from "../components/icons";
import IngredientCard from "../components/IngredientCard";
import "../css/ingredient-detail.css";


const CATS = [
  "전체",
  "술(강한 도수)",
  "술(약한 도수)",
  "음료수",
  "주스",
  "과일",
  "기타",
];

const BANNERS = [
  {
    bg: "linear-gradient(120deg,#c8a96e 0%,#8b6914 100%)",
    text1: "구리 머그잔으로",
    text2: "멋스럽고 맛있게 마시자!",
    tag: "Moscow Mule",
  },
  {
    bg: "linear-gradient(120deg,#2563eb 0%,#06b6d4 100%)",
    text1: "토닉워터",
    text2: "칵테일에 청량감을 더하다!",
    tag: "Tonic Water",
  },
  {
    bg: "linear-gradient(120deg,#1e293b 0%,#334155 100%)",
    text1: "얼음도 스타일이다",
    text2: "얼음틀로 간단히 뚝딱",
    tag: "Ice",
  },
  {
    bg: "linear-gradient(120deg,#0ea5e9 0%,#e0f2fe 100%)",
    text1: "미지근한 칵테일 노노",
    text2: "얼음은 올웨이즈 필수",
    tag: "Ice",
  },
  {
    bg: "linear-gradient(120deg,oklch(0.55 0.22 18) 0%,oklch(0.72 0.18 50) 100%)",
    text1: "마실랭 추천 베이스주",
    text2: "오늘은 어떤 한 잔으로?",
    tag: "마실랭 Pick",
  },
];

// 무한 슬라이드: 원본 5개 + 복제 5개 = 10개, 1칸씩 이동 후 5칸째에서 스냅 리셋
const BANNER_ITEMS = [...BANNERS, ...BANNERS];

function SlidingBanner() {
  const [idx, setIdx] = useState(0);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => prev + 1);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // idx가 5(복제본 시작)에 도달하면 애니메이션 없이 0으로 리셋
  useEffect(() => {
    if (idx === 5) {
      const t = setTimeout(() => {
        setAnimated(false);
        setIdx(0);
        // 한 프레임 뒤 애니메이션 복원
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setAnimated(true)),
        );
      }, 620);
      return () => clearTimeout(t);
    }
  }, [idx]);

  return (
    <div className="sliding-banner-wrap">
      <div
        className="sliding-banner-track"
        style={{
          transform: `translateX(calc(-${idx} * 10%))`,
          transition: animated ? "transform 0.6s ease" : "none",
        }}
      >
        {BANNER_ITEMS.map((b, i) => (
          <div
            key={i}
            className="sliding-banner-item"
            style={{ background: b.bg }}
          >
            <span className="sliding-banner-tag">{b.tag}</span>
            <p className="sliding-banner-text1">{b.text1}</p>
            <p className="sliding-banner-text2">{b.text2}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IngredientsHome() {
  const [cat, setCat] = useState("전체");
  const [myIngIds, setMyIngIds] = useState(
    () => new Set(INGREDIENTS.filter((i) => i.myIng).map((i) => i.id)),
  );
  const [burstIds, setBurstIds] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastLeaving, setToastLeaving] = useState(false);
  const toastTimers = useRef([]);

  const showToastMsg = () => {
    toastTimers.current.forEach(clearTimeout);
    setShowToast(true);
    setToastLeaving(false);
    const t1 = setTimeout(() => setToastLeaving(true), 1700);
    const t2 = setTimeout(() => {
      setShowToast(false);
      setToastLeaving(false);
    }, 2000);
    toastTimers.current = [t1, t2];
  };

  const toggleMyIng = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setMyIngIds((prev) => {
      const next = new Set(prev);
      const adding = !next.has(id);
      adding ? next.add(id) : next.delete(id);
      if (adding) {
        setBurstIds((b) => new Set([...b, id]));
        setTimeout(
          () =>
            setBurstIds((b) => {
              const n = new Set(b);
              n.delete(id);
              return n;
            }),
          700,
        );
        showToastMsg();
      }
      return next;
    });
  };

  const filtered = INGREDIENTS.filter((ing) => {
    if (cat !== "전체" && ing.cat !== cat) return false;
    return true;
  });

  return (
    <div className="pb-20">
      {showToast && (
        <div
          className={`common-toast${toastLeaving ? " common-toast--out" : ""}`}
        >
          <span className="common-toast-icon">🧊</span>
          재료를 내 냉장고에 추가했습니다
        </div>
      )}

      {/* 슬라이딩 배너 */}
      <SlidingBanner />

      <div className="page-wrap">
        {/* 필터 */}
        <div className="filter-bar">
          {/* 카테고리 탭 */}
          <div className="flex gap-2 py-3.5 overflow-x-auto">
            {CATS.map((c) => (
              <button
                key={c}
                className={`ing-cat-tab${cat === c ? " active" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 재료 그리드 */}
        <div className="cocktail-grid">
          {filtered.map((ing) => (
            <IngredientCard
              key={ing.id}
              ing={ing}
              isMine={myIngIds.has(ing.id)}
              isBurst={burstIds.has(ing.id)}
              onAction={toggleMyIng}
              actionIcon={myIngIds.has(ing.id) ? (
                <img src="/icon_my.svg" alt="내 재료" width="28" height="28" />
              ) : (
                <BoxPlusIcon />
              )}
              actionTitle={myIngIds.has(ing.id) ? "갖고있는 재료입니다!" : "내 재료함에 담기"}
              showDesc
            />
          ))}
        </div>
      </div>
    </div>
  );
}
