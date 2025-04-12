import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

export default function AddBookForm({ book, onSubmit }) {
  const [status, setStatus] = useState("Want to Read");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [language, setLanguage] = useState(book.language || "");
  const [isbn, setIsbn] = useState(book.isbn || "");
  const [dateStarted, setDateStarted] = useState("");
  const [dateFinished, setDateFinished] = useState("");
  const [pages, setPages] = useState(book.pages || "");
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("Book passed to AddBookForm:", book);

  const navigate = useNavigate();

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

    console.log("Inserting book:", {
      user_id: userId,
      book_id: book.id,
      title,
      author,
      cover: book.cover,
      language,
      isbn,
      date_started: dateStarted || null,
      date_finished: dateFinished || null,
      status,
      rating: rating || null,
      notes: notes
        ? `[${new Date().toLocaleString()}]\n${notes}`
        : null,
      pages: pages || null,
    });

    const { error: insertError } = await supabase
  .from("user_books")
  .insert([
    {
      user_id: userId,
      book_id: book.id,
      title,
      author,
      cover: book.cover,
      language,
      isbn,
      date_started: dateStarted || null,
      date_finished: dateFinished || null,
      status,
      rating: rating || null,
      notes: notes
        ? `[${new Date().toLocaleString()}]\n${notes}`
        : null,
      pages: pages || null,
    },
  ]);

    if (insertError) {
      setError("Failed to add book. Please try again.");
      console.error(insertError);
    } else {
      if (onSubmit) onSubmit();
      navigate("/my-books");
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Add "{book.title}" to Your Shelf</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Want to Read">Want to Read</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
                <SelectItem value="Read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Author(s)</Label>
            <Input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Rating</Label>
            <Input
              type="number"
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

          <div>
            <Label>Notes</Label>
            <Textarea rows={6}
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