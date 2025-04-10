import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchBooks } from "./searchAPI";

export default function SearchForm({ onResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const results = await searchBooks(query);
      onResults(results);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
      <Input
        type="text"
        placeholder="Search for a book..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </Button>
      {error && <p className="text-red-500 text-sm ml-4">{error}</p>}
    </form>
  );
}
