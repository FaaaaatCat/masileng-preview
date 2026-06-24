import Link from "next/link";
import POOL_RAW from "../data/pool.json";
import { IMG_BASE } from "../data/constants.json";
import { HeartIcon, ChatIcon } from "./icons";

export const POOL = POOL_RAW.map((d) => ({
  ...d,
  url: `${IMG_BASE}${d.f}.jpg`,
}));

export default function CocktailCard({ card, cardId, showAuthor = true }) {
  const d = POOL[card.i];
  const href = cardId !== undefined ? `/cocktail/${cardId}` : undefined;
  const inner = (
    <>
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
        {showAuthor && (
          <div className="common-card-item-author">
            <div className="common-card-item-author-avatar" />
            <span className="common-card-item-author-name">@{card.u}</span>
          </div>
        )}
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
      {card.iba && (
        <div className="">
          <span className="common-list-item-tag tag-iba">IBA</span>
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="common-card-item" style={{ textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }
  return <article className="common-card-item" style={{ cursor: "default" }}>{inner}</article>;
}
