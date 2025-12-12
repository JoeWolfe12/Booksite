export default function UpcomingBooksList({ books }) {
  return (
    <div className="bg-card rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Upcoming Releases
        </h2>
        <span className="text-muted-foreground">
          {books.length} upcoming book{books.length !== 1 ? 's' : ''}
        </span>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No upcoming books from tracked authors.
          </p>
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
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 text-card-foreground font-medium">
                    {book.title}
                  </td>
                  <td className="py-4 px-4 text-card-foreground">
                    {book.author_name}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {book.year}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        book.status === 'Available'
                          ? 'bg-green-500/20 text-green-600'
                          : book.status === 'Confirmed'
                          ? 'bg-blue-500/20 text-blue-600'
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}
                    >
                      {book.status}
                    </span>
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
