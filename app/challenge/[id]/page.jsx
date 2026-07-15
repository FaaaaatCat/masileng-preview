import { notFound } from "next/navigation";
import COCKTAILS from "../../data/cocktails.json";
import CocktailDetail from "../../page/CocktailDetail";

const CARDS = COCKTAILS.filter((c) => !c.official);

export default async function ChallengePage({ params }) {
  const { id } = await params;
  const cardId = parseInt(id, 10);
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) notFound();
  const authorCards = COCKTAILS.filter(
    (c) => !c.official && c.user === card.user,
  ).map((c) => ({ id: c.id, name: c.name, gradient: c.gradient, photo_0: c.photo_0 }));
  return (
    <CocktailDetail
      card={card}
      cardId={cardId}
      backHref="/"
      showIllust={false}
      authorCards={authorCards}
    />
  );
}
