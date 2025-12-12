export default function AuthorSearchResults({ results, onAddAuthor }) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-8 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">
        Found {results.length} author{results.length !== 1 ? 's' : ''}
      </h3>

      <div className="space-y-3">
        {results.map((author) => (
          <div
            key={author.author_id}
            className="flex items-start justify-between p-5 bg-muted rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-lg text-card-foreground">
                  {author.name}
                </h4>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {author.work_count} works
                </span>
              </div>

              {author.birth_date && (
                <p className="text-sm text-muted-foreground mb-1">
                  Born: {author.birth_date}
                </p>
              )}

              {author.top_work && (
                <p className="text-sm text-muted-foreground mb-2">
                  Top work: <span className="font-medium">{author.top_work}</span>
                </p>
              )}

              {author.top_subjects && author.top_subjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {author.top_subjects.slice(0, 5).map((subject, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onAddAuthor(author)}
              className="ml-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Track Author
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
