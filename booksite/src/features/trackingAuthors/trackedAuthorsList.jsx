export default function TrackedAuthorsList({ authors, onAuthorRemoved }) {
  const handleRemove = (author) => {
    if (!confirm(`Are you sure you want to stop tracking ${author.name}?`)) {
      return;
    }

    // TODO: Call API to remove from database
    onAuthorRemoved(author.id);
    alert(`You've stopped tracking ${author.name}.`);
  };

  return (
    <div className="bg-card rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Tracked Authors
        </h2>
        <span className="text-muted-foreground">
          {authors.length} author{authors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {authors.length === 0 ? (
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
                  Works Published
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
                  key={author.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 text-card-foreground font-medium">
                    {author.name}
                  </td>
                  <td className="py-4 px-4 text-card-foreground">
                    {author.workCount}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {author.addedDate}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleRemove(author)}
                      className="px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
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
    </div>
  );
}
