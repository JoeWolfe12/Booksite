import { useState } from 'react';

export default function UpcomingBooksList({ books, loading, onRefresh }) {
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('year'); // 'year' or 'author'

  // Get unique years for filtering
  const years = books.length > 0 
    ? [...new Set(books.map(b => b.first_publish_year))].sort((a, b) => b - a)
    : [];

  // Filter and sort books
  let displayBooks = [...books];
  
  if (filterYear !== 'all') {
    displayBooks = displayBooks.filter(b => b.first_publish_year === parseInt(filterYear));
  }

  if (sortBy === 'year') {
    displayBooks.sort((a, b) => b.first_publish_year - a.first_publish_year);
  } else if (sortBy === 'author') {
    displayBooks.sort((a, b) => a.author_name.localeCompare(b.author_name));
  }

  return (
    <div className="bg-card rounded-lg p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Upcoming Releases
        </h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted-foreground">
            {displayBooks.length} book{displayBooks.length !== 1 ? 's' : ''}
          </span>
          
          {years.length > 0 && (
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="year">Sort by Year</option>
            <option value="author">Sort by Author</option>
          </select>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 transition flex items-center gap-2 border border-border rounded-lg hover:border-primary"
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
            {filterYear !== 'all' 
              ? `No books found for ${filterYear}` 
              : 'No upcoming books from tracked authors.'}
          </p>
          {filterYear !== 'all' && (
            <button
              onClick={() => setFilterYear('all')}
              className="mt-4 px-4 py-2 text-sm text-primary hover:underline"
            >
              View all years
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

      <div className="mt-4 text-sm text-muted-foreground space-y-1">
        <p>Showing newly released and upcoming books for your tracked authors</p>
        <p className="text-xs">This list is updated weekly!</p>
      </div>
    </div>
  );
}
