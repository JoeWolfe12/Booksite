import { useState } from 'react';

const TrackingAuthorsPage = () => {
  const [activeTab, setActiveTab] = useState('addAuthor');
  const [authorSearch, setAuthorSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sample tracked authors data
  const [trackedAuthors, setTrackedAuthors] = useState([
    { id: 1, name: 'V. E. Schwab', addedDate: '2024-01-15', bookCount: 8 },
    { id: 2, name: 'George R. R. Martin', addedDate: '2024-02-20', bookCount: 12 },
    { id: 3, name: 'Joe Abercrombie', addedDate: '2024-03-10', bookCount: 15 },
    { id: 4, name: 'Brandon Sanderson', addedDate: '2024-03-25', bookCount: 25 },
  ]);

  // Sample upcoming books data
  const [upcomingBooks, setUpcomingBooks] = useState([
    { id: 1, title: 'The Winds of Winter', author: 'George R. R. Martin', releaseDate: '2026', status: 'Announced' },
    { id: 2, title: 'Stormlight 5', author: 'Brandon Sanderson', releaseDate: 'Dec 2024', status: 'Confirmed' },
    { id: 3, title: 'The Fragile Threads of Power', author: 'V. E. Schwab', releaseDate: 'Released', status: 'Available' }
  ]);

  const handleSearchAuthor = async () => {
    if (!authorSearch.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        { id: 101, name: authorSearch, books: 10, verified: true },
        { id: 102, name: `${authorSearch} Jr.`, books: 5, verified: false },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddAuthor = (author) => {
    const newAuthor = {
      id: trackedAuthors.length + 1,
      name: author.name,
      addedDate: new Date().toISOString().split('T')[0],
      bookCount: author.books,
    };
    setTrackedAuthors([...trackedAuthors, newAuthor]);
    setSearchResults([]);
    setAuthorSearch('');
    alert(`${author.name} has been added to your tracked authors!`);
  };

  const handleRemoveAuthor = (authorId) => {
    if (confirm('Are you sure you want to remove this author from tracking?')) {
      setTrackedAuthors(trackedAuthors.filter(author => author.id !== authorId));
    }
  };

  const renderAddAuthorTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Search for an Author</h2>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter author name..."
            value={authorSearch}
            onChange={(e) => setAuthorSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchAuthor()}
            className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearchAuthor}
            disabled={isSearching || !authorSearch.trim()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Search Results</h3>
            <div className="space-y-3">
              {searchResults.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-card-foreground">{author.name}</h4>
                      {author.verified && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{author.books} books in database</p>
                  </div>
                  <button
                    onClick={() => handleAddAuthor(author)}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Add to Tracking
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTrackedAuthorsTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Tracked Authors</h2>
          <span className="text-muted-foreground">{trackedAuthors.length} authors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">Author Name</th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">Books in Database</th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">Date Added</th>
                <th className="text-right py-4 px-4 text-card-foreground font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trackedAuthors.map((author) => (
                <tr key={author.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4 text-card-foreground font-medium">{author.name}</td>
                  <td className="py-4 px-4 text-card-foreground">{author.bookCount}</td>
                  <td className="py-4 px-4 text-muted-foreground">{author.addedDate}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleRemoveAuthor(author.id)}
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

        {trackedAuthors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No authors tracked yet. Add some authors to get started!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUpcomingBooksTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Upcoming Releases</h2>
          <span className="text-muted-foreground">{upcomingBooks.length} upcoming books</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">Title</th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">Author</th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">Release Date</th>
                <th className="text-left py-4 px-4 text-card-foreground font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingBooks.map((book) => (
                <tr key={book.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4 text-card-foreground font-medium">{book.title}</td>
                  <td className="py-4 px-4 text-card-foreground">{book.author}</td>
                  <td className="py-4 px-4 text-muted-foreground">{book.releaseDate}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      book.status === 'Available' 
                        ? 'bg-green-500/20 text-green-600' 
                        : book.status === 'Confirmed'
                        ? 'bg-blue-500/20 text-blue-600'
                        : 'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {upcomingBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No upcoming books from tracked authors.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
        <nav className="flex-1 py-8">
          <div className="space-y-1 px-3">
            <a href="#" className="block px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md">
              My Books
            </a>
            <a href="#" className="block px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md">
              All Books
            </a>
            <a href="#" className="block px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md">
              Search Books
            </a>
            <a href="#" className="block px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md">
              My Stats
            </a>
            <a href="#" className="block px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md">
              My Profile
            </a>
            <a href="#" className="block px-3 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-md font-medium">
              Tracking Authors
            </a>
          </div>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <button className="w-full px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md text-left">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Navigation Tabs */}
        <nav className="bg-card border-b border-border shadow-sm">
          <div className="px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('addAuthor')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'addAuthor'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Add Author
              </button>
              <button
                onClick={() => setActiveTab('trackedAuthors')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'trackedAuthors'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Tracked Authors
              </button>
              <button
                onClick={() => setActiveTab('upcomingBooks')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcomingBooks'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Upcoming Books
              </button>
            </div>
          </div>
        </nav>

        {/* Tab Content */}
        <div className="px-8 py-8">
          {activeTab === 'addAuthor' && renderAddAuthorTab()}
          {activeTab === 'trackedAuthors' && renderTrackedAuthorsTab()}
          {activeTab === 'upcomingBooks' && renderUpcomingBooksTab()}
        </div>
      </main>
    </div>
  );
};

export default TrackingAuthorsPage;
