import { useState } from 'react';
import SearchAuthors from './searchAuthors';
import TrackedAuthorsList from './trackedAuthorsList';
import UpcomingBooksList from './upcomingBooksList';

export default function TrackingAuthorsPage() {
  const [activeTab, setActiveTab] = useState('addAuthor');

  // Sample tracked authors data (will be replaced with API calls)
  const [trackedAuthors, setTrackedAuthors] = useState([
    { id: 1, author_id: 'OL2658716A', name: 'Brandon Sanderson', addedDate: '2024-01-15', workCount: 162 },
    { id: 2, author_id: 'OL23919A', name: 'J. K. Rowling', addedDate: '2024-02-20', workCount: 162 },
    { id: 3, author_id: 'OL26320A', name: 'J. R. R. Tolkien', addedDate: '2024-03-10', workCount: 89 },
  ]);

  // Sample upcoming books data (will be replaced with API calls)
  const [upcomingBooks, setUpcomingBooks] = useState([
    { id: 1, work_id: 'OL17090779W', title: 'Wind and Truth', author_id: 'OL2658716A', author_name: 'Brandon Sanderson', year: 2024, status: 'Available' },
    { id: 2, work_id: 'OL27479W', title: 'The Winds of Winter', author_id: 'OL234664A', author_name: 'George R. R. Martin', year: 2026, status: 'Announced' },
  ]);

  const handleAuthorAdded = (newAuthor) => {
    setTrackedAuthors([...trackedAuthors, newAuthor]);
  };

  const handleAuthorRemoved = (authorId) => {
    setTrackedAuthors(trackedAuthors.filter(a => a.id !== authorId));
  };

  return (
    <div className="h-full">
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
              Tracked Authors ({trackedAuthors.length})
            </button>
            <button
              onClick={() => setActiveTab('upcomingBooks')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upcomingBooks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Upcoming Books ({upcomingBooks.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="px-8 py-8">
        {activeTab === 'addAuthor' && (
          <SearchAuthors 
            trackedAuthors={trackedAuthors}
            onAuthorAdded={handleAuthorAdded}
          />
        )}
        {activeTab === 'trackedAuthors' && (
          <TrackedAuthorsList 
            authors={trackedAuthors}
            onAuthorRemoved={handleAuthorRemoved}
          />
        )}
        {activeTab === 'upcomingBooks' && (
          <UpcomingBooksList books={upcomingBooks} />
        )}
      </div>
    </div>
  );
}
