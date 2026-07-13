import { useState, useRef, useEffect } from "react";
import { SORT_TABS } from "../data/constants.json";
import { ChevronIcon, CheckIcon } from "./icons";

// 섹션 헤더 정렬 드롭다운 — 트리거는 공통 btn 클래스, 패널은 custom-select-dropdown 재사용
export default function SortDropdown({
  value,
  onChange,
  options = SORT_TABS,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className={`relative ${className}`.trim()} ref={ref}>
      <button
        type="button"
        className="btn btn-transparent btn-xl"
        style={{ padding: "18px" }}
        onClick={() => setOpen((v) => !v)}
      >
        {value}
        <ChevronIcon />
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className={`custom-select-option${value === opt ? " selected" : ""}`}
              onMouseDown={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <span>{opt}</span>
              {value === opt && <CheckIcon />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
