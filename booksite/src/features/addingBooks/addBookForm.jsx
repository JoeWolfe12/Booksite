import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";

export default function AddBookForm({ onSubmit, onCancel }) {

  const navigate = useNavigate();
  const { workId } = useParams();
  const [activeBook, setActiveBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Want to Read");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [language, setLanguage] = useState("");
  const [isbn, setIsbn] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [dateFinished, setDateFinished] = useState("");
  const [pages, setPages] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);



  // fetch the book detils
  useEffect(() => {
    async function fetchWork() {
      setLoading(true)
      try {
        // Get the book data
        const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
        const work = await res.json();
        // ISBN & pages requires a different API call to get the edition data
        const edRes  = await fetch(`https://openlibrary.org/works/${workId}/editions.json`);
        const edData = await edRes.json();
        const editionWithPages = edData.entries.find((ed) => ed.number_of_pages);
        const editionWithIsbn  = edData.entries.find((ed) => (ed.isbn_13?.length || ed.isbn_10?.length));
        // Get the authors
        const defaultAuthors = work.authors
          ?.map((a) => a.name)
          .join(", ") || "";

        setActiveBook({
          book_id: workId,
          title: work.title,
          author: defaultAuthors,
          cover: work.covers?.length
            ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`
            : "",
          language: work.languages?.[0]?.key.split("/").pop() || "",
          isbn: editionWithIsbn?.isbn_13?.[0]|| editionWithIsbn?.isbn_10?.[0] || "",
          pages: editionWithPages?.number_of_pages || "",
        });
      } catch (err) {
        console.error("Error fetching work:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWork();
  }, [workId]);

  useEffect(() => {
    if (!activeBook) return;
    setTitle(activeBook.title || "");
    setAuthor(activeBook.author || "");
    setLanguage(activeBook.language || "");
    setIsbn(activeBook.isbn || "");
    setPages(activeBook.pages || "");
  }, [activeBook]);

  // fetches the genres
  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("*");
      if (!error) setAllGenres(data || []);
    };
    fetchGenres();
  }, []);

  if (loading || !activeBook) {
    return <p>Loading book…</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    const userId = user?.id || user?.user?.id;
    if (userError || !user) {
      setError("You must be logged in to add a book.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
    .from("user_books")
    .insert([
      {
        user_id: userId,
        book_id: activeBook.book_id,  // <-- use book_id, not activeBook.id
        title,
        author,
        cover: activeBook.cover,
        language,
        isbn,
        date_started: dateStarted || null,
        date_finished: dateFinished || null,
        status,
        rating: rating || null,
        private: isPrivate,
        notes: notes
          ? `[${new Date().toLocaleString()}]\n${notes}`
          : null,
        pages: pages || null,
      },
    ]);

  if (insertError) {
    setError("Failed to add book.");
    setLoading(false);
    return;
  }

  // 6) Link genres, if any
  if (selectedGenres.length > 0) {
    const genreInserts = selectedGenres.map((genre_id) => ({
      book_id: activeBook.book_id,
      genre_id,
    }));
    await supabase.from("book_genres").insert(genreInserts);
  }

  alert("Book added successfully!");
  onSubmit?.();
  navigate("/my-books");
  setLoading(false);
};

  const handleCancel = () => {
    onCancel?.();
    navigate(-1);
  };

  return (

    <Card className="max-w-md mx-auto p-4">
      {onCancel && (
        <Button variant="outline" onClick={handleCancel}>
          ← Back to Search
        </Button>
      )}
      <CardContent>
        <h2 className="text-xl font-bold mb-4">
          Add "{activeBook.title || 'Book'}" to Your Shelf
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-md">
                <SelectItem value="Want to Read">Want to Read</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
                <SelectItem value="Read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <Label>Author(s)</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>

          <div>
            <Label>Rating</Label>
            <Input
              type="number"
              step="0.05"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Language</Label>
            <Input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English"
            />
          </div>

          <div>
            <Label>ISBN</Label>
            <Input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 978-0140449136"
            />
          </div>

          <div>
            <Label>Pages</Label>
            <Input
              type="number"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              placeholder="e.g. 350"
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
                    checked={selectedGenres.includes(genre.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...selectedGenres, genre.id]
                        : selectedGenres.filter((g) => g !== genre.id);
                      setSelectedGenres(updated);
                    }}
                  />
                  {genre.genre_name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Date Started</Label>
            <Input
              type="date"
              value={dateStarted}
              onChange={(e) => setDateStarted(e.target.value)}
            />
          </div>

          <div>
            <Label>Date Finished</Label>
            <Input
              type="date"
              value={dateFinished}
              onChange={(e) => setDateFinished(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="privateToggle">Private</Label>
            <input
              id="privateToggle"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="ml-2"
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thoughts, quotes, etc..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
