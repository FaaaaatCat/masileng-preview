"use client";

import { useState } from "react";
import "../css/search.scss";

import { searchAll } from "../data/search-helpers";
import SiteHeader from "../components/SiteHeader";
import NoticeBanner from "../components/NoticeBanner";
import CocktailCard from "../components/CocktailCard";
import IngredientCard from "../components/IngredientCard";
import ChallengeCard from "../components/ChallengeCard";

// 한 번에 보여줄 결과 수 — '결과 더 보기' 클릭마다 이만큼 추가 노출
const PAGE_SIZE = 12;

function SearchSection({ icon, title, items, renderItem }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const count = items.length;

  return (
    <section className="search-section">
      <h3 className="search-section-title">
        <img src={icon} alt="" className="search-section-icon" />
        {title}
        {count > 0 && <span className="section-subtitle">{count}개의 검색 결과</span>}
      </h3>
      {count > 0 ? (
        <>
          <div className="cocktail-grid">
            {items.slice(0, visibleCount).map(renderItem)}
          </div>
          {count > visibleCount && (
            <div className="load-more-wrap">
              <button
                className="btn btn-lined btn-gray-light btn-xl"
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              >
                결과 더 보기
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="search-empty">
          <span className="search-empty-icon">🍸</span>
          검색 결과가 없습니다.
        </div>
      )}
    </section>
  );
}

export default function SearchResults({ query }) {
  const { cocktails, ingredients, challenges } = searchAll(query);
  const total = cocktails.length + ingredients.length + challenges.length;

  return (
    <div className="min-h-screen" style={{ background: "var(--page-bg-ivory)" }}>
      <NoticeBanner />
      <SiteHeader initialSearch={query} />

      <div className="page-wrap search-page">
        <h2 className="search-summary">
          <span className="search-summary-keyword">'{query}'</span> 검색 결과
          <span className="search-summary-count">총 {total}개</span>
        </h2>

        {/* 1. 칵테일 — key={query}: 검색어 변경 시 노출 개수 초기화 */}
        <SearchSection
          key={`cocktail-${query}`}
          icon="https://www.masileng.com/test/ic_cocktail.svg"
          title="칵테일"
          items={cocktails}
          renderItem={(card) => (
            <CocktailCard key={card.id} card={card} cardId={card.id} showAuthor={false} />
          )}
        />

        {/* 2. 재료 */}
        <SearchSection
          key={`ingredient-${query}`}
          icon="https://www.masileng.com/test/ic_ingredient.svg"
          title="재료"
          items={ingredients}
          renderItem={(ing) => <IngredientCard key={ing.id} ing={ing} showDesc />}
        />

        {/* 3. 도전!마실랭 */}
        <SearchSection
          key={`challenge-${query}`}
          icon="https://www.masileng.com/test/ic_challenge.svg"
          title="도전!마실랭"
          items={challenges}
          renderItem={(card) => <ChallengeCard key={card.id} card={card} />}
        />
      </div>
    </div>
  );
}
