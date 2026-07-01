"use client";

import { useEffect } from "react";
import "../css/common.scss";
import ProfileAvatar from "./ProfileAvatar";

const TEAM = [
  { name: "김경환", role: "기획 / PM",       profileBg: "#A78BFA", profileImg: "profile_img" },
  { name: "황재성", role: "풀스택 개발",      profileBg: "#60A5FA", profileImg: "profile_img-5" },
  { name: "곽태정", role: "프로덕트 디자인",  profileBg: "#FB923C", profileImg: "profile_img-8" },
  { name: "박선주", role: "기획 / 마케팅",    profileBg: "#34D399", profileImg: "profile_img-12" },
  { name: "이동현", role: "웹 개발",          profileBg: "#F472B6", profileImg: "profile_img-16" },
  { name: "신영주", role: "BX / 일러스트",    profileBg: "#FBBF24", profileImg: "profile_img-20" },
  { name: "김유진", role: "백엔드",           profileBg: "#6EE7B7", profileImg: "profile_img-23" },
];

export default function TeamModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="common-popup-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="common-popup-modal popup-sm">
        <div className="common-popup-header">
          <div>
            <h2 className="common-title-lg">마실랭 팀 소개</h2>
          </div>
          <button
            className="common-popup-close"
            type="button"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div
          className="common-popup-body"
          style={{ padding: "20px 24px 28px" }}
        >
          <div
            style={{
              padding: 16,
              background: "var(--yellow-soft)",
              borderRadius: "var(--r-md)",
            }}
          >
            <p className="common-body-md-light">
              마실랭은 2022. 06. 01일 시작한 사이드 프로젝트 팀으로, 개발자들과
              디자이너들이 함께 프로젝트를 만들어가고 있어요.
            </p>
          </div>
          {TEAM.map(({ name, role, profileBg, profileImg }) => (
            <div
              key={name}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <ProfileAvatar user={{ profileBg, profileImg }} size={44} />
              <div>
                <p className="common-body-md" style={{ fontWeight: 600 }}>
                  {name}
                </p>
                <p
                  className="common-body-sm-light"
                  style={{ color: "var(--font-sub2)" }}
                >
                  {role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
