import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // adjust the path if needed

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");
        
      console.log("data:", data); 
      console.log("error:", error);

      if (error) {
        console.error("Error fetching books:", error.message);
      } else {
        setBooks(data);
      }

      setLoading(false);
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading books...</p>;

  return (
    <div>
      <h2>📚 My Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBooks;
