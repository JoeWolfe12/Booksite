import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PublicReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("user_books")
        .select(`
          id,
          title,
          authors,
          cover,
          rating,
          notes,
          created_at,
          profiles ( username )
        `)
        .eq("private", false)
        .or("notes.not.is.null,rating.not.is.null")
        .order("created_at", { ascending: false });

      if (error) console.error("Error loading public reviews:", error);
      else setReviews(data || []);
    };

    fetchReviews();
  }, []);

  const filtered = reviews.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(term) ||
      r.authors?.toLowerCase().includes(term) ||
      r.profiles?.username?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Public Book Reviews</h2>

      <Input
        type="text"
        placeholder="Search by title, author, or reviewer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map((book) => (
        <Card key={book.id} className="mt-4">
          <CardContent className="p-4 space-y-2">
            <div className="flex gap-4 items-start">
              {book.cover && (
                <img src={book.cover} alt={book.title} className="w-20 h-28 object-cover" />
              )}
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">by {book.authors}</p>
                <p className="text-sm text-gray-500">Reviewed by {book.profiles?.username}</p>
                {book.rating && <p>Rating: {book.rating}/5</p>}
                {book.notes && <p className="mt-2 text-sm">{book.notes}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
