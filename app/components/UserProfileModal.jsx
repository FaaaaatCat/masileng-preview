"use client";

import { useEffect } from "react";
import Link from "next/link";
import CARDS from "../data/challenge_cards.json";
import POOL_RAW from "../data/challenge_pool.json";
import { IMG_BASE } from "../data/constants.json";
import "../css/user-profile-modal.css";

const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

const AVATAR_COLORS = [
  "#F34B65",
  "#FFC355",
  "#6C63FF",
  "#3ABEF9",
  "#52C87A",
  "#F98162",
  "#9B51E0",
];

export default function UserProfileModal({ username, onClose }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const userCards = CARDS.map((c, i) => ({ ...c, _id: i })).filter(
    (c) => c.u === username,
  );
  const totalLikes = userCards.reduce((s, c) => s + (c.likes || 0), 0);
  const charCode = username ? username.charCodeAt(0) : 0;
  const avatarColor = AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  const initial = username?.[0] ?? "?";

  return (
    <div
      className="profile-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="profile-modal">
        {/* 헤더 */}
        <div className="profile-modal-header">
          <h2 className="common-title-md">유저 프로필</h2>
          <button
            className="profile-modal-close btn-sm"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 유저 기본 정보 */}
        <div className="profile-user-section">
          <div className="profile-avatar" style={{ background: avatarColor }}>
            <span>{initial}</span>
          </div>
          <div className="profile-user-info">
            <h3 className="profile-username">{username}</h3>
            <p className="profile-bio">마실랭 도전! 레시피 크리에이터</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{userCards.length}</span>
                <span className="profile-stat-label">레시피</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="profile-stat-value">
                  {totalLikes.toLocaleString()}
                </span>
                <span className="profile-stat-label">좋아요</span>
              </div>
            </div>
          </div>
        </div>

        {/* 레시피 목록 */}
        <div className="profile-recipes-section">
          <h4 className="common-title-sm">
            등록한 레시피 ({userCards.length})
          </h4>
          <div className="profile-recipes-list">
            {userCards.length === 0 ? (
              <p className="profile-recipes-empty">
                아직 등록한 레시피가 없어요.
              </p>
            ) : (
              userCards.map((card) => {
                const poolImg = POOL[card.i % POOL.length];
                return (
                  <Link
                    key={card._id}
                    href={`/challenge/${card._id}`}
                    className="profile-recipe-item"
                    onClick={onClose}
                  >
                    <div
                      className="profile-recipe-thumb"
                      style={{ background: poolImg?.g }}
                    >
                      <img
                        src={poolImg?.url}
                        alt={card.t}
                        onError={(e) => {
                          e.target.src = "/theme.png";
                        }}
                      />
                    </div>
                    <div className="profile-recipe-info">
                      <span className="profile-recipe-name">{card.t}</span>
                      <span className="profile-recipe-meta">
                        {card.base} · {card.theme}
                      </span>
                    </div>
                    <span className="profile-recipe-likes">♥ {card.likes}</span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
