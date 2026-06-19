import { useState, useRef, useEffect } from "react";
import { BASE_SPIRITS, THEMES } from "../data/constants.json";
import { SearchIcon, ChevronIcon, XIcon, ResetIcon } from "./icons";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

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

  const options = (Array.isArray(children) ? children : [children]).filter(Boolean).map((child) => ({
    value: child.props.value,
    label: child.props.children,
  }));

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
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-select-option${value === opt.value ? " selected" : ""}`}
              onMouseDown={() => { onChange(opt.value); setOpen(false); }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <CheckIcon />}
            </div>
          ))}
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
  abv, base, theme, ibaOnly, rangeMin, rangeMax, search,
  onAbvChange, onBaseChange, onThemeChange, onIbaToggle,
  onRangeMinChange, onRangeMaxChange,
  onSearchChange, onReset,
  showIba = false,
}) {
  return (
    <div className="filter-bar">
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
          <button className={`btn btn-gray-light${ibaOnly ? " btn-subfilled" : " btn-lined"}`} onClick={onIbaToggle}>
            <span className="iba-check">
              {ibaOnly && <CheckIcon />}
            </span>
            IBA
            <span className="iba-help-wrap" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
              <span className="iba-help-icon">?</span>
              <span className="iba-help-tooltip">국제 바텐더 협회(IBA)에서 공식 인정한 표준 레시피</span>
            </span>
          </button>
        )}

        <button className="btn btn-lined btn-gray-light" onClick={onReset}>
          <ResetIcon />
          초기화
        </button>
      </div>

      {/* 검색 행 */}
      <div className="search-row">
        <div className="search-bar">
          <SearchIcon />
          <input type="text" className="search-input"
            value={search} onChange={(e) => onSearchChange(e.target.value)}
            placeholder="만들고 싶은 칵테일, 또는 재료를 검색하세요" />
          <button className="btn btn-filled btn-brand">검색</button>
        </div>
      </div>
    </div>
  );
}
