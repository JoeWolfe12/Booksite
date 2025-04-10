export default function BookCard({ book, onSelect }) {
    return (
      <div
        className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:shadow-md transition"
        onClick={() => onSelect(book)}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-16 h-24 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
            No Cover
          </div>
        )}
  
        <div>
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.authors?.join(", ")}</p>
          {book.language && <p className="text-xs text-gray-400">Language: {book.language}</p>}
          {book.isbn && <p className="text-xs text-gray-400">ISBN: {book.isbn}</p>}
        </div>
      </div>
    );
  }
