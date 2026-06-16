import { BASE_SPIRITS, THEMES } from "../data/constants.json";
import { SearchIcon, ChevronIcon, XIcon, ResetIcon } from "./icons";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function SelectFilter({ value, onChange, onClear, placeholder, children }) {
  const active = Boolean(value);
  return (
    <div className="select-wrap">
      <select className={`select-filter${active ? " active" : ""}`}
        value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {children}
      </select>
      {active ? (
        <button className="select-clear-btn"
          onClick={(e) => { e.stopPropagation(); onClear(); }}>
          <XIcon />
        </button>
      ) : (
        <span className="select-chevron"><ChevronIcon /></span>
      )}
    </div>
  );
}

function DualRangeSlider({ min, max, onMinChange, onMaxChange }) {
  const total = 8;
  const pMin = ((min - 2) / total) * 100;
  const pMax = ((max - 2) / total) * 100;
  const isActive = min > 2 || max < 10;

  const handleMinChange = (e) => onMinChange(Math.min(Number(e.target.value), max));
  const handleMaxChange = (e) => onMaxChange(Math.max(Number(e.target.value), min));

  return (
    <div className={`range-wrap${isActive ? " active" : ""}`}>
      <span className="range-label">재료 수</span>
      <div className="range-track-wrap">
        <div className="range-track" />
        <div className="range-fill" style={{ left: `${pMin}%`, width: `${pMax - pMin}%` }} />
        <div className="range-thumb" style={{ left: `${pMin}%` }} />
        <div className="range-thumb" style={{ left: `${pMax}%` }} />
        <input type="range" min={2} max={10} step={1} value={min} onChange={handleMinChange}
          className="range-input" style={{ zIndex: min >= max - 1 ? 5 : 4 }} />
        <input type="range" min={2} max={10} step={1} value={max} onChange={handleMaxChange}
          className="range-input" />
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
          <button className={`btn-iba-toggle${ibaOnly ? " active" : ""}`} onClick={onIbaToggle}>
            <span className="iba-check">
              {ibaOnly && <CheckIcon />}
            </span>
            IBA
          </button>
        )}

        <button className="btn-reset" onClick={onReset}>
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
          <button className="btn-search">검색</button>
        </div>
      </div>
    </div>
  );
}
