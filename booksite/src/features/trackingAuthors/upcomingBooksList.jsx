import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function UpcomingBooksList({ books, loading, onRefresh }) {
  const [filterAuthor, setFilterAuthor] = useState('all');

  // Get unique authors for filtering
  const authors = books.length > 0 
    ? [...new Set(books.map(b => b.author_name))].sort((a, b) => a.localeCompare(b))
    : [];

  // Filter books by author
  let displayBooks = [...books];
  
  if (filterAuthor !== 'all') {
    displayBooks = displayBooks.filter(b => b.author_name === filterAuthor);
  }

  // Sort by year (most recent first)
  displayBooks.sort((a, b) => b.first_publish_year - a.first_publish_year);

  return (
    <div className="bg-card rounded-lg p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted-foreground">
            {displayBooks.length} book{displayBooks.length !== 1 ? 's' : ''}
          </span>
          
          {authors.length > 0 && (
            <Select value={filterAuthor} onValueChange={setFilterAuthor}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Authors" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map(author => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 transition flex items-center gap-2 border border-input rounded-lg hover:border-ring"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {loading && books.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading upcoming books...</p>
        </div>
      ) : displayBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {filterAuthor !== 'all' 
              ? `No books found for ${filterAuthor}` 
              : 'No upcoming books from tracked authors.'}
          </p>
          {filterAuthor !== 'all' && (
            <button
              onClick={() => setFilterAuthor('all')}
              className="mt-4 px-4 py-2 text-sm text-primary hover:underline"
            >
              View all authors
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">
                  Title
                </th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">
                  Author
                </th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">
                  Year
                </th>
                <th className="text-right py-4 px-4 text-card-foreground font-semibold">
                  Add to List
                </th>
              </tr>
            </thead>
            <tbody>
              {displayBooks.map((book) => {
                return (
                  <tr
                    key={book.book_id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="text-card-foreground font-medium">
                        {book.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        {book.book_id}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-card-foreground">
                        {book.author_name}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {book.author_id}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-card-foreground font-medium">
                      {book.first_publish_year}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href={`https://www.booklog.io/add-book/${book.book_id}`}
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Add to List
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}