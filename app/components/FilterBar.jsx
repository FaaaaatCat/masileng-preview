import { useState, useRef, useEffect } from "react";
import { BASE_SPIRITS, THEMES } from "../data/constants.json";
import { ChevronIcon, XIcon, ResetIcon, CheckIcon, FilterIcon } from "./icons";

export function SelectFilter({ value, onChange, onClear, placeholder, children, size = "large", styleVariant = "select-style-filter" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = Boolean(value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [];
  const childArray = (Array.isArray(children) ? children : [children]).filter(Boolean);
  for (const child of childArray) {
    if (child.type === "optgroup") {
      options.push({ isGroup: true, label: child.props.label });
      const gc = child.props.children;
      (Array.isArray(gc) ? gc : [gc]).filter(Boolean).forEach((c) =>
        options.push({ value: c.props.value, label: c.props.children })
      );
    } else {
      options.push({ value: child.props.value, label: child.props.children });
    }
  }

  const selectedLabel = value ? (options.find((o) => o.value === value)?.label ?? placeholder) : placeholder;

  return (
    <div className={`custom-select-wrap${open ? " open" : ""}`} ref={ref}>
      <button
        type="button"
        className={`custom-select-trigger custom-select-trigger--${size} ${styleVariant}${active ? " active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="custom-select-value">{selectedLabel}</span>
        {active && onClear ? (
          <span className="custom-select-clear" onMouseDown={(e) => { e.stopPropagation(); onClear(); setOpen(false); }}>
            <XIcon />
          </span>
        ) : (
          <span className={`custom-select-chevron${open ? " rotated" : ""}`}><ChevronIcon /></span>
        )}
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {options.map((opt, i) =>
            opt.isGroup ? (
              <div key={`g-${i}`} className="custom-select-group-label">{opt.label}</div>
            ) : (
              <div
                key={opt.value}
                className={`custom-select-option${value === opt.value ? " selected" : ""}`}
                onMouseDown={() => { onChange(opt.value); setOpen(false); }}
              >
                <span>{opt.label}</span>
                {value === opt.value && <CheckIcon />}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function DualRangeSlider({ min, max, onMinChange, onMaxChange }) {
  const total = 8;
  const pMin = ((min - 2) / total) * 100;
  const pMax = ((max - 2) / total) * 100;
  const isActive = min > 2 || max < 10;
  const [dragging, setDragging] = useState(null); // 'min' | 'max' | null

  const handleMinChange = (e) => onMinChange(Math.min(Number(e.target.value), max));
  const handleMaxChange = (e) => onMaxChange(Math.max(Number(e.target.value), min));

  // 드래그 중인 핸들을 항상 위로, 겹쳤을 때는 max 핸들 우선
  const minZIndex = dragging === 'min' ? 5 : (dragging === 'max' ? 3 : (min >= max ? 5 : 4));
  const maxZIndex = dragging === 'max' ? 5 : (dragging === 'min' ? 3 : 5);

  return (
    <div className={`range-wrap${isActive ? " active" : ""}`}>
      <span className="range-label">재료 수</span>
      <div className="range-track-wrap">
        <div className="range-track" />
        <div className="range-fill" style={{ left: `${pMin}%`, width: `${pMax - pMin}%` }} />
        <div className="range-thumb" style={{ left: `${pMin}%` }} />
        <div className="range-thumb" style={{ left: `${pMax}%` }} />
        <input type="range" min={2} max={10} step={1} value={min} onChange={handleMinChange}
          className="range-input" style={{ zIndex: minZIndex }}
          onPointerDown={() => setDragging('min')} onPointerUp={() => setDragging(null)} />
        <input type="range" min={2} max={10} step={1} value={max} onChange={handleMaxChange}
          className="range-input" style={{ zIndex: maxZIndex }}
          onPointerDown={() => setDragging('max')} onPointerUp={() => setDragging(null)} />
      </div>
      <span className="range-value">{min}~{max >= 10 ? "10+" : max}개</span>
      {isActive && (
        <button className="range-clear-btn"
          onClick={() => { onMinChange(2); onMaxChange(10); }}>
          <XIcon />
        </button>
      )}
    </div>
  );
}

export default function FilterBar({
  abv, base, theme, ibaOnly, rangeMin, rangeMax,
  onAbvChange, onBaseChange, onThemeChange, onIbaToggle,
  onRangeMinChange, onRangeMaxChange, onReset,
  showIba = false,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const filterFields = (
    <>
      {/* 필터 행 */}
      <div className="filter-row">
        <SelectFilter value={abv} onChange={onAbvChange} onClear={() => onAbvChange("")} placeholder="도수">
          <option value="none">무알콜</option>
          <option value="low">약한 도수</option>
          <option value="high">강한 도수</option>
        </SelectFilter>

        <DualRangeSlider min={rangeMin} max={rangeMax} onMinChange={onRangeMinChange} onMaxChange={onRangeMaxChange} />

        <SelectFilter value={base} onChange={onBaseChange} onClear={() => onBaseChange("")} placeholder="베이스주">
          {BASE_SPIRITS.map((v) => <option key={v} value={v}>{v}</option>)}
        </SelectFilter>

        <SelectFilter value={theme} onChange={onThemeChange} onClear={() => onThemeChange("")} placeholder="테마">
          {THEMES.map((v) => <option key={v} value={v}>{v}</option>)}
        </SelectFilter>

        {showIba && (
          <button className={`btn btn-xl${ibaOnly ? " btn-subfilled btn-brand" : " btn-lined btn-gray-light"}`} onClick={onIbaToggle}>
            <span className="iba-check">
              {ibaOnly && <CheckIcon />}
            </span>
            IBA
            <span className="common-tooltip-wrap iba-help-wrap" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
              <span className="iba-help-icon">?</span>
              <span className="common-tooltip-box">국제 바텐더 협회(IBA)에서 공식 인정한 표준 레시피</span>
            </span>
          </button>
        )}

        <button className="btn btn-lined btn-gray-light btn-xl" onClick={onReset}>
          <ResetIcon />
          초기화
        </button>
      </div>
    </>
  );

  return (
    <div className="filter-bar">
      <div className="filter-inline">{filterFields}</div>

      <button type="button" className="btn btn-lined btn-gray-light btn-xl filter-mobile-trigger" onClick={() => setMobileOpen(true)}>
        <FilterIcon />
        필터
      </button>

      {mobileOpen && (
        <div
          className="common-popup-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div className="common-popup-modal popup-sm filter-popup-modal">
            <div className="common-popup-header">
              <h2 className="common-title-lg">필터</h2>
              <button className="common-popup-close" type="button" onClick={() => setMobileOpen(false)} aria-label="닫기">
                <XIcon />
              </button>
            </div>
            <div className="common-popup-body">{filterFields}</div>
          </div>
        </div>
      )}
    </div>
  );
}
