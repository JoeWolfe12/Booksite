import { useState } from "react";
import SearchForm from "./searchForm";
import SearchResults from "./searchResults";
import AddBookForm from "../addingBooks/addBookForm";

export default function sSearchBooks() {
  const [results, setResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleFormSubmit = () => {
    setSelectedBook(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <SearchForm onResults={setResults} />

      {selectedBook ? (
        <AddBookForm book={selectedBook} onSubmit={handleFormSubmit} />
      ) : (
        <SearchResults books={results} onSelect={handleSelectBook} />
      )}
    </div>
  );
}
