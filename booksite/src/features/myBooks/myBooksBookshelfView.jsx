import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function MyBooksBookshelfView() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("user_books")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching books:", error);
      else setBooks(data);

      setLoading(false);
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading bookshelf...</p>;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-6 p-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="relative group cursor-pointer"
          onClick={() => navigate(`/edit-book/${book.id}`)}
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-auto shadow-md rounded"
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white text-center p-2 rounded">
            <h4 className="text-sm font-bold">{book.title}</h4>
            <p className="text-xs">{book.author}</p>
            <p className="text-xs italic mt-1">{book.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
