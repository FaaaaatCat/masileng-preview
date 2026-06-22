"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../css/ingredient-detail.css";
import "../css/cocktail-detail.css";

import CARDS_RAW from "../data/cards.json";
import POOL_RAW from "../data/pool.json";
import { IMG_BASE } from "../data/constants.json";
import { getCardTags } from "../data/detail-helpers";
import SiteHeader from "./SiteHeader";

const CARDS = CARDS_RAW.map((c, i) => ({ ...c, _id: i }));
const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

const ING_IMG = "https://www.thecocktaildb.com/images/ingredients/";

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="18"
    height="18"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const RocketIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="12"
    height="12"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const PlusBoxIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="22"
    height="22"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// 재료별 쿠팡 관련상품 (mock)
const PRODUCT_MAP = {
  럼: [
    {
      name: "바카디 슈페리어 럼 750ml",
      price: "28,900원",
      img: "https://www.thecocktaildb.com/images/ingredients/Rum-Medium.png",
      rocket: true,
    },
    {
      name: "앱솔루트 오리지널 보드카 대용량 1L",
      price: "35,000원",
      img: null,
      rocket: false,
    },
  ],
  보드카: [
    {
      name: "스미노프 보드카 375ml",
      price: "14,900원",
      img: "https://www.thecocktaildb.com/images/ingredients/Vodka-Medium.png",
      rocket: true,
    },
    {
      name: "앱솔루트 오리지널 보드카 700ml",
      price: "29,800원",
      img: null,
      rocket: true,
    },
  ],
  진: [
    {
      name: "비피터 진 750ml",
      price: "32,000원",
      img: "https://www.thecocktaildb.com/images/ingredients/Gin-Medium.png",
      rocket: true,
    },
    { name: "탱커레이 진 700ml", price: "38,500원", img: null, rocket: false },
  ],
  토닉워터: [
    {
      name: "슈웹스 토닉워터 캔 355ml x 24개",
      price: "24,900원",
      img: "https://www.thecocktaildb.com/images/ingredients/Tonic Water-Medium.png",
      rocket: true,
    },
    {
      name: "페리에 탄산수 500ml x 12개",
      price: "18,500원",
      img: null,
      rocket: true,
    },
  ],
  라임주스: [
    {
      name: "리얼 라임 100% 착즙 주스 500ml",
      price: "8,900원",
      img: "https://www.thecocktaildb.com/images/ingredients/Lime juice-Medium.png",
      rocket: true,
    },
    {
      name: "몬인 유기농 라임주스 250ml",
      price: "6,500원",
      img: null,
      rocket: false,
    },
  ],
  "계란 흰자": [
    {
      name: "[연말특가] 로에나 스테인레… 체망 계란 분리기",
      price: "4,980원",
      img: "https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2021/01/27/15/7/07bff43b-5e5d-4af9-888a-40b8a6c9da88.jpg",
      rocket: true,
    },
    {
      name: "오뚜기 맛있는 1등급 액상계란 난백 1kg x 2개",
      price: "12,990원",
      img: "https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2021/12/01/15/3/f70c8c5d-8a0c-4da8-b0a0-3ba8a65a2d64.jpg",
      rocket: false,
    },
  ],
  그레나딘: [
    {
      name: "몬인 그레나딘 시럽 700ml",
      price: "12,000원",
      img: "https://www.thecocktaildb.com/images/ingredients/Grenadine-Medium.png",
      rocket: true,
    },
    {
      name: "로즈 그레나딘 시럽 750ml",
      price: "15,500원",
      img: null,
      rocket: false,
    },
  ],
};

const DEFAULT_PRODUCTS = (ing) => [
  {
    name: `${ing.n} 관련 프리미엄 상품`,
    price: "가격 미정",
    img: null,
    rocket: false,
  },
  {
    name: `${ing.en} 칵테일 재료 세트`,
    price: "가격 미정",
    img: null,
    rocket: true,
  },
];

function getProducts(ing) {
  return PRODUCT_MAP[ing.n] || DEFAULT_PRODUCTS(ing);
}

export default function IngredientDetail({ ing }) {
  const imgSrc = `${ING_IMG}${encodeURIComponent(ing.en)}-Medium.png`;
  const [isInBasket, setIsInBasket] = useState(!!ing.myIng);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastLeaving, setToastLeaving] = useState(false);

  const handleBasketToggle = () => {
    const adding = !isInBasket;
    setIsInBasket(adding);
    if (adding) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      setShowToast(true);
      setToastLeaving(false);
      setTimeout(() => setToastLeaving(true), 1700);
      setTimeout(() => {
        setShowToast(false);
        setToastLeaving(false);
      }, 2000);
    }
  };

  // 이 재료를 사용하는 칵테일 (base 기준)
  const relatedCards = CARDS.filter((c) => c.base === ing.n).slice(0, 8);

  const products = getProducts(ing);

  return (
    <>
      <SiteHeader />
      <div className="ing-detail-page">
        {showToast && (
          <div
            className={`common-toast${toastLeaving ? " common-toast--out" : ""}`}
          >
            <span className="common-toast-icon">🧊</span>
            재료를 내 냉장고에 추가했습니다
          </div>
        )}
        <div className="ing-detail-inner">
          <div className="ing-detail-grid">
            {/* ── 왼쪽 ── */}
            <div className="ing-detail-left">
              <Link href="/?tab=재료" className="detail-back-btn">
                <ArrowLeftIcon />
                목록으로
              </Link>

              <div className="ing-detail-img-wrap">
                <img
                  src={imgSrc}
                  alt={ing.n}
                  className="ing-detail-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              <div className="ing-action-btns">
                <button
                  className={`ing-btn-basket btn btn-xl btn-filled ${isInBasket ? "btn-gray-dark" : "btn-gradient-2"}${isAnimating ? " ing-btn-basket--pop" : ""}`}
                  onClick={handleBasketToggle}
                >
                  {isAnimating &&
                    [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <span
                        key={i}
                        className={`basket-sparkle basket-sparkle--${i}`}
                      />
                    ))}
                  {!isInBasket && <PlusBoxIcon />}
                  <span
                    className={`basket-btn-text${isAnimating ? " basket-btn-text--in" : ""}`}
                  >
                    {isInBasket ? "갖고있는 재료입니다!" : "내 재료함에 담기"}
                  </span>
                </button>
                <button
                  className="ing-btn-coupang btn-xxl"
                  onClick={() => alert("쿠팡으로 이동합니다.")}
                >
                  <span className="ing-btn-coupang-left">
                    <span className="ing-btn-coupang-rocket">🚀</span>
                    <span className="ing-btn-coupang-title">
                      쿠팡에서 최저가 구매
                    </span>
                  </span>
                  <ArrowRightIcon />
                </button>
                <p className="ing-btn-coupang-info">
                  파트너스 링크로 구매 시 마실랭 운영에 도움이 됩니다.
                </p>
              </div>
            </div>

            {/* ── 오른쪽 ── */}
            <div className="ing-detail-right">
              {/* 1. 재료 설명 */}
              <div className="ing-detail-card">
                <h1 className="ing-detail-name">{ing.n}</h1>
                <p className="ing-detail-en">{ing.en}</p>
                <span className="ing-detail-cat">{ing.cat}</span>
                <p className="ing-detail-desc">{ing.desc}</p>
              </div>

              {/* 2. 재료 관련 상품 */}
              <div className="ing-detail-card">
                <p className="ing-section-title">
                  <span style={{ color: "var(--coral)", fontStyle: "italic" }}>
                    '{ing.n}'
                  </span>{" "}
                  관련 상품
                </p>
                <p className="ing-section-sub">
                  (파트너스 링크를 통해 구매 시 마실랭 운영에 도움이 됩니다.)
                </p>
                <div className="ing-product-grid">
                  {products.map((p, i) => (
                    <div key={i} className="ing-product-item">
                      <div className="ing-product-img-wrap">
                        {p.img ? (
                          <img
                            src={p.img}
                            alt={p.name}
                            className="ing-product-img"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: 40, opacity: 0.2 }}>🛒</span>
                        )}
                      </div>
                      <p className="ing-product-name">{p.name}</p>
                      <p className="ing-product-price">{p.price}</p>
                      {p.rocket && (
                        <span className="ing-product-rocket">
                          <RocketIcon /> 로켓배송
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 광고 배너 */}
              <div className="ad-banner-test">Google 광고 배너</div>

              {/* 4. 이 재료로 만드는 칵테일 */}
              <div className="ing-detail-card">
                <p className="ing-section-title">
                  이 재료로 만들 수 있는 칵테일
                </p>
                <p className="ing-section-sub">
                  {relatedCards.length > 0
                    ? `${relatedCards.length}가지 칵테일을 확인해보세요`
                    : "등록된 칵테일이 없습니다"}
                </p>
                {relatedCards.length > 0 ? (
                  <div className="ing-cocktail-list">
                    {relatedCards.map((card) => {
                      const poolImg = POOL[card.i % POOL.length];
                      return (
                        <Link
                          key={card._id}
                          href={`/cocktail/${card._id}`}
                          className="common-list-item"
                        >
                          <div className="common-list-item-thumb">
                            <img
                              src={poolImg.url}
                              alt={card.t}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="common-list-item-info">
                            <span className="common-list-item-title">{card.t}</span>
                            <span className="common-list-item-desc">{card.desc}</span>
                            <div className="common-list-item-tags">
                              {getCardTags(card).map((tag) => (
                                <span key={tag} className={`common-list-item-tag${tag === "#IBA" ? " tag-iba" : ""}`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="common-list-item-action">
                            <ChevronRightIcon />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="ing-empty">아직 등록된 칵테일이 없어요.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
