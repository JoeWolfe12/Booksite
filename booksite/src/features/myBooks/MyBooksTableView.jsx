import { Link } from "react-router-dom";
import { useState } from "react";

export default function MyBooksTableView({ books }) {
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getValue = (book, field) => {
    if (field === "genres") return (book.genres || []).join(", ").toLowerCase();
    return (book[field] || "").toString().toLowerCase();
  };
  
  const sortedBooks = [...books].sort((a, b) => {
    const valA = getValue(a, sortField);
    const valB = getValue(b, sortField);
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            {["title", "author", "status", "genres","pages"].map((field) => (
              <th
                key={field}
                onClick={() => handleSort(field)}
                className="p-2 cursor-pointer hover:underline"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
            <th className="p-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {sortedBooks.map((book) => (
            <tr
              key={book.id}
              className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.status}</td>
              <td className="p-2">{book.genres?.join(", ")}</td>
              <td className="p-2">{book.pages}</td>
              <td className="p-2">
                <Link
                  to={`/edit-book/${book.id}`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
