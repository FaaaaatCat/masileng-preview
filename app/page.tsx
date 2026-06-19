import { Suspense } from "react";
import MasilengHome from "./components/MasilengHome";

export default function Home() {
  return (
    <Suspense>
      <MasilengHome />
    </Suspense>
  );
}
