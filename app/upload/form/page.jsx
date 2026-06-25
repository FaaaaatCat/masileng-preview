"use client";

import { useState, useRef } from "react";
import SiteHeader from "../../components/SiteHeader";
import { SelectFilter } from "../../components/FilterBar";
import INGREDIENTS_DATA from "../../data/ingredients.json";
import IngredientRequestModal from "../../components/IngredientRequestModal";

const THEMES = [
  { id: "sour", en: "Sour", ko: "상큼발랄", img: "/theme/sour.png" },
  {
    id: "sparkling",
    en: "Sparkling",
    ko: "탄산감",
    img: "/theme/sparkling.png",
  },

  { id: "fruity", en: "Fruity", ko: "과일 잔뜩", img: "/theme/fruity.png" },
  { id: "city", en: "City", ko: "쎈 도수", img: "/theme/city.png" },
  { id: "creamy", en: "Creamy", ko: "크리미", img: "/theme/cramy.png" },
  { id: "hot", en: "Hot", ko: "향신료", img: "/theme/hot.png" },
  { id: "party", en: "Party", ko: "대중적인", img: "/theme/party.png" },
  {
    id: "tropical",
    en: "Tropical",
    ko: "이국적인",
    img: "/theme/tropical.png",
  },
];
const DIFFICULTY_LABELS = ["아주 간단", "쉬움", "보통", "중급", "고급"];

export default function UploadPage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [difficulty, setDifficulty] = useState(0);
  const [diffMode, setDiffMode] = useState("ai");
  const [theme, setTheme] = useState("sour");
  const [ingredients, setIngredients] = useState([
    { id: 1, amount: "", unit: "적당량", name: "얼음" },
    { id: 2, amount: "", unit: "ml", name: "" },
  ]);
  const [subIngredients, setSubIngredients] = useState([]);
  const [steps, setSteps] = useState([{ id: 1, text: "" }]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [ingToast, setIngToast] = useState(false);
  const [ingToastLeaving, setIngToastLeaving] = useState(false);
  const [openSuggestId, setOpenSuggestId] = useState(null);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [ingRequestQuery, setIngRequestQuery] = useState(null);
  const [emptyMsgQuery, setEmptyMsgQuery] = useState("");
  const emptyMsgTimer = useRef(null);
  const fileInputRef = useRef(null);
  const nextIngId = useRef(3);
  const nextStepId = useRef(2);

  const getSuggestions = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INGREDIENTS_DATA.filter(
      (item) =>
        item.n.toLowerCase().includes(q) || item.en.toLowerCase().includes(q),
    ).slice(0, 8);
  };

  const selectTheme = (id) => setTheme((prev) => (prev === id ? null : id));

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: nextIngId.current++, amount: "", unit: "ml", name: "" },
    ]);
  };

  const addSubIngredient = () => {
    setSubIngredients((prev) => [
      ...prev,
      { id: nextIngId.current++, amount: "", unit: "ml", name: "" },
    ]);
  };

  const removeSubIngredient = (id) => {
    setSubIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const updateSubIngredient = (id, field, value) =>
    setSubIngredients((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, [field]: value };
        if (field === "unit" && value === "적당량") updated.amount = "";
        return updated;
      }),
    );

  const handleSuggestKeyDown = (e, ingId, updateFn, ingName) => {
    const suggestions = getSuggestions(ingName);
    if (!suggestions.length || openSuggestId !== ingId) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (highlightIdx >= 0 && suggestions[highlightIdx]) {
        e.preventDefault();
        updateFn(ingId, "name", suggestions[highlightIdx].n);
        setOpenSuggestId(null);
        setHighlightIdx(-1);
      }
    } else if (e.key === "Escape") {
      setOpenSuggestId(null);
      setHighlightIdx(-1);
    }
  };

  const showIngToast = () => {
    setIngToast(true);
    setIngToastLeaving(false);
    setTimeout(() => setIngToastLeaving(true), 1700);
    setTimeout(() => {
      setIngToast(false);
      setIngToastLeaving(false);
    }, 2000);
  };

  const removeIngredient = (id) => {
    if (ingredients.length <= 2) {
      showIngToast();
      return;
    }
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };
  const updateIngredient = (id, field, value) =>
    setIngredients((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, [field]: value };
        if (field === "unit" && value === "적당량") updated.amount = "";
        return updated;
      }),
    );

  const addStep = () => {
    setSteps((prev) => [...prev, { id: nextStepId.current++, text: "" }]);
  };
  const updateStep = (id, value) =>
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text: value } : s)),
    );
  const removeStep = (id) =>
    setSteps((prev) => prev.filter((s) => s.id !== id));

  const handlePhotoFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handlePhotoFile(e.dataTransfer.files[0]);
  };

  const filledIngredients = ingredients.filter((i) => i.name.trim());
  const filledSteps = steps.filter((s) => s.text.trim());

  const handleDiffMode = (mode) => {
    setDiffMode(mode);
    if (mode === "ai") setDifficulty(0);
  };

  return (
    <>
      <SiteHeader />
      {ingToast && (
        <div
          className={`common-toast${ingToastLeaving ? " common-toast--out" : ""}`}
        >
          <span className="common-toast-icon">⚠️</span>
          재료는 최소 2가지를 넣어주세요
        </div>
      )}
      <div className="upload-page">
        <div className="upload-inner">
          {/* Hero */}
          <div className="upload-hero">
            <span className="upload-badge">✨ 새 레시피 등록</span>
            <h1 className="upload-heading">
              나만의 칵테일을
              <br />
              공유해보세요
            </h1>
            <p className="upload-sub">
              레시피를 등록하면 바텐더 팀의 검토 후 공개됩니다.
            </p>
          </div>

          {/* Grid */}
          <div className="upload-grid">
            {/* ── Left column ── */}
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
                      placeholder="예: 미드나이트 로즈"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="upload-field">
                    <label className="upload-label">한 줄 소개</label>
                    <textarea
                      className="common-textarea"
                      placeholder="이 칵테일의 맛, 분위기, 탄생 배경을 간략히 적어주세요."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="upload-field">
                    <label className="upload-label upload-label--icon">
                      <StarIconSolid size={11} filled /> 난이도
                    </label>
                    <div className="upload-diff-row">
                      <button
                        className={`btn btn-sm upload-diff-btn${diffMode === "ai" ? " btn-filled btn-brand" : " btn-lined btn-gray-light"}`}
                        onClick={() => handleDiffMode("ai")}
                      >
                        AI 추천
                      </button>
                      <button
                        className={`btn btn-sm upload-diff-btn${diffMode === "manual" ? " btn-filled btn-brand" : " btn-lined btn-gray-light"}`}
                        onClick={() => handleDiffMode("manual")}
                      >
                        직접 선택
                      </button>
                      <div
                        className={`upload-stars${diffMode === "manual" ? " manual" : " ai"}`}
                      >
                        {diffMode === "ai" ? (
                          <span className="upload-stars-ai-msg">
                            AI가 레시피를 읽고 자동으로 난이도를 추천해드립니다
                          </span>
                        ) : (
                          [1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              className={`upload-star${difficulty >= n ? " filled" : ""}`}
                              onClick={() => setDifficulty(n)}
                              title={DIFFICULTY_LABELS[n - 1]}
                            >
                              <StarIconSolid
                                size={20}
                                filled={difficulty >= n}
                              />
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
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        className={`upload-theme-item${theme === t.id ? " active" : ""}`}
                        onClick={() => selectTheme(t.id)}
                      >
                        <img
                          src={t.img}
                          alt={t.en}
                          className="upload-theme-img"
                        />
                        <span className="upload-theme-en">{t.en}</span>
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
                    {ingredients.map((ing, idx) => {
                      const isNoAmount = ing.unit === "적당량";
                      return (
                        <div key={ing.id} className="upload-ing-row">
                          <div className="upload-ing-num">{idx + 1}</div>
                          <div className="upload-ing-inputs">
                            {/* 재료명 먼저 */}
                            <div
                              className={`common-input-wrap${ing.name ? " has-value" : ""}`}
                            >
                              <SearchIcon />
                              <input
                                className={`common-input common-input--icon${ing.name ? " has-value" : ""}`}
                                type="text"
                                placeholder="재료명 검색"
                                value={ing.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateIngredient(ing.id, "name", val);
                                  setOpenSuggestId(ing.id);
                                  setHighlightIdx(-1);
                                  clearTimeout(emptyMsgTimer.current);
                                  emptyMsgTimer.current = setTimeout(
                                    () => setEmptyMsgQuery(val),
                                    300,
                                  );
                                }}
                                onFocus={() =>
                                  ing.name && setOpenSuggestId(ing.id)
                                }
                                onBlur={() =>
                                  setTimeout(() => { setOpenSuggestId(null); setHighlightIdx(-1); }, 150)
                                }
                                onKeyDown={(e) => handleSuggestKeyDown(e, ing.id, updateIngredient, ing.name)}
                              />
                              {openSuggestId === ing.id && ing.name.trim() && (
                                <div className="ing-suggest-dropdown">
                                  {getSuggestions(ing.name).length > 0 ? (
                                    getSuggestions(ing.name).map((item, i) => (
                                      <div
                                        key={item.id}
                                        className={`ing-suggest-item${highlightIdx === i ? " highlighted" : ""}`}
                                        onMouseDown={() => {
                                          updateIngredient(
                                            ing.id,
                                            "name",
                                            item.n,
                                          );
                                          setOpenSuggestId(null);
                                          setHighlightIdx(-1);
                                        }}
                                      >
                                        <span className="ing-suggest-name">
                                          {item.n}
                                        </span>
                                        <span className="ing-suggest-cat">
                                          {item.cat}
                                        </span>
                                      </div>
                                    ))
                                  ) : emptyMsgQuery === ing.name ? (
                                    <div className="ing-suggest-empty">
                                      <span>
                                        '{ing.name}'이(가) 없습니다. 관리자에게
                                        요청주세요.
                                      </span>
                                      <button
                                        type="button"
                                        className="btn btn-lined btn-gray-light btn-xxs ing-suggest-request-btn"
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          setIngRequestQuery(ing.name);
                                          setOpenSuggestId(null);
                                        }}
                                      >
                                        요청하기
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </div>
                            {/* 용량 */}
                            <input
                              className={`common-input common-input--amount${isNoAmount ? " disabled" : ""}`}
                              type="text"
                              placeholder="용량"
                              value={isNoAmount ? "" : ing.amount}
                              disabled={isNoAmount}
                              onChange={(e) =>
                                updateIngredient(
                                  ing.id,
                                  "amount",
                                  e.target.value,
                                )
                              }
                            />
                            {/* 단위 */}
                            <SelectFilter
                              value={ing.unit}
                              onChange={(v) =>
                                updateIngredient(ing.id, "unit", v)
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
                                <option value="조각">조각</option>
                              </optgroup>
                            </SelectFilter>
                          </div>
                          <button
                            className="upload-ing-del"
                            onClick={() => removeIngredient(ing.id)}
                            title="삭제"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* 부재료 */}
                  {subIngredients.length > 0 && (
                    <div className="upload-ing-list upload-ing-list--sub">
                      {subIngredients.map((ing, idx) => {
                        const isNoAmount = ing.unit === "적당량";
                        return (
                          <div key={ing.id} className="upload-ing-row">
                            <div
                              className="upload-ing-num"
                              style={{
                                background: "var(--point-soft)",
                                color: "var(--point)",
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div className="upload-ing-inputs">
                              <div
                                className={`common-input-wrap${ing.name ? " has-value" : ""}`}
                              >
                                <SearchIcon />
                                <input
                                  className={`common-input common-input--icon${ing.name ? " has-value" : ""}`}
                                  type="text"
                                  placeholder="재료명 검색"
                                  value={ing.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateSubIngredient(ing.id, "name", val);
                                    setOpenSuggestId(ing.id);
                                    setHighlightIdx(-1);
                                    clearTimeout(emptyMsgTimer.current);
                                    emptyMsgTimer.current = setTimeout(
                                      () => setEmptyMsgQuery(val),
                                      300,
                                    );
                                  }}
                                  onFocus={() =>
                                    ing.name && setOpenSuggestId(ing.id)
                                  }
                                  onBlur={() =>
                                    setTimeout(
                                      () => { setOpenSuggestId(null); setHighlightIdx(-1); },
                                      150,
                                    )
                                  }
                                  onKeyDown={(e) => handleSuggestKeyDown(e, ing.id, updateSubIngredient, ing.name)}
                                />
                                {openSuggestId === ing.id &&
                                  ing.name.trim() && (
                                    <div className="ing-suggest-dropdown">
                                      {getSuggestions(ing.name).length > 0 ? (
                                        getSuggestions(ing.name).map((item, i) => (
                                          <div
                                            key={item.id}
                                            className={`ing-suggest-item${highlightIdx === i ? " highlighted" : ""}`}
                                            onMouseDown={() => {
                                              updateSubIngredient(
                                                ing.id,
                                                "name",
                                                item.n,
                                              );
                                              setOpenSuggestId(null);
                                              setHighlightIdx(-1);
                                            }}
                                          >
                                            <span className="ing-suggest-name">
                                              {item.n}
                                            </span>
                                            <span className="ing-suggest-cat">
                                              {item.cat}
                                            </span>
                                          </div>
                                        ))
                                      ) : emptyMsgQuery === ing.name ? (
                                        <div className="ing-suggest-empty">
                                          <span>
                                            '{ing.name}'이(가) 없습니다.
                                            관리자에게 요청주세요.
                                          </span>
                                          <button
                                            type="button"
                                            className="btn btn-lined btn-gray-light btn-xxs ing-suggest-request-btn"
                                            onMouseDown={(e) => {
                                              e.preventDefault();
                                              setIngRequestQuery(ing.name);
                                              setOpenSuggestId(null);
                                            }}
                                          >
                                            요청하기
                                          </button>
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                              </div>
                              <input
                                className={`common-input common-input--amount${isNoAmount ? " disabled" : ""}`}
                                type="text"
                                placeholder="용량"
                                value={isNoAmount ? "" : ing.amount}
                                disabled={isNoAmount}
                                onChange={(e) =>
                                  updateSubIngredient(
                                    ing.id,
                                    "amount",
                                    e.target.value,
                                  )
                                }
                              />
                              <SelectFilter
                                value={ing.unit}
                                onChange={(v) =>
                                  updateSubIngredient(ing.id, "unit", v)
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
                                  <option value="조각">조각</option>
                                </optgroup>
                              </SelectFilter>
                            </div>
                            <button
                              className="upload-ing-del"
                              onClick={() => removeSubIngredient(ing.id)}
                              title="삭제"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      className="upload-add-btn btn-lg"
                      onClick={addIngredient}
                    >
                      <PlusIcon /> 재료 추가
                    </button>
                    <button
                      className="upload-add-btn upload-add-btn--sub btn-lg"
                      onClick={addSubIngredient}
                    >
                      <PlusIcon /> 부재료 추가
                      <div
                        className="upload-tooltip-wrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="upload-tooltip-btn">?</span>
                        <div className="upload-tooltip-box">
                          없어도 되지만 있으면 좋은 재료
                        </div>
                      </div>
                    </button>
                  </div>
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
                    {steps.map((step, idx) => (
                      <div key={step.id} className="upload-step-row">
                        <div className="upload-step-num-wrap">
                          <div className="upload-ing-num">{idx + 1}</div>
                        </div>
                        <textarea
                          className="common-textarea upload-step"
                          placeholder="예: 얼음을 채운 셰이커에 모든 재료를 넣어주세요."
                          value={step.text}
                          onChange={(e) => updateStep(step.id, e.target.value)}
                          rows={2}
                        />
                        {steps.length > 1 && (
                          <button
                            className="upload-ing-del"
                            onClick={() => removeStep(step.id)}
                            title="삭제"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="upload-add-btn btn-lg" onClick={addStep}>
                    <PlusIcon /> 단계 추가
                  </button>
                </div>
              </div>
            </div>

            {/* ── Right column (sticky) ── */}
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
                    className={`upload-photo-zone${dragging ? " dragging" : ""}${photoPreview ? " has-photo" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="대표 사진"
                        className="upload-photo-preview"
                      />
                    ) : (
                      <div className="upload-photo-empty">
                        <div className="upload-photo-icon-wrap">
                          <UploadPhotoIcon />
                        </div>
                        <p className="upload-photo-text">
                          사진을 드래그하거나 클릭하세요
                        </p>
                        <p className="upload-photo-sub">JPG, PNG, WEBP 지원</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handlePhotoFile(e.target.files[0])}
                  />
                </div>
              </div>

              {/* 레시피 요약 */}
              <div className="common-card">
                <div className="common-card-inner">
                  <p className="common-title-sm">레시피 요약</p>
                  <div className="upload-summary">
                    <div className="upload-summary-row">
                      <span className="upload-summary-label">칵테일 이름</span>
                      <span className="upload-summary-value">
                        {name || "—"}
                      </span>
                    </div>
                    <div className="upload-summary-row">
                      <span className="upload-summary-label">난이도</span>
                      <span className="upload-summary-value">
                        {diffMode === "manual" && difficulty > 0
                          ? DIFFICULTY_LABELS[difficulty - 1]
                          : "—"}
                      </span>
                    </div>
                    <div className="upload-summary-row">
                      <span className="upload-summary-label">재료</span>
                      <span className="upload-summary-value">
                        {filledIngredients.length > 0
                          ? `${filledIngredients.length}가지`
                          : "—"}
                      </span>
                    </div>
                    <div className="upload-summary-row">
                      <span className="upload-summary-label">단계</span>
                      <span className="upload-summary-value">
                        {filledSteps.length > 0
                          ? `${filledSteps.length}단계`
                          : "—"}
                      </span>
                    </div>
                    {theme && (
                      <div className="upload-summary-tags">
                        <span className="upload-summary-tag">
                          {THEMES.find((t) => t.id === theme)?.en}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="upload-actions">
                <button
                  className={`btn btn-filled btn-gradient-2 btn-lg${name.trim() ? " " : " btn-disable"}`}
                  disabled={!name.trim()}
                >
                  레시피 등록하기
                </button>
                <button className="btn btn-lined btn-gray-light btn-lg">
                  임시저장
                </button>
                <p className="upload-notice">
                  등록된 레시피는 48시간 내 검토 후 공개됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ingRequestQuery !== null && (
        <IngredientRequestModal
          initialName={ingRequestQuery}
          onClose={() => setIngRequestQuery(null)}
        />
      )}
    </>
  );
}

/* ── Icons ── */

function StarIconSolid({ size = 20, filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5l2.636 5.597 6.044.877-4.37 4.188 1.031 5.943L12 16.25l-5.34 2.855 1.03-5.943-4.37-4.188 6.044-.877z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function UploadPhotoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="22"
      height="22"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
