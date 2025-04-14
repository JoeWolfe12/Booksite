import { Link } from "react-router-dom";
import { useState } from "react";

export default function MyBooksTableView({ books }) {
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter state
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All");

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

  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title?.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesAuthor = book.author?.toLowerCase().includes(authorFilter.toLowerCase());
    const matchesStatus = statusFilter === "All" || book.status === statusFilter;
    return matchesTitle && matchesAuthor && matchesStatus;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const valA = getValue(a, sortField);
    const valB = getValue(b, sortField);
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto p-4 space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="border p-1 rounded w-40"
            placeholder="Filter title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="border p-1 rounded w-40"
            placeholder="Filter author"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="All">All</option>
            <option value="Want to Read">Want to Read</option>
            <option value="Reading">Reading</option>
            <option value="Read">Read</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm border mt-4">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            {["title", "author", "status", "genres", "rating"].map((field) => (
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
              <td className="p-2">{book.rating != null ? book.rating.toFixed(2) : "—"}</td>
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
