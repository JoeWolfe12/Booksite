import BookCard from "./bookCardSearchResult";

export default function SearchResults({ books, onSelect }) {
  if (!books || books.length === 0) {
    return <p className="text-center text-gray-500">No results found.</p>;
  }

  const handleAddClick = async (book) => {
    try {
      const workId = book.id.replace("/works/", "");
      const res = await fetch(`https://openlibrary.org/works/${workId}/editions.json`);
      const data = await res.json();
  
      // First try to find one with pages
      const editionWithPages = data.entries.find(ed => ed.number_of_pages);
      const editionWithIsbn = data.entries.find(ed => ed.isbn_13 || ed.isbn_10);
  
      const enrichedBook = {
        ...book,
        pages: editionWithPages?.number_of_pages || "",
        isbn: editionWithIsbn?.isbn_13?.[0] || editionWithIsbn?.isbn_10?.[0] || "",
      };
  
      console.log("Enriched book from editions:", enrichedBook);
      onSelect(enrichedBook);
    } catch (error) {
      console.error("Failed to fetch edition info:", error);
      onSelect(book); 
    }
  };

  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelect={() => handleAddClick(book)} />
      ))}
    </div>
  );
}
