import POOL_RAW from "../data/pool.json";
import { IMG_BASE } from "../data/constants.json";
import { HeartIcon, ChatIcon } from "./icons";

export const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

export default function CocktailCard({ card, showAuthor = true }) {
  const d = POOL[card.i];
  return (
    <article className="card">
      <div className="card-img-wrap">
        <div className="card-bg" style={{ background: d.g }} />
        <img src={d.url} alt={d.n} className="card-img"
          onError={(e) => { e.target.style.display = "none"; }} />
        <div className="card-overlay" />
        {showAuthor && (
          <div className="card-author">
            <div className="card-author-avatar" />
            <span className="card-author-name">@{card.u}</span>
          </div>
        )}
        <div className="card-desc-layer">
          <p className="card-desc">{card.desc}</p>
        </div>
      </div>
      <h4 className="card-title">{card.t}</h4>
      <div className="card-meta">
        <span className="card-meta-item"><HeartIcon />{card.likes}</span>
        <span className="card-meta-item"><ChatIcon />{card.cmt}</span>
      </div>
      {card.iba && (
        <div className="card-tags">
          <span className="tag-iba">IBA</span>
        </div>
      )}
    </article>
  );
}
