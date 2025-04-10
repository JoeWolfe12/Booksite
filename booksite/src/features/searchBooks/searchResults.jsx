import BookCard from "./bookCardSearchResult";

export default function SearchResults({ books, onSelect }) {
  if (!books || books.length === 0) {
    return <p className="text-center text-gray-500">No results found.</p>;
  }

  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelect={() => onSelect(book)} />
      ))}
    </div>
  );
}
