import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MyBooksBookshelfView from "@/features/myBooks/myBooksBookshelfView";
import MyBooksTableView from "@/features/myBooks/myBooksTabledataView";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("bookshelf");
  const navigate = useNavigate();

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
<div className="flex justify-between items-center p-4">
  <Button
    variant="outline"
    onClick={() => navigate("/books")}
  >
    Search Books
  </Button>

  <div className="flex gap-2">
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
</div>
  
      {view === "bookshelf" && <MyBooksBookshelfView books={books} />}
      {view === "table" && <MyBooksTableView books={books} />}
    </div>
  );

}