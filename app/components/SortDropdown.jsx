import { SORT_TABS } from "../data/constants.json";
import { SortToggleIcon } from "./icons";

// 섹션 헤더 정렬 토글 버튼 — 클릭 시 최신순 ↔ 인기순 전환, 트리거는 공통 btn 클래스 재사용
export default function SortDropdown({
  value,
  onChange,
  options = SORT_TABS,
  className = "",
}) {
  return (
    <div className={`relative ${className}`.trim()}>
      <button
        type="button"
        className="btn btn-transparent btn-xl"
        style={{ padding: "18px" }}
        onClick={() => onChange(options[(options.indexOf(value) + 1) % options.length])}
      >
        {value}
        <SortToggleIcon />
      </button>
    </div>
  );
}
