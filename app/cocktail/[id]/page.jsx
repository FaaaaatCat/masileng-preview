import { notFound } from "next/navigation";
import COCKTAILS from "../../data/cocktails.json";
import CocktailDetail from "../../page/CocktailDetail";

const CARDS = COCKTAILS.filter((c) => c.official);

export default async function CocktailDetailPage({ params }) {
  const { id } = await params;
  const cardId = parseInt(id, 10);
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) notFound();
  return <CocktailDetail card={card} cardId={cardId} isOfficial={true} />;
}
