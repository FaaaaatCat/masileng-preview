import { notFound } from "next/navigation";
import CARDS from "../../data/cards.json";
import CocktailDetail from "../../components/CocktailDetail";

export default async function CocktailDetailPage({ params }) {
  const { id } = await params;
  const cardId = parseInt(id, 10);

  if (isNaN(cardId) || cardId < 0 || cardId >= CARDS.length) {
    notFound();
  }

  const card = CARDS[cardId];
  return <CocktailDetail card={card} cardId={cardId} isOfficial={true} />;
}
