// ─────────────────────────────────────────────
//  통합 검색 — 칵테일 · 재료 · 도전!마실랭
//  우선순위: 1) 제목 매치 → 2) 설명 매치 → 3) 재료 매치
// ─────────────────────────────────────────────
import COCKTAILS from "./cocktails.json";
import INGREDIENTS from "./ingredients.json";

const OFFICIAL = COCKTAILS.filter((c) => c.official);
const CHALLENGE = COCKTAILS.filter((c) => !c.official);

// 칵테일·도전 레시피: 제목(1) > 설명(2) > 레시피 재료(3)
function rankCocktail(card, q) {
  const has = (s) => (s || "").toLowerCase().includes(q);
  if (has(card.name) || has(card.name_eng)) return 1;
  if (has(card.desc)) return 2;
  if ((card.ingredients || []).some((x) => has(x.name))) return 3;
  return 0;
}

// 재료: 제목(1) > 설명(2)
function rankIngredient(ing, q) {
  const has = (s) => (s || "").toLowerCase().includes(q);
  if (has(ing.n) || has(ing.en)) return 1;
  if (has(ing.desc)) return 2;
  return 0;
}

// 매치된 항목을 우선순위 순으로 정렬 (동순위는 원본 순서 유지)
function collect(list, ranker, q) {
  return list
    .map((item) => ({ item, rank: ranker(item, q) }))
    .filter((x) => x.rank > 0)
    .sort((a, b) => a.rank - b.rank)
    .map((x) => x.item);
}

export function searchAll(query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return { cocktails: [], ingredients: [], challenges: [] };
  return {
    cocktails: collect(OFFICIAL, rankCocktail, q),
    ingredients: collect(INGREDIENTS, rankIngredient, q),
    challenges: collect(CHALLENGE, rankCocktail, q),
  };
}
