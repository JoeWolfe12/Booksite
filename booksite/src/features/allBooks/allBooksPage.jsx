import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ genre: "all", user: "all", search: "" });
  const [view, setView] = useState("table");

  const handleSearch = () => {
    const search = filters.search.toLowerCase();

    const results = books.filter((book) => {
      const genreMatches =
        filters.genre === "all" ||
        book.book_genres?.some((g) => g.genres?.genre_name === filters.genre);
  
      const userMatches =
        filters.user === "all" || book.profiles?.username === filters.user;
  
      const searchMatches =
        !search ||
        book.title?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search);
  
      return genreMatches && userMatches && searchMatches;
    });
  
    setFilteredBooks(results);

  };

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch public books
      const { data: bookData, error: bookError } = await supabase
        .from("user_books")
        .select(`
            id, title, author, cover, status, rating, private,
            user_id ( username ),
            book_genres ( genres ( genre_name ) )
        `)
        .eq("private", false);
  
      if (bookError) console.error("Error loading books:", bookError);
      else setBooks(bookData || []);
  
      // Fetch genres
      const { data: genreList } = await supabase.from("genres").select("*");
      setGenres(genreList || []);
  
      // Fetch users
      const { data: userList } = await supabase.from("profiles").select("id, username");
      setUsers(userList || []);
    };
  
    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">All Public Books</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Search by title or author</Label>
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Filter by Genre</Label>
          <Select
            value={filters.genre}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, genre: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white z-50">
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g.id} value={g.genre_name}>
                  {g.genre_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Filter by User</Label>
          <Select
            value={filters.user}
            onValueChange={(val) => setFilters((prev) => ({ ...prev, user: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white z-50">
              <SelectItem value="all">All Users</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.username}>
                  {u.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-2">
        <Button onClick={handleSearch}>Search</Button>
    </div>

    <div className="flex justify-end gap-2 mt-4">
        <Button
            variant={view === "table" ? "default" : "outline"}
            onClick={() => setView("table")}
        >
            Table View
        </Button>
        <Button
            variant={view === "card" ? "default" : "outline"}
            onClick={() => setView("card")}
        >
            Card View
        </Button>
    </div>

      {/* Book list */}
      {view === "table" && (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse mt-4">
      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="p-2 text-left">Title</th>
          <th className="p-2 text-left">Author</th>
          <th className="p-2 text-left">User</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Rating</th>
        </tr>
      </thead>
      <tbody>
        {filteredBooks.map((book) => (
          <tr key={book.id} className="border-t border-gray-300 dark:border-gray-600">
            <td className="p-2">{book.title}</td>
            <td className="p-2">{book.author}</td>
            <td className="p-2">{book.user_id?.username}</td>
            <td className="p-2 italic text-gray-500">{book.status}</td>
            <td className="p-2">{book.rating ? `★${book.rating}` : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{view === "card" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
    {filteredBooks.map((book) => (
      <Card key={book.id}>
        <CardContent className="p-4 space-y-2">
          {book.cover && (
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <div className="font-semibold text-lg">{book.title}</div>
          <div className="text-sm text-gray-400">{book.author}</div>
          <div className="text-sm">By: {book.user_id?.username}</div>
          <div className="text-sm italic text-gray-300">{book.status}</div>
          {book.rating && (
            <div className="text-yellow-400 text-sm">★ {book.rating}/5</div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
)}
    </div>
  );
}
