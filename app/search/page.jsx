import { searchAll } from "../data/search-helpers";
import SearchResults from "../page/SearchResults";

// 카드 렌더에 필요한 필드만 투영 (client 번들에 원본 JSON이 실리지 않도록)
function projectCocktail(c) {
  return {
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
  };
}

function projectIngredient(ing) {
  return { id: ing.id, n: ing.n, en: ing.en, photo: ing.photo, desc: ing.desc };
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q ?? "";
  const { cocktails, ingredients, challenges } = searchAll(query);

  return (
    <SearchResults
      query={query}
      cocktails={cocktails.map(projectCocktail)}
      ingredients={ingredients.map(projectIngredient)}
      challenges={challenges.map(projectCocktail)}
    />
  );
}
