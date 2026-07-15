"use client";

import "../css/search.scss";

import SiteHeader from "../components/SiteHeader";
import NoticeBanner from "../components/NoticeBanner";
import CocktailCard from "../components/CocktailCard";
import IngredientCard from "../components/IngredientCard";

function SearchSection({ icon, title, items, renderItem }) {
  const count = items.length;

  return (
    <section className="search-section">
      <h3 className="search-section-title">
        <img src={icon} alt="" className="search-section-icon" />
        {title}
        {count > 0 && <span className="section-subtitle">{count}개의 검색 결과</span>}
      </h3>
      {count > 0 ? (
        <div className="cocktail-grid">{items.map(renderItem)}</div>
      ) : (
        <div className="search-empty">
          <span className="search-empty-icon">🍸</span>
          검색 결과가 없습니다.
        </div>
      )}
    </section>
  );
}

export default function SearchResults({ query, cocktails, ingredients, challenges }) {
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
            <CocktailCard key={card.id} card={card} cardId={card.id} />
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
          renderItem={(card) => (
            <CocktailCard key={card.id} card={card} cardId={card.id} basePath="/challenge" />
          )}
        />
      </div>
    </div>
  );
}
