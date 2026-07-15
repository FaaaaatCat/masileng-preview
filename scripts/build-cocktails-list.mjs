// ─────────────────────────────────────────────
//  app/data/cocktails.json(1.1MB, 전체 필드) → cocktails.list.json(경량, minified)
//  목록/카드 렌더용으로 클라이언트 번들에 들어가도 되는 필드만 투영한다.
//  predev / prebuild 훅에서 자동 실행되어 원본 수정 시 항상 최신 상태로 재생성된다.
// ─────────────────────────────────────────────
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "app", "data", "cocktails.json");
const OUT = path.join(__dirname, "..", "app", "data", "cocktails.list.json");

const cocktails = JSON.parse(readFileSync(SRC, "utf-8"));

const list = cocktails.map((c) => ({
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
  ingCount: c.ingredients?.length ?? 0,
}));

writeFileSync(OUT, JSON.stringify(list));

console.log(
  `[build-cocktails-list] ${list.length}개 항목 → ${path.relative(process.cwd(), OUT)}`,
);
