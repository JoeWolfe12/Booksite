export default function TrackedAuthorsList({ authors, onAuthorRemoved, loading, onRefresh }) {
  const handleRemove = async (author) => {
    if (!confirm(`Are you sure you want to stop tracking ${author.author_name}?`)) {
      return;
    }

    // Call the API via parent component
    const success = await onAuthorRemoved(author.author_id);
    
    if (success) {
      alert(`You've stopped tracking ${author.author_name}.`);
    } else {
      alert(`Failed to remove ${author.author_name}. Please try again.`);
    }
  };

  return (
    <div className="bg-card rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Tracked Authors
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            {authors.length} author{authors.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 transition flex items-center gap-2"
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

      {loading && authors.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading tracked authors...</p>
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No authors tracked yet. Add some authors to get started!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">
                  Author Name
                </th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">
                  Author ID
                </th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">
                  Date Added
                </th>
                <th className="text-right py-4 px-4 text-card-foreground font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr
                  key={author.author_id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-card-foreground font-medium">
                      {author.author_name}
                    </div>
                    <a
                      href={`https://openlibrary.org/authors/${author.author_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View on Open Library →
                    </a>
                  </td>
                  <td className="py-4 px-4 text-card-foreground font-mono text-sm">
                    {author.author_id}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {new Date(author.date_added).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleRemove(author)}
                      disabled={loading}
                      className="px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>💡 You'll receive email notifications when these authors release new books</p>
      </div>
    </div>
  );
}
