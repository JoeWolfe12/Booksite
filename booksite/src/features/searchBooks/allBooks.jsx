import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("user_books")
        .select("*")
        .eq("private", false);

      if (error) {
        console.error("Error fetching public books:", error.message);
      } else {
        setBooks(data);
      }

      setLoading(false);
    };

    fetchBooks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">📚 All Public Books</h2>
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No public books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <Card key={book.id}>
              <CardContent className="p-4">
                {book.cover && (
                  <img
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="w-full h-48 object-cover mb-2 rounded"
                  />
                )}
                <h3 className="font-bold">{book.title}</h3>
                <p className="text-sm text-gray-600">
                  by {book.authors?.join(", ") || "Unknown Author"}
                </p>
                {book.language && (
                  <p className="text-xs text-gray-500 mt-1">
                    Language: {book.language}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
