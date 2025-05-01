import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MyBooksBookshelfView({ books }) {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filteredBooks =
    filter === "All" ? books : books.filter((book) => book.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "Want to Read":
        return "bg-blue-600";
      case "Reading":
        return "bg-yellow-500";
      case "Read":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="p-4">
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        {["All", "Want to Read", "Reading", "Read"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Book cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => navigate(`/edit-book/${book.id}`)}
            className="bg-gray-800 p-2 sm:p-3 rounded shadow text-white cursor-pointer hover:bg-gray-700 transition"
          >
            {/* Book cover */}
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-32 sm:h-48 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-32 sm:h-48 bg-gray-700 flex items-center justify-center rounded mb-2 text-xs sm:text-sm text-gray-400">
                No Cover
              </div>
            )}

            {/* Title & author */}
            <h3 className="font-semibold text-base sm:text-lg mb-1">{book.title}</h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-2">{book.author}</p>

            {/* Status badge */}
            <div className={`inline-block px-1 sm:px-2 py-0.5 rounded text-2xs sm:text-xs font-semibold text-white ${getStatusColor(book.status)} mb-2`}>
              {book.status}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mt-1 text-2xs sm:text-xs">
              {book.genres?.map((genre, i) => (
                <span
                  key={i}
                  className="bg-gray-700 px-1 sm:px-2 py-0.5 rounded-full text-gray-200"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
