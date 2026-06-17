import { notFound } from "next/navigation";
import INGREDIENTS from "../../data/ingredients.json";
import IngredientDetail from "../../components/IngredientDetail";

export default async function IngredientPage({ params }) {
  const { id } = await params;
  const ingId = parseInt(id, 10);
  const ing = INGREDIENTS.find((i) => i.id === ingId);
  if (!ing) notFound();
  return <IngredientDetail ing={ing} />;
}
