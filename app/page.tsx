import { Suspense } from "react";
import MasilengHome from "./page/MasilengHome";

export default function Home() {
  return (
    <Suspense>
      <MasilengHome />
    </Suspense>
  );
}
