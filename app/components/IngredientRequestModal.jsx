"use client";

import { useState, useRef, useEffect } from "react";
import "../css/ingredient-request-modal.css";

const CATEGORIES = ["술(강한 도수)", "술(약한 도수)", "음료수", "주스", "과일", "기타"];

export default function IngredientRequestModal({ initialName = "", onClose }) {
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handlePhoto = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handlePhoto(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !cat) return;
    setSubmitted(true);
  };

  const canSubmit = name.trim() && cat;

  return (
    <div className="irm-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="irm-modal">

        {/* 헤더 */}
        <div className="irm-header">
          <div>
            <h2 className="irm-title">재료 요청하기</h2>
            <p className="irm-desc">마실랭에 없는 재료를 알려주세요. 검토 후 빠르게 추가해드릴게요.</p>
          </div>
          <button className="irm-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {submitted ? (
          <div className="irm-success">
            <span className="irm-success-icon">🎉</span>
            <p className="irm-success-title">요청이 접수되었어요!</p>
            <p className="irm-success-sub">검토 후 마실랭에 반영할게요. 감사합니다 😊</p>
            <button className="btn btn-filled btn-brand btn-md" onClick={onClose}>확인</button>
          </div>
        ) : (
          <form className="irm-form" onSubmit={handleSubmit}>

            {/* 사진 업로드 */}
            <div className="irm-field">
              <label className="irm-label">재료 사진 <span className="irm-optional">선택</span></label>
              <div
                className={`irm-photo-drop${photoPreview ? " irm-photo-drop--has" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="미리보기" className="irm-photo-preview" />
                    <button
                      type="button"
                      className="irm-photo-remove"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); setPhoto(null); setPhotoPreview(null); }}
                    >✕</button>
                  </>
                ) : (
                  <div className="irm-photo-placeholder">
                    <span className="irm-photo-icon">📷</span>
                    <span className="irm-photo-text">클릭하거나 이미지를 드래그하세요</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(e.target.files[0])} />
            </div>

            {/* 재료 이름 */}
            <div className="irm-field">
              <label className="irm-label">재료 이름 <span className="irm-required">*</span></label>
              <input
                className="common-input"
                type="text"
                placeholder="예: 코앙트로, 오이 등"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 재료 설명 */}
            <div className="irm-field">
              <label className="irm-label">재료 설명 <span className="irm-optional">선택</span></label>
              <textarea
                className="irm-textarea"
                placeholder="재료에 대한 간단한 설명을 적어주세요"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
              />
            </div>

            {/* 카테고리 */}
            <div className="irm-field">
              <label className="irm-label">카테고리 <span className="irm-required">*</span></label>
              <div className="irm-cat-grid">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`btn btn-sm irm-cat-btn${cat === c ? " btn-filled btn-brand" : " btn-lined btn-gray-light"}`}
                    onClick={() => setCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 제출 */}
            <button
              type="submit"
              className={`btn btn-lg irm-submit${canSubmit ? " btn-filled btn-brand" : " btn-disable"}`}
              disabled={!canSubmit}
            >
              요청 보내기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
