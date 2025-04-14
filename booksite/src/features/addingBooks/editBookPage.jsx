import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const fetchBookAndGenres = async () => {
      // Fetch book
      const { data: bookData, error: bookError } = await supabase
        .from("user_books")
        .select("*")
        .eq("id", id)
        .single();
  
      // Fetch all genres
      const { data: genresData } = await supabase.from("genres").select("*");
      setAllGenres(genresData || []);
  
      // Fetch selected genres for this book
      const { data: bookGenres } = await supabase
        .from("book_genres")
        .select("genre_id")
        .eq("book_id", id);
  
      setSelectedGenres(bookGenres?.map((g) => g.genre_id) || []);
  
      if (bookError) setError("Could not find book.");
      else setBook(bookData);
  
      setLoading(false);
    };
  
    fetchBookAndGenres();
  }, [id]);

  const handleSave = async () => {
    const { error } = await supabase
      .from("user_books")
      .update({
        title: book.title,
        author: book.author,
        status: book.status,
        notes: book.notes,
        pages: book.pages,
        date_started: book.date_started || null,
        date_finished: book.date_finished || null,
        rating: book.rating || null,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      setError("Failed to update book.");
    } else {
      navigate("/my-books");
    }

    await supabase.from("book_genres").delete().eq("book_id", id);

    const genreInserts = selectedGenres.map((genre_id) => ({
      book_id: id,
      genre_id,
    }));

    if (genreInserts.length > 0) {
      await supabase.from("book_genres").insert(genreInserts);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("user_books")
      .delete()
      .eq("id", id);
  
    if (error) {
      console.error("Delete error:", error);
      setError("Failed to delete the book.");
    } else {
      navigate("/my-books");
    }
  };

  if (loading) return <p>Loading book...</p>;
  if (!book) return <p>{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Edit Book</h2>

      <div>
        <Label>Title</Label>
        <Input
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
        />
      </div>

      <div>
        <Label>Author</Label>
        <Input
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
        />
      </div>

      <div>
    <Label>Genres</Label>
    <div className="flex flex-wrap gap-3 p-3 border rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-gray-100">
  {allGenres.map((genre) => (
      <label key={genre.id} className="flex items-center gap-2">
        <input
          type="checkbox"
          className="w-4 h-4 border border-gray-400 accent-blue-600"
          value={genre.id}
          checked={selectedGenres.includes(genre.id?.toString())}
          onChange={(e) => {
            const updated = e.target.checked
  ? [...selectedGenres, genre.id.toString()]
  : selectedGenres.filter((g) => g !== genre.id.toString());
            setSelectedGenres(updated);
          }}
        />
        {genre.genre_name}
      </label>
    ))}
  </div>
  </div>

  <div>
  <Label>Rating</Label>
  <Input
    type="number"
    step="0.05"
    min="0"
    max="5"
    value={book.rating ?? ""}
    onChange={(e) => setBook({ ...book, rating: parseFloat(e.target.value) })}
  />
</div>

      <div>
        <Label>Pages</Label>
        <Input
          type="number"
          value={book.pages || ""}
          onChange={(e) => setBook({ ...book, pages: Number(e.target.value) })}
        />
      </div>

      <div>
      <Select
        value={book.status || ""}
        onValueChange={(value) => setBook({ ...book, status: value })}
      >
        <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-gray-100">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600">
          <SelectItem value="Want to Read">Want to Read</SelectItem>
          <SelectItem value="Reading">Reading</SelectItem>
          <SelectItem value="Read">Read</SelectItem>
        </SelectContent>
      </Select>
      </div>

      <div>
        <Label>Date Started</Label>
        <Input
            type="date"
            value={book.date_started ? book.date_started.split("T")[0] : ""}
            onChange={(e) =>
            setBook({ ...book, date_started: e.target.value || null })
            }
        />
        </div>

        <div>
        <Label>Date Finished</Label>
        <Input
            type="date"
            value={book.date_finished ? book.date_finished.split("T")[0] : ""}
            onChange={(e) =>
            setBook({ ...book, date_finished: e.target.value || null })
            }
        />
        </div>

      <div>
        <Label>Notes</Label>
        <Textarea
          className="min-h-[200px]"
          rows={10}
          value={book.notes || ""}
          onChange={(e) => setBook({ ...book, notes: e.target.value })}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Button onClick={handleSave}>Save Changes</Button>
      <Button onClick={handleDelete}>Delete Book</Button>
    </div>
  );
}
