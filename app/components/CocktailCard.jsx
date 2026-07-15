import Link from "next/link";
import Image from "next/image";
import { HeartIcon, PersonIcon } from "./icons";

export default function CocktailCard({ card, cardId, basePath = "/cocktail" }) {
  const href = cardId !== undefined ? `${basePath}/${cardId}` : undefined;
  const inner = (
    <>
      <div className="common-card-item-img-wrap common-card-item-img-wrap--cover">
        <div className="common-card-item-bg" style={{ background: card.gradient }} />
        <Image
          src={card.photo_0}
          alt={card.name}
          className="common-card-item-img"
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="common-card-item-overlay" />
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
        {!card.official && (
          <span className="common-card-item-meta-item">
            <PersonIcon size={13} />
            {card.user || "비활성유저"}
          </span>
        )}
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
