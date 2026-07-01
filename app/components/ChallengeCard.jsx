"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import COCKTAILS from "../data/cocktails.json";
import { HeartIcon, ChatIcon, ChevronRightIcon } from "./icons";
import { PROFILE_BG_COLORS, PROFILE_IMGS } from "../data/profilePresets";
import ProfileAvatar from "./ProfileAvatar";

export const CARDS = COCKTAILS.filter((c) => !c.official);

function hashStr(s) {
  if (!s) return 0;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function UserAvatar({ username, size = 28, overrideBg, overrideImg }) {
  const h = hashStr(username ?? "");
  const profileBg = overrideBg ?? PROFILE_BG_COLORS[h % PROFILE_BG_COLORS.length];
  const profileImg = overrideImg ?? PROFILE_IMGS[(h >> 4) % PROFILE_IMGS.length];
  return <ProfileAvatar user={{ profileBg, profileImg }} size={size} />;
}

export default function ChallengeCard({ card, currentUser }) {
  const [dropOpen, setDropOpen] = useState(false);
  const wrapRef = useRef(null);

  const userCards = CARDS.filter((c) => c.user === card.user);
  const isMe = currentUser && (currentUser.profileName || currentUser.name) === card.user;

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
      <Link href={`/challenge/${card.id}`} style={{ textDecoration: "none" }}>
        <article className="common-card-item cursor-pointer">
          <div className="common-card-item-img-wrap common-card-item-img-wrap--cover">
            <div className="common-card-item-bg" style={{ background: card.gradient }} />
            <img
              src={card.photo_0}
              alt={card.name}
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
                username={card.user}
                size={28}
                overrideBg={isMe ? (currentUser.profileBg ?? PROFILE_BG_COLORS[0]) : undefined}
                overrideImg={isMe ? (currentUser.profileImg ?? PROFILE_IMGS[0]) : undefined}
              />
              <span className="common-card-item-author-name">{card.user}</span>
            </button>
            <div className="common-card-item-desc-layer">
              <p className="common-card-item-desc">{card.desc}</p>
            </div>
          </div>
          <h4 className="common-title-lg">{card.name}</h4>
          <div className="common-card-item-meta">
            <span className="common-card-item-meta-item">
              <HeartIcon />
              {card.likes}
            </span>
            <span className="common-card-item-meta-item">
              <ChatIcon />
              {card.comments}
            </span>
          </div>
        </article>
      </Link>

      {dropOpen && (
        <div className="common-card-item-author-dropdown">
          <p className="common-card-item-author-dropdown-header">@{card.user}의 레시피</p>
          {userCards.map((uc) => (
            <Link
              key={uc.id}
              href={`/challenge/${uc.id}`}
              className="common-card-item-author-dropdown-item"
              onClick={() => setDropOpen(false)}
            >
              <span className="common-card-item-author-dropdown-name">{uc.name}</span>
              <ChevronRightIcon />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
