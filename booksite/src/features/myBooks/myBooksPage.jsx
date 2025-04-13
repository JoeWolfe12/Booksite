import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MyBooksBookshelfView from "@/features/myBooks/MyBooksBookshelfView";
import MyBooksTableView from "@/features/myBooks/MyBooksTableView";
import { Button } from "@/components/ui/button";

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("bookshelf");

  useEffect(() => {
    const fetchBooks = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      const userId = user?.id || user?.user?.id;

      if (!userId) return;

      const { data, error } = await supabase
      .from("user_books")
      .select(`
        *,
        book_genres (
          genre_id,
          genres (genre_name)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

      if (error) console.error(error);
      else {
        const formattedBooks = data.map(book => ({
          ...book,
          genres: book.book_genres?.map(bg => bg.genres?.genre_name).filter(Boolean) || []
        }));
        setBooks(formattedBooks);
      }

      setLoading(false);
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-end gap-2 p-4">
        <Button
          variant={view === "bookshelf" ? "default" : "outline"}
          onClick={() => setView("bookshelf")}
        >
          Bookshelf View
        </Button>
        <Button
          variant={view === "table" ? "default" : "outline"}
          onClick={() => setView("table")}
        >
          Table View
        </Button>
      </div>
  
      {view === "bookshelf" && <MyBooksBookshelfView books={books} />}
      {view === "table" && <MyBooksTableView books={books} />}
    </div>
  );

}