"use client";

import Link from "next/link";
import Image from "next/image";

export default function IngredientCard({
  ing,
  isMine = false,
  isBurst = false,
  isRemoving = false,
  onAction,
  actionIcon,
  actionTitle = "",
  showDesc = false,
  imgHeight,
  titleSize = "lg",
  titleCenter = false,
  actionBtnClassName = "",
}) {
  const rootClass = [
    "common-card-item",
    isMine && "common-card-item--mine",
    isBurst && "common-card-item--burst",
    isRemoving && "mypage-shelf-removing",
  ].filter(Boolean).join(" ");

  const btnClass = [
    "common-card-item-basket-btn",
    isMine && "common-card-item-basket-btn--active",
    actionBtnClassName,
  ].filter(Boolean).join(" ");

  return (
    <Link
      href={`/ingredient/${ing.id}`}
      className={rootClass}
      style={{ textDecoration: "none" }}
    >
      <div
        className="common-card-item-img-wrap"
        style={imgHeight ? { height: imgHeight } : undefined}
      >
        {isBurst && <span className="common-card-item-ripple" />}
        <Image
          src={ing.photo}
          alt={ing.n}
          className="common-card-item-img--product"
          width={400}
          height={400}
          onError={(e) => { e.target.style.opacity = "0"; }}
        />
        {onAction && (
          <button
            className={btnClass}
            onClick={(e) => onAction(e, ing.id)}
            title={actionTitle}
          >
            {actionIcon}
          </button>
        )}
      </div>
      <div className="px-0.5">
        <h4
          className={`common-title-${titleSize}`}
          style={titleCenter ? { textAlign: "center" } : undefined}
        >
          {ing.n}
        </h4>
        {showDesc && <p className="common-card-item-desc">{ing.desc}</p>}
      </div>
    </Link>
  );
}
