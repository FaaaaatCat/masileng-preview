"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import POOL_RAW from "../data/challenge_pool.json";
import CARDS_RAW from "../data/challenge_cards.json";
import { IMG_BASE } from "../data/constants.json";
import { HeartIcon, ChatIcon, ChevronRightIcon } from "./icons";
import { PROFILE_BG_COLORS, PROFILE_IMGS } from "../data/profilePresets";
import ProfileAvatar from "./ProfileAvatar";

export const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));
export const CARDS = CARDS_RAW.map((c, i) => ({ ...c, _idx: i }));

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function UserAvatar({ username, size = 28, overrideBg, overrideImg }) {
  const h = hashStr(username);
  const profileBg = overrideBg ?? PROFILE_BG_COLORS[h % PROFILE_BG_COLORS.length];
  const profileImg = overrideImg ?? PROFILE_IMGS[(h >> 4) % PROFILE_IMGS.length];
  return <ProfileAvatar user={{ profileBg, profileImg }} size={size} />;
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
                overrideBg={isMe ? (currentUser.profileBg ?? PROFILE_BG_COLORS[0]) : undefined}
                overrideImg={isMe ? (currentUser.profileImg ?? PROFILE_IMGS[0]) : undefined}
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
