import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchBooks } from "./searchAPI";

export default function SearchForm({ onResults }) {
  const [fields, setFields] = useState({ title: "", author: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
  
    const title = fields.title.trim();
    const author = fields.author.trim();
    if (!title && !author) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const results = await searchBooks({ title, author }); // update API call
      onResults(results);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  
    setLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4 mb-4">
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
    <Input
      type="text"
      placeholder="Title"
      value={fields.title}
      onChange={(e) =>
        setFields((prev) => ({ ...prev, title: e.target.value }))
      }
    />
    <Input
      type="text"
      placeholder="Author"
      value={fields.author}
      onChange={(e) =>
        setFields((prev) => ({ ...prev, author: e.target.value }))
      }
    />
    <Button type="submit" disabled={loading}>
      {loading ? "Searching..." : "Search"}
    </Button>
  </div>

  {error && <p className="text-red-500 text-sm">{error}</p>}
</form>
  );
}
