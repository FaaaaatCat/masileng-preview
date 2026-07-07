import SearchResults from "../page/SearchResults";

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  return <SearchResults query={q ?? ""} />;
}
