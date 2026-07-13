import { useState, useRef, useEffect } from "react";
import { BASE_SPIRITS, THEMES } from "../data/constants.json";
import { ChevronIcon, XIcon, CheckIcon, FilterIcon } from "./icons";

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

// 데스크톱 filter-row용 재료 수 셀렉트 (다른 필터와 동일한 트리거+드롭다운 패턴, 내부는 DualRangeSlider)
function RangeSelectFilter({ min, max, onMinChange, onMaxChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = min > 2 || max < 10;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = active ? `${min}~${max >= 10 ? "10+" : max}개` : "재료 수";

  return (
    <div className={`custom-select-wrap${open ? " open" : ""}`} ref={ref}>
      <button
        type="button"
        className={`custom-select-trigger custom-select-trigger--large select-style-filter${active ? " active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="custom-select-value">{selectedLabel}</span>
        {active ? (
          <span className="custom-select-clear" onMouseDown={(e) => { e.stopPropagation(); onMinChange(2); onMaxChange(10); setOpen(false); }}>
            <XIcon />
          </span>
        ) : (
          <span className={`custom-select-chevron${open ? " rotated" : ""}`}><ChevronIcon /></span>
        )}
      </button>
      {open && (
        <div className="custom-select-dropdown">
          <DualRangeSlider min={min} max={max} onMinChange={onMinChange} onMaxChange={onMaxChange} />
        </div>
      )}
    </div>
  );
}

// 모바일 필터 팝업용 선택 그룹 (common-tab 필 버튼, 단일 선택)
export function TabFilterGroup({ label, value, onChange, options }) {
  return (
    <div className="filter-popup-group">
      <p className="filter-popup-group-label">{label}</p>
      <div className="filter-popup-group-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`common-tab${value === opt.value ? " active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 모바일 필터 팝업 셸 (백드롭 + 바텀시트 + ESC/스크롤 잠금)
export function FilterPopup({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="common-popup-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="common-popup-modal popup-sm filter-popup-modal">
        <div className="common-popup-header">
          <h2 className="common-title-lg">필터</h2>
          <button className="common-popup-close" type="button" onClick={onClose} aria-label="닫기">
            <XIcon />
          </button>
        </div>
        <div className="common-popup-body">{children}</div>
      </div>
    </div>
  );
}

export default function FilterBar({
  abv, base, theme, ibaOnly, rangeMin, rangeMax,
  onAbvChange, onBaseChange, onThemeChange, onIbaToggle,
  onRangeMinChange, onRangeMaxChange,
  showIba = false,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* 필터 행 */}
      <div className="filter-row">
        <SelectFilter value={abv} onChange={onAbvChange} onClear={() => onAbvChange("")} placeholder="도수">
          <option value="none">무알콜</option>
          <option value="low">약한 도수</option>
          <option value="high">강한 도수</option>
        </SelectFilter>

        <RangeSelectFilter min={rangeMin} max={rangeMax} onMinChange={onRangeMinChange} onMaxChange={onRangeMaxChange} />

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
      </div>

      <button type="button" className="btn btn-lined btn-gray-light btn-xl filter-mobile-trigger" onClick={() => setMobileOpen(true)}>
        <FilterIcon />
        필터
      </button>

      <FilterPopup open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <TabFilterGroup
          label="도수"
          value={abv}
          onChange={onAbvChange}
          options={[
            { value: "", label: "전체" },
            { value: "none", label: "무알콜" },
            { value: "low", label: "약한 도수" },
            { value: "high", label: "강한 도수" },
          ]}
        />
        <TabFilterGroup
          label="베이스주"
          value={base}
          onChange={onBaseChange}
          options={[
            { value: "", label: "전체" },
            ...BASE_SPIRITS.map((v) => ({ value: v, label: v })),
          ]}
        />
        <TabFilterGroup
          label="테마"
          value={theme}
          onChange={onThemeChange}
          options={[
            { value: "", label: "전체" },
            ...THEMES.map((v) => ({ value: v, label: v })),
          ]}
        />
        <div className="filter-popup-group">
          <p className="filter-popup-group-label">재료 수</p>
          <DualRangeSlider
            min={rangeMin}
            max={rangeMax}
            onMinChange={onRangeMinChange}
            onMaxChange={onRangeMaxChange}
          />
        </div>
        {showIba && (
          <div className="filter-popup-group">
            <p className="filter-popup-group-label">IBA 공식 레시피</p>
            <button
              className={`btn btn-md${ibaOnly ? " btn-subfilled btn-brand" : " btn-lined btn-gray-light"}`}
              onClick={onIbaToggle}
            >
              <span className="iba-check">{ibaOnly && <CheckIcon />}</span>
              IBA 공식 레시피만 보기
            </button>
          </div>
        )}
      </FilterPopup>
    </>
  );
}
