"use client";

import { useState, useRef, Fragment } from "react";
import Link from "next/link";
import {
  XIcon,
  ArrowLeftIcon,
  SearchIcon,
  PlusIcon,
  TrashIcon,
  UploadBoxIcon,
  ArrowUpDownIcon,
} from "./icons";
import { SelectFilter } from "./FilterBar";
import INGREDIENTS_DATA from "../data/ingredients.json";
import IngredientRequestModal from "./IngredientRequestModal";

const THEMES = [
  { id: "Sour",      ko: "상큼발랄",  img: "/theme/sour.png" },
  { id: "Sparkling", ko: "탄산감",    img: "/theme/sparkling.png" },
  { id: "Fruity",    ko: "과일 잔뜩", img: "/theme/fruity.png" },
  { id: "City",      ko: "쎈 도수",   img: "/theme/city.png" },
  { id: "Creamy",    ko: "크리미",    img: "/theme/cramy.png" },
  { id: "Hot",       ko: "향신료",    img: "/theme/hot.png" },
  { id: "Party",     ko: "대중적인",  img: "/theme/party.png" },
  { id: "Tropical",  ko: "이국적인",  img: "/theme/tropical.png" },
];

const DIFFICULTY_LABELS = ["아주 간단", "쉬움", "보통", "중급", "고급"];

function StarIconSolid({ size = 20, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"} stroke="currentColor"
      strokeWidth={filled ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5l2.636 5.597 6.044.877-4.37 4.188 1.031 5.943L12 16.25l-5.34 2.855 1.03-5.943-4.37-4.188 6.044-.877z" />
    </svg>
  );
}

/**
 * mode="create" — 신규 레시피 등록
 * mode="edit"   — 기존 레시피 수정
 *
 * Props:
 *   mode            "create" | "edit"
 *   initialValues   편집 모드 초기값 { title, desc, abv, base, theme, diffMode, difficulty, ingredients, steps, photoPreview }
 *   existingPhoto   편집 모드에서 기존 대표 사진 URL
 *   onSubmit(data)  저장 콜백 — data: { title, desc, abv, base, theme, diffMode, difficulty, ingredients, steps, photoPreview }
 *   onCancel()      취소 콜백 (edit 전용)
 */
export default function CocktailForm({
  mode = "create",
  initialValues = {},
  existingPhoto = null,
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";

  const nextIngId  = useRef(isEdit ? 100 : 3);
  const nextStepId = useRef(isEdit ? 100 : 2);
  const fileInputRef = useRef(null);

  const [title,       setTitle]       = useState(initialValues.title       ?? "");
  const [desc,        setDesc]        = useState(initialValues.desc        ?? "");
  const [abv,         setAbv]         = useState(initialValues.abv         ?? "high");
  const [base,        setBase]        = useState(initialValues.base        ?? "위스키");
  const [theme,       setTheme]       = useState(initialValues.theme       ?? (isEdit ? "Sour" : null));
  const [diffMode,    setDiffMode]    = useState(initialValues.diffMode    ?? "ai");
  const [difficulty,  setDifficulty]  = useState(initialValues.difficulty  ?? 0);
  const [ingredients, setIngredients] = useState(
    initialValues.ingredients ?? [
      { id: 1, amount: "", unit: "적당량", name: "얼음", matched: true },
      { id: 2, amount: "", unit: "ml",     name: "",      matched: false },
      { id: 3, amount: "", unit: "ml",     name: "",      matched: false },
    ],
  );
  const [subIngredients,  setSubIngredients]  = useState([]);
  const [steps,           setSteps]           = useState(initialValues.steps ?? [{ id: 1, text: "" }]);
  const [photoPreview,    setPhotoPreview]     = useState(initialValues.photoPreview ?? null);
  const [dragging,        setDragging]         = useState(false);
  const [openSuggestId,   setOpenSuggestId]    = useState(null);
  const [highlightIdx,    setHighlightIdx]     = useState(-1);
  const [ingRequestQuery, setIngRequestQuery]  = useState(null);
  const [emptyMsgQuery,   setEmptyMsgQuery]    = useState("");
  const [ingToast,        setIngToast]         = useState(false);
  const [ingToastLeaving, setIngToastLeaving]  = useState(false);
  const [dragIngId,       setDragIngId]        = useState(null);
  const [clickingIngId,   setClickingIngId]    = useState(null);
  const [ingErrorIds,     setIngErrorIds]      = useState([]);
  const [triedSubmit,     setTriedSubmit]      = useState(false);
  const [showCongrats,    setShowCongrats]     = useState(false);
  const [newRecipeId,     setNewRecipeId]      = useState(null);
  const emptyMsgTimer = useRef(null);
  const dragItemRef   = useRef(null); // { list: "main" | "sub", index }

  // ── 재료 검색 자동완성
  const getSuggestions = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INGREDIENTS_DATA.filter(
      (item) => item.n.toLowerCase().includes(q) || item.en.toLowerCase().includes(q),
    ).slice(0, 8);
  };

  const tryMatchExact = (ingId, name, matchFn) => {
    const exact = INGREDIENTS_DATA.find((item) => item.n === name.trim());
    if (exact) matchFn(ingId, exact.n);
  };

  const handleSuggestKeyDown = (e, ingId, updateFn, matchFn, ingName) => {
    const suggestions = getSuggestions(ingName);
    if (e.key === "Enter") {
      if (openSuggestId === ingId && highlightIdx >= 0 && suggestions[highlightIdx]) {
        e.preventDefault();
        matchFn(ingId, suggestions[highlightIdx].n);
        setOpenSuggestId(null);
        setHighlightIdx(-1);
      } else {
        e.preventDefault();
        tryMatchExact(ingId, ingName, matchFn);
        setOpenSuggestId(null);
        setHighlightIdx(-1);
      }
      return;
    }
    if (!suggestions.length || openSuggestId !== ingId) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setOpenSuggestId(null);
      setHighlightIdx(-1);
    }
  };

  // ── 재료
  const showIngToast = () => {
    setIngToast(true);
    setIngToastLeaving(false);
    setTimeout(() => setIngToastLeaving(true), 1700);
    setTimeout(() => { setIngToast(false); setIngToastLeaving(false); }, 2000);
  };

  const addIngredient = () =>
    setIngredients((prev) => [...prev, { id: nextIngId.current++, amount: "", unit: "ml", name: "" }]);

  const removeIngredient = (id) => {
    if (ingredients.length <= 2) { showIngToast(); return; }
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const updateIngredient = (id, field, value) =>
    setIngredients((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const u = { ...i, [field]: value };
        if (field === "unit" && value === "적당량") u.amount = "";
        if (field === "name") { u.matched = false; u.custom = false; }
        return u;
      }),
    );

  // 과일·기타 카테고리는 계량 없이 '적당량'으로 고정
  const isFreeAmountCat = (name) => {
    const item = INGREDIENTS_DATA.find((d) => d.n === name);
    return !!item && (item.cat === "과일" || item.cat === "기타");
  };

  // 과일·기타면 '적당량'으로, 그 외 카테고리면 '적당량'이었던 단위를 ml로 복원
  const unitByCategory = (i, name, custom) => {
    if (!custom && isFreeAmountCat(name)) return { unit: "적당량", amount: "" };
    if (i.unit === "적당량") return { unit: "ml" };
    return {};
  };

  const matchIngredient = (id, name, custom = false) =>
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, name, matched: true, custom, ...unitByCategory(i, name, custom) }
          : i,
      ),
    );

  // ── 부재료 (create 전용)
  const addSubIngredient = () =>
    setSubIngredients((prev) => [...prev, { id: nextIngId.current++, amount: "", unit: "ml", name: "" }]);

  const removeSubIngredient = (id) =>
    setSubIngredients((prev) => prev.filter((i) => i.id !== id));

  const updateSubIngredient = (id, field, value) =>
    setSubIngredients((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const u = { ...i, [field]: value };
        if (field === "unit" && value === "적당량") u.amount = "";
        if (field === "name") { u.matched = false; u.custom = false; }
        return u;
      }),
    );

  const matchSubIngredient = (id, name, custom = false) =>
    setSubIngredients((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, name, matched: true, custom, ...unitByCategory(i, name, custom) }
          : i,
      ),
    );

  // ── 단계
  const addStep    = () => setSteps((prev) => [...prev, { id: nextStepId.current++, text: "" }]);
  const removeStep = (id) => setSteps((prev) => prev.filter((s) => s.id !== id));
  const updateStep = (id, value) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, text: value } : s)));

  // ── 사진
  const handlePhotoFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // ── 제출
  // 이름·한 줄 소개·난이도만 채워지면 등록 버튼 활성화, 나머지는 클릭 시 섹션별로 검증
  const canTrySubmit = Boolean(
    title.trim() && desc.trim() && (diffMode === "ai" || difficulty > 0),
  );

  const ingComplete = (i) => i.matched && (i.unit === "적당량" || i.amount.trim());
  const ingHasContent = (i) => i.matched || i.name.trim() || i.amount.trim();
  const sectionValid = {
    basic: canTrySubmit,
    theme: !!theme,
    // 빈 행은 무시 — 완성된 재료 2개 이상 + 내용이 있는 행은 모두 완성 상태여야 함
    ingredients:
      ingredients.filter(ingComplete).length >= 2 &&
      [...ingredients, ...subIngredients].filter(ingHasContent).every(ingComplete),
    steps: steps.every((s) => s.text.trim()),
    photo: !!(photoPreview || existingPhoto),
  };

  const handleSubmit = () => {
    if (!canTrySubmit) return;
    // 태그로 변환되지 않고 input으로 남아있는 재료 행 표시
    setIngErrorIds(
      [...ingredients, ...subIngredients]
        .filter((i) => i.name.trim() && !i.matched)
        .map((i) => i.id),
    );
    if (!Object.values(sectionValid).every(Boolean)) {
      setTriedSubmit(true);
      return;
    }
    setTriedSubmit(false);
    // onSubmit이 새 레시피 id를 반환하면 축하 팝업의 '보러가기' 링크에 사용
    const result = onSubmit?.({
      title: title.trim(),
      desc,
      abv,
      base,
      theme,
      diffMode,
      difficulty,
      photoPreview,
      ingredients: [...ingredients, ...subIngredients].filter((ing) => ing.matched).map((ing) => ({
        emoji: "🍹",
        name: ing.name,
        type: "",
        abvStr: null,
        amount: ing.unit === "적당량" ? "적당량" : `${ing.amount}${ing.unit}`,
      })),
      steps: steps.map((s) => s.text),
    });
    if (!isEdit) {
      setNewRecipeId(typeof result === "number" || typeof result === "string" ? result : null);
      setShowCongrats(true);
    }
  };

  // 제출 시도 후 미입력 섹션의 카드 헤더 우측에 표시
  const cardAlert = (key, msg) =>
    triedSubmit && !sectionValid[key] ? <span className="upload-card-alert">{msg}</span> : null;

  // ── 재료 인풋 공통 렌더
  const renderIngRow = (ing, idx, updateFn, removeFn, matchFn, isSubIng = false) => {
    const isNoAmt = ing.unit === "적당량";
    const listKey = isSubIng ? "sub" : "main";
    const setListFn = isSubIng ? setSubIngredients : setIngredients;
    const hasError = ingErrorIds.includes(ing.id) && ing.name.trim() && !ing.matched;
    return (
      <Fragment key={ing.id}>
      <div
        className={`upload-ing-row${clickingIngId === ing.id ? " upload-ing-row--clicking" : ""}`}
        onDragOver={(e) => {
          const drag = dragItemRef.current;
          if (!drag || drag.list !== listKey) return;
          e.preventDefault();
          if (drag.index === idx) return;
          setListFn((prev) => {
            const next = [...prev];
            const [moved] = next.splice(drag.index, 1);
            next.splice(idx, 0, moved);
            return next;
          });
          dragItemRef.current = { list: listKey, index: idx };
        }}
        onDrop={(e) => e.preventDefault()}
      >
        <div
          className={`upload-ing-num${isSubIng ? " upload-ing-num--sub" : ""}`}
          draggable
          onMouseDown={() => {
            setClickingIngId(ing.id);
            window.addEventListener("mouseup", () => setClickingIngId(null), { once: true });
          }}
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", "");
            dragItemRef.current = { list: listKey, index: idx };
            setDragIngId(ing.id);
          }}
          onDragEnd={() => { dragItemRef.current = null; setDragIngId(null); setClickingIngId(null); }}
          title="드래그하여 순서 변경"
        >
          <span className="upload-ing-num-label">{idx + 1}</span>
          <span className="upload-ing-num-drag"><ArrowUpDownIcon /></span>
        </div>
        <div className="upload-ing-inputs">
          <div className="common-input-wrap" style={{ position: "relative" }}>
            {ing.matched ? (
              <div className={`ing-matched-tag${ing.custom ? " ing-matched-tag--custom" : ""}`}>
                <span>{ing.name}</span>
                <button
                  type="button"
                  className="btn btn-transparent btn-xs"
                  style={{ color: ing.custom ? "var(--font-sub)" : "var(--purple)" }}
                  onMouseDown={(e) => { e.preventDefault(); updateFn(ing.id, "name", ""); }}
                  aria-label="재료 삭제"
                >
                  <XIcon size={12} />
                </button>
              </div>
            ) : (
              <>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--font-placeholder)" }}>
                  <SearchIcon />
                </span>
                <input
                  className="common-input common-input--icon"
                  type="text"
                  placeholder="재료명 검색"
                  value={ing.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFn(ing.id, "name", val);
                    setOpenSuggestId(ing.id);
                    setHighlightIdx(-1);
                    clearTimeout(emptyMsgTimer.current);
                    emptyMsgTimer.current = setTimeout(() => setEmptyMsgQuery(val), 300);
                  }}
                  onFocus={() => ing.name && setOpenSuggestId(ing.id)}
                  onBlur={() => setTimeout(() => {
                    tryMatchExact(ing.id, ing.name, matchFn);
                    setOpenSuggestId(null);
                    setHighlightIdx(-1);
                  }, 150)}
                  onKeyDown={(e) => handleSuggestKeyDown(e, ing.id, updateFn, matchFn, ing.name)}
                />
                {openSuggestId === ing.id && ing.name.trim() && (
                  <div className="ing-suggest-dropdown">
                    {getSuggestions(ing.name).length > 0 ? (
                      getSuggestions(ing.name).map((item, i) => (
                        <div
                          key={item.id}
                          className={`ing-suggest-item${highlightIdx === i ? " highlighted" : ""}`}
                          onMouseDown={() => { matchFn(ing.id, item.n); setOpenSuggestId(null); setHighlightIdx(-1); }}
                        >
                          <span className="ing-suggest-name">{item.n}</span>
                          <span className="ing-suggest-cat">{item.cat}</span>
                        </div>
                      ))
                    ) : emptyMsgQuery === ing.name ? (
                      <div className="ing-suggest-empty">
                        <span>'{ing.name}'이(가) 없습니다. 관리자에게 요청주세요.</span>
                        <div className="ing-suggest-empty-actions">
                          <button
                            type="button"
                            className="btn btn-lined btn-gray-light btn-xxs"
                            onMouseDown={(e) => { e.preventDefault(); setIngRequestQuery(ing.name); setOpenSuggestId(null); }}
                          >
                            요청하기
                          </button>
                          <button
                            type="button"
                            className="btn btn-lined btn-gray-light btn-xxs"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              matchFn(ing.id, ing.name.trim(), true);
                              setOpenSuggestId(null);
                              setHighlightIdx(-1);
                            }}
                          >
                            + '{ing.name}' 임시 재료 추가
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </div>
          <input
            className={`common-input common-input--amount${isNoAmt ? " disabled" : ""}`}
            type="text"
            placeholder="용량"
            value={isNoAmt ? "" : ing.amount}
            disabled={isNoAmt}
            onChange={(e) => updateFn(ing.id, "amount", e.target.value)}
          />
          <SelectFilter
            value={ing.unit}
            onChange={(v) => updateFn(ing.id, "unit", v)}
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
        <button className="upload-ing-del" onClick={() => removeFn(ing.id)} title="삭제">
          <TrashIcon />
        </button>
      </div>
      {hasError && <p className="upload-ing-error">재료를 제대로 입력해주세요</p>}
      </Fragment>
    );
  };

  return (
    <>
      {/* create 모드: 상단 X 버튼 */}
      {!isEdit && (
        <Link href="/" className="upload-intro-close" aria-label="홈으로">
          <XIcon />
        </Link>
      )}

      {/* 재료 최소 개수 토스트 */}
      {ingToast && (
        <div className={`common-toast${ingToastLeaving ? " common-toast--out" : ""}`}>
          <span className="common-toast-icon">⚠️</span>
          재료는 최소 2가지를 넣어주세요
        </div>
      )}


      <div className="upload-page">
        <div className="page-wrap page-wrap--sm">
          {/* ── Hero */}
          <div style={{ marginBottom: 40 }}>
            {isEdit ? (
              <button className="btn btn-transparent btn-md" onClick={onCancel}>
                <ArrowLeftIcon />
                페이지로 돌아가기
              </button>
            ) : (
              <Link href="/" className="btn btn-transparent btn-md" aria-label="홈으로">
                <ArrowLeftIcon />
                홈으로 돌아가기
              </Link>
            )}
            <h1 className="upload-heading">
              {isEdit ? (title || "레시피 수정") : "칵테일 레시피 작성"}
            </h1>
            <p className="common-body-lg-light">
              {isEdit
                ? "레시피를 수정하고 있어요 ✏️"
                : "등록한 레시피는 모두가 볼 수 있는 레시피로 공개됩니다."}
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
                    <label className="upload-label">칵테일 이름</label>
                    <input
                      className="common-input"
                      type="text"
                      placeholder={isEdit ? undefined : "예: 미드나이트 로즈"}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="upload-field">
                    <label className="upload-label">한 줄 소개</label>
                    <textarea
                      className="common-textarea"
                      placeholder={isEdit ? undefined : "이 칵테일의 맛, 분위기, 탄생 배경을 간략히 적어주세요."}
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
                        onClick={() => { setDiffMode("ai"); setDifficulty(0); }}
                      >
                        AI 추천
                      </button>
                      <button
                        className={`btn btn-sm upload-diff-btn${diffMode === "manual" ? " btn-filled btn-brand" : " btn-lined btn-gray-light"}`}
                        onClick={() => setDiffMode("manual")}
                      >
                        직접 선택
                      </button>
                      <div className={`upload-stars${diffMode === "manual" ? " manual" : " ai"}`}>
                        {diffMode === "ai" ? (
                          <span className="upload-stars-ai-msg">AI가 레시피를 읽고 자동으로 난이도를 추천해드립니다</span>
                        ) : (
                          [1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              className={`upload-star${difficulty >= n ? " filled" : ""}`}
                              onClick={() => setDifficulty(n)}
                              title={DIFFICULTY_LABELS[n - 1]}
                            >
                              <StarIconSolid size={20} filled={difficulty >= n} />
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
                  {cardAlert("theme", "태그를 선택해주세요")}
                </div>
                <div className="common-card-inner">
                  <div className="upload-theme-grid">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        className={`upload-theme-item${theme === t.id ? " active" : ""}`}
                        onClick={() => setTheme((prev) => (prev === t.id && !isEdit ? null : t.id))}
                      >
                        <img src={t.img} alt={t.id} className="upload-theme-img" />
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
                  {cardAlert("ingredients", "재료를 모두 입력해주세요")}
                </div>
                <div className="common-card-inner">
                  <div className="upload-ing-list">
                    {ingredients.map((ing, idx) => renderIngRow(ing, idx, updateIngredient, removeIngredient, matchIngredient))}
                  </div>

                  {/* 부재료 (create 전용) */}
                  {!isEdit && subIngredients.length > 0 && (
                    <div className="upload-ing-list upload-ing-list--sub">
                      {subIngredients.map((ing, idx) =>
                        renderIngRow(ing, idx, updateSubIngredient, removeSubIngredient, matchSubIngredient, true),
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="upload-add-btn btn-lg" onClick={addIngredient}>
                      <PlusIcon /> 재료 추가
                    </button>
                    {!isEdit && (
                      <button className="upload-add-btn upload-add-btn--sub btn-lg" onClick={addSubIngredient}>
                        <PlusIcon /> 부재료 추가
                        <div className="common-tooltip-wrap" onClick={(e) => e.stopPropagation()}>
                          <span className="upload-tooltip-btn">?</span>
                          <div className="common-tooltip-box">없어도 되지만 있으면 좋은 재료</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 조제 방법 */}
              <div className="common-card">
                <div className="common-card-header">
                  <span className="upload-card-icon">📝</span>
                  <h2 className="common-title-md">조제 방법</h2>
                  {cardAlert("steps", "조제 방법을 입력해주세요")}
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
                          placeholder={isEdit ? undefined : "예: 얼음을 채운 셰이커에 모든 재료를 넣어주세요."}
                          value={step.text}
                          onChange={(e) => updateStep(step.id, e.target.value)}
                          rows={2}
                        />
                        {steps.length > 1 && (
                          <button className="upload-ing-del" onClick={() => removeStep(step.id)} title="삭제">
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

            {/* ── 오른쪽 sticky */}
            <div className="upload-right">
              {/* 대표 사진 */}
              <div className="common-card">
                <div className="common-card-inner upload-card-body--photo">
                  <p className="common-title-sm" style={{ display: "flex" }}>
                    대표 사진
                    {cardAlert("photo", "대표 사진을 등록해주세요")}
                  </p>
                  <p className="common-body-sm-light" style={{ color: "var(--font-placeholder)" }}>
                    잘리지 않게 약간 여백을 두고 촬영해주세요
                  </p>
                  <div
                    className={`upload-photo-zone${dragging ? " dragging" : ""}${photoPreview || existingPhoto ? " has-photo" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); handlePhotoFile(e.dataTransfer.files[0]); }}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="대표 사진" className="upload-photo-preview" />
                    ) : existingPhoto ? (
                      <img src={existingPhoto} alt="현재 대표 사진" className="upload-photo-preview" />
                    ) : (
                      <div className="upload-photo-empty">
                        <div className="upload-photo-icon-wrap"><UploadBoxIcon /></div>
                        <p className="upload-photo-text">사진을 드래그하거나 클릭하세요</p>
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
                      <span className="upload-summary-value">{title || "—"}</span>
                    </div>
                    {isEdit ? (
                      <>
                        <div className="upload-summary-row">
                          <span className="upload-summary-label">베이스주</span>
                          <span className="upload-summary-value">{base}</span>
                        </div>
                        <div className="upload-summary-row">
                          <span className="upload-summary-label">도수</span>
                          <span className="upload-summary-value">
                            {{ none: "무알콜", low: "낮은 도수", high: "높은 도수" }[abv]}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="upload-summary-row">
                        <span className="upload-summary-label">난이도</span>
                        <span className="upload-summary-value">
                          {diffMode === "manual" && difficulty > 0 ? DIFFICULTY_LABELS[difficulty - 1] : "—"}
                        </span>
                      </div>
                    )}
                    <div className="upload-summary-row">
                      <span className="upload-summary-label">재료</span>
                      <span className="upload-summary-value">
                        {ingredients.filter((i) => i.name.trim()).length > 0
                          ? `${ingredients.filter((i) => i.name.trim()).length}가지`
                          : "—"}
                      </span>
                    </div>
                    <div className="upload-summary-row">
                      <span className="upload-summary-label">테마</span>
                      {theme && <span className="common-tag common-tag--coral common-tag--sm">{theme}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="upload-actions">
                <button
                  className={`btn btn-filled btn-gradient-2 btn-lg${canTrySubmit ? "" : " btn-disable"}`}
                  disabled={!canTrySubmit}
                  onClick={handleSubmit}
                >
                  {isEdit ? "수정 완료" : "레시피 등록하기"}
                </button>
                {isEdit && (
                  <button className="btn btn-lined btn-gray-light btn-lg" onClick={onCancel}>
                    취소
                  </button>
                )}
                <p className="upload-notice">
                  {isEdit
                    ? "수정사항은 새로고침 시 초기화됩니다."
                    : "모든 내용을 다 입력해주셔야 합니다."}
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

      {/* 등록 완료 축하 팝업 */}
      {showCongrats && (
        <div className="common-popup-backdrop">
          <div className="common-popup-modal popup-xs">
            <div className="common-popup-success">
              <img
                src="/character_illust/happyLemon.png"
                alt="축하"
                className="upload-congrats-img"
              />
              <p className="common-popup-success-title">레시피 등록 완료!</p>
              <p className="common-popup-success-sub">
                멋진 레시피를 알려주셔서 감사해요! <br /> 모두에게 공유도 해보는건 어때요?
              </p>
              <div className="upload-congrats-actions">
                <Link
                  href={newRecipeId != null ? `/cocktail/${newRecipeId}` : "/"}
                  className="btn btn-filled btn-brand btn-lg"
                >
                  작성한 레시피 보러가기
                </Link>
                <Link href="/" className="btn btn-transparent btn-md">
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
