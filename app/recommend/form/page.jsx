"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const WEATHER_OPTIONS = [
  { key: "sunny",    icon: "/recommend_icon/Property 1=1.sun.png",         label: "맑음" },
  { key: "cloudy",   icon: "/recommend_icon/Property 1=2.littleCloud.png", label: "약간 흐림" },
  { key: "rainy",    icon: "/recommend_icon/Property 1=3.rainy.png",       label: "높은 비" },
  { key: "overcast", icon: "/recommend_icon/Property 1=4.cloudy.png",      label: "구름 많음" },
  { key: "storm",    icon: "/recommend_icon/Property 1=5.thunder.png",     label: "폭풍우" },
  { key: "foggy",    icon: "/recommend_icon/Property 1=6.fog.png",         label: "안개" },
  { key: "hot",      icon: "/recommend_icon/Property 1=7.hot.png",         label: "더움" },
  { key: "cold",     icon: "/recommend_icon/Property 1=8.cold.png",        label: "추움" },
  { key: "snowy",    icon: "/recommend_icon/Property 1=9.snow.png",        label: "눈" },
];

const SITUATION_OPTIONS = [
  { key: "party",       icon: "/recommend_icon/Property 1=1.party.png",    label: "파티" },
  { key: "anniversary", icon: "/recommend_icon/Property 1=2.calendar.png", label: "기념일" },
  { key: "formal",      icon: "/recommend_icon/Property 1=3.suit.png",     label: "격식있게" },
  { key: "bright_date", icon: "/recommend_icon/Property 1=4.sunny.png",    label: "밝은 데이트" },
  { key: "night_date",  icon: "/recommend_icon/Property 1=5.night.png",    label: "심야 데이트" },
  { key: "nightout",    icon: "/recommend_icon/Property 1=6.something.png",label: "밤밖에 말까" },
  { key: "deep_talk",   icon: "/recommend_icon/Property 1=7.talk.png",     label: "진중한 대화" },
  { key: "alone",       icon: "/recommend_icon/Property 1=8.solo.png",     label: "혼자의 휴일" },
  { key: "whatever",    icon: "/recommend_icon/Property 1=9.noMatter.png", label: "상관 없음" },
];

const LOCATION_OPTIONS = [
  { key: "indoor",  icon: "/recommend_icon/Property 1=1.home.png", label: "집에서 만들어요" },
  { key: "outdoor", icon: "/recommend_icon/Property 1=2.bar.png",  label: "밖에서 한잔해요" },
];

const STEPS = [
  { title: "어떤 날씨에 마시나요?",                    options: WEATHER_OPTIONS,   grid: 3 },
  { title: "어떤 상황에 마시나요?",                    options: SITUATION_OPTIONS, grid: 3 },
  { title: "직접 만드시나요?\n아니면 밖에서 마시나요?", options: LOCATION_OPTIONS,  grid: 2 },
];

export default function RecommendFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState([null, null, null]);
  const [cardAnim, setCardAnim] = useState("");
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];

  const select = (key) => {
    const next = [...selections];
    next[step] = key;
    setSelections(next);
  };

  const transition = (nextStep) => {
    setCardAnim("exit");
    setTimeout(() => {
      setStep(nextStep);
      setCardAnim("enter");
      setTimeout(() => setCardAnim(""), 260);
    }, 260);
  };

  const goNext = () => {
    if (step < 2) {
      transition(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        const [weather, situation, location] = selections;
        router.push(`/recommend/${weather}-${situation}-${location}`);
      }, 2500);
    }
  };

  const goBack = () => {
    if (step > 0) transition(step - 1);
  };

  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--dark-0)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <span style={{ fontSize: 80, animation: "rec-bounce 0.8s ease-in-out infinite alternate" }}>
          🍹
        </span>
        <p className="font-bold text-lg text-center" style={{ color: "#f8eef8", letterSpacing: "-0.02em", lineHeight: 1.6 }}>
          바텐더가 열심히<br />추천 하는중...
        </p>
        <style>{`
          @keyframes rec-bounce {
            from { transform: translateY(0) rotate(-6deg); }
            to   { transform: translateY(-20px) rotate(6deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <span className="dark-badge">COCKTAIL RECOMMENDER</span>

      <div className="text-center">
        <h1 className="common-title-lg" style={{ fontSize: 40, color: "var(--gray-9)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          오늘의 칵테일
        </h1>
        <p className="common-body-lg-light" style={{ color: "var(--gray-4)" }}>
          당신에게 딱 맞는 한 잔을 찾아드려요
        </p>
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: "var(--r-full)",
              background: i === step ? "var(--coral)" : "var(--dark-4)",
              transition: "all 0.3s",
              display: "block",
            }}
          />
        ))}
      </div>

      <div
        className="common-card"
        style={{
          width: 480,
          height: 643,
          background: "var(--dark-2)",
          border: "1.5px solid var(--dark-2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className={`common-card-inner ${cardAnim ? ` recommend-card-${cardAnim}` : ""}`}>
          <div className="flex items-center justify-between" style={{ height: 32, flexShrink: 0 }}>
            <p className="common-body-sm-bold" style={{ color: "var(--dark-6)", letterSpacing: "0.1em" }}>
              STEP 0{step + 1}
            </p>
            {step > 0 && (
              <button onClick={goBack} className="btn btn-transparent btn-sm btn-dark">
                ← 이전
              </button>
            )}
          </div>

          <h2 className="common-title-lg" style={{ fontSize: 22, color: "var(--dark-9)", whiteSpace: "pre-line", flexShrink: 0 }}>
            {current.title}
          </h2>

          <div className="h-full">
            <div className="grid gap-3 w-full" style={{ gridTemplateColumns: `repeat(${current.grid}, 1fr)` }}>
              {current.options.map((opt) => {
                const isSelected = selections[step] === opt.key;
                const sizeClass = current.grid === 2 ? "recommend-option--grid2" : "recommend-option--grid3";
                return (
                  <button
                    key={opt.key}
                    onClick={() => select(opt.key)}
                    className={`recommend-option ${sizeClass}${isSelected ? " recommend-option--selected" : ""}`}
                  >
                    <img src={opt.icon} alt={opt.label} className="recommend-option-icon" />
                    <span className="recommend-option-label">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={goNext}
            disabled={!selections[step]}
            className={`w-full btn btn-filled btn-xl btn-dark ${selections[step] ? (step < 2 ? "btn-brand" : "btn-gradient-1") : "btn-disable"}`}
          >
            {step < 2 ? "다음 단계로 →" : "추천받기"}
          </button>
        </div>
      </div>
    </>
  );
}
