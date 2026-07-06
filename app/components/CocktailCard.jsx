import Link from "next/link";
import { HeartIcon, ChatIcon } from "./icons";

export default function CocktailCard({ card, cardId, showAuthor = true }) {
  const href = cardId !== undefined ? `/cocktail/${cardId}` : undefined;
  const inner = (
    <>
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
        {showAuthor && (
          <div className="common-card-item-author">
            <div className="common-card-item-author-avatar" />
            <span className="common-card-item-author-name">@{card.user}</span>
          </div>
        )}
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
