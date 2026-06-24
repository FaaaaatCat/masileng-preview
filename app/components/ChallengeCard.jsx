"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import POOL_RAW from "../data/challenge_pool.json";
import CARDS_RAW from "../data/challenge_cards.json";
import { IMG_BASE } from "../data/constants.json";
import { HeartIcon, ChatIcon, ChevronRightIcon } from "./icons";

export const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));
export const CARDS = CARDS_RAW.map((c, i) => ({ ...c, _idx: i }));

const AVATAR_COLORS = [
  "#FFB3C6", "#B5EAD7", "#C4B5FD", "#BAD6F8",
  "#FEFDC1", "#FFCFC9", "#FFB700", "#C8E600",
  "#4ECDC4", "#87CEEB", "#2563EB", "#B0BEC5",
  "#607D8B", "#E63946", "#F472B6", "#9C27B0",
  "#FED7AA", "#A7F3D0", "#FCA5A5", "#93C5FD",
];
const AVATAR_IMGS = [
  "profile_img",
  ...Array.from({ length: 27 }, (_, i) => `profile_img-${i + 1}`),
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function UserAvatar({ username, size = 28, overrideBg, overrideImg }) {
  const h = hashStr(username);
  const bg = overrideBg ?? AVATAR_COLORS[h % AVATAR_COLORS.length];
  const img = overrideImg ?? AVATAR_IMGS[(h >> 4) % AVATAR_IMGS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, overflow: "hidden", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img
        src={`/character_illust/profile_img/${img}.png`}
        alt={username}
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }}
      />
    </div>
  );
}

export default function ChallengeCard({ card, currentUser }) {
  const d = POOL[card.i];
  const [dropOpen, setDropOpen] = useState(false);
  const wrapRef = useRef(null);

  const userCards = CARDS.filter((c) => c.u === card.u);
  const isMe = currentUser && (currentUser.profileName || currentUser.name) === card.u;

  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropOpen]);

  return (
    <div className="relative flex flex-col" ref={wrapRef}>
      <Link href={`/challenge/${card._idx}`} style={{ textDecoration: "none" }}>
        <article className="common-card-item cursor-pointer">
          <div className="common-card-item-img-wrap common-card-item-img-wrap--cover">
            <div className="common-card-item-bg" style={{ background: d.g }} />
            <img
              src={d.url}
              alt={d.n}
              className="common-card-item-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="common-card-item-overlay" />
            <button
              className={`common-card-item-author${dropOpen ? " common-card-item-author--open" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropOpen((v) => !v);
              }}
            >
              <UserAvatar
                username={card.u}
                size={28}
                overrideBg={isMe ? (currentUser.profileBg ?? AVATAR_COLORS[0]) : undefined}
                overrideImg={isMe ? (currentUser.profileImg ?? AVATAR_IMGS[0]) : undefined}
              />
              <span className="common-card-item-author-name">{card.u}</span>
            </button>
            <div className="common-card-item-desc-layer">
              <p className="common-card-item-desc">{card.desc}</p>
            </div>
          </div>
          <h4 className="common-title-lg">{card.t}</h4>
          <div className="common-card-item-meta">
            <span className="common-card-item-meta-item">
              <HeartIcon />
              {card.likes}
            </span>
            <span className="common-card-item-meta-item">
              <ChatIcon />
              {card.cmt}
            </span>
          </div>
        </article>
      </Link>

      {dropOpen && (
        <div className="common-card-item-author-dropdown">
          <p className="common-card-item-author-dropdown-header">@{card.u}의 레시피</p>
          {userCards.map((uc) => (
            <Link
              key={uc._idx}
              href={`/challenge/${uc._idx}`}
              className="common-card-item-author-dropdown-item"
              onClick={() => setDropOpen(false)}
            >
              <span className="common-card-item-author-dropdown-name">{uc.t}</span>
              <ChevronRightIcon />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
