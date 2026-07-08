"use client";

import { useState } from "react";

export default function NoticeBanner({
  message = "마실랭 웹사이트 완전 업데이트 (2026.07.01)",
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className="notice-banner"
      style={{
        height: 32,
        background: "#280e56",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div className="notice-banner-content flex items-center justify-center gap-3 min-w-0 max-w-[calc(100%-104px)]">
        <div
          style={{
            padding: "2px 10px",
            background: "var(--purple)",
            borderRadius: "var(--r-md)",
            flexShrink: 0,
          }}
        >
          <p
            className="common-body-sm-bold"
            style={{
              color: "white",
            }}
          >
            새소식
          </p>
        </div>
        <span className="notice-banner-text common-body-md-light truncate" style={{ color: "white" }}>
          {message}
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        type="button"
        className="btn btn-transparent btn-lg"
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
        }}
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}
