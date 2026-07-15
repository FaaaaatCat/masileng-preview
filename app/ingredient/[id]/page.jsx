import { notFound } from "next/navigation";
import INGREDIENTS from "../../data/ingredients.json";
import COCKTAILS from "../../data/cocktails.json";
import IngredientDetail from "../../page/IngredientDetail";

export default async function IngredientPage({ params }) {
  const { id } = await params;
  const ingId = parseInt(id, 10);
  const ing = INGREDIENTS.find((i) => i.id === ingId);
  if (!ing) notFound();

  // 이 재료를 사용하는 칵테일 (레시피 재료 목록의 ingredientId 기준) — 카드 렌더에 필요한 필드만 투영
  const relatedCards = COCKTAILS.filter(
    (c) => c.official && (c.ingredients || []).some((x) => x.ingredientId === ing.id),
  )
    .slice(0, 8)
    .map((c) => ({
      id: c.id,
      name: c.name,
      desc: c.desc,
      abv: c.abv,
      base: c.base,
      theme: c.theme,
      iba: c.iba,
      official: c.official,
      likes: c.likes,
      user: c.user,
      gradient: c.gradient,
      photo_0: c.photo_0,
    }));

  return <IngredientDetail ing={ing} relatedCards={relatedCards} />;
}
