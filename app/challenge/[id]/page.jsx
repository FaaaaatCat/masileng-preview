import { notFound } from "next/navigation";
import CARDS from "../../data/challenge_cards.json";
import POOL_RAW from "../../data/challenge_pool.json";
import { IMG_BASE } from "../../data/constants.json";
import CocktailDetail from "../../components/CocktailDetail";

const POOL = POOL_RAW.map((d) => ({ ...d, url: `${IMG_BASE}${d.f}.jpg` }));

export default async function ChallengePage({ params }) {
  const { id } = await params;
  const cardId = parseInt(id, 10);
  if (isNaN(cardId) || cardId < 0 || cardId >= CARDS.length) notFound();
  const card = CARDS[cardId];
  return <CocktailDetail card={card} cardId={cardId} poolData={POOL} backHref="/" showIllust={false} />;
}
