import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import SearchAuthors from './searchAuthors';
import TrackedAuthorsList from './trackedAuthorsList';
import UpcomingBooksList from './upcomingBooksList';

export default function TrackingAuthorsPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [activeTab, setActiveTab] = useState('addAuthor');
  const [trackedAuthors, setTrackedAuthors] = useState([]);
  const [upcomingBooks, setUpcomingBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://bp4yldzua0.execute-api.ap-southeast-2.amazonaws.com/prod';

  // Get JWT token from Supabase session
  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // Fetch tracked authors
  const fetchTrackedAuthors = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/authors/track`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tracked authors: ${response.status}`);
      }

      const data = await response.json();
      setTrackedAuthors(data.authors || []);
    } catch (err) {
      console.error('Error fetching tracked authors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch upcoming books
  const fetchUpcomingBooks = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/authors/upcoming`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming books: ${response.status}`);
      }

      const data = await response.json();
      setUpcomingBooks(data.books || []);
    } catch (err) {
      console.error('Error fetching upcoming books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add author to tracking
  const handleAuthorAdded = async (author) => {
    if (!user) {
      setError('You must be logged in to track authors');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/authors/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author_id: author.author_id,
          author_name: author.name,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add author: ${response.status}`);
      }

      // Refresh tracked authors list
      await fetchTrackedAuthors();
      
      // Switch to tracked authors tab to show success
      setActiveTab('trackedAuthors');
      
      return true; // Success
    } catch (err) {
      console.error('Error adding author:', err);
      setError(err.message);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  // Remove author from tracking
  const handleAuthorRemoved = async (authorId) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${API_BASE_URL}/authors/track/${authorId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove author: ${response.status}`);
      }

      // Refresh tracked authors list
      await fetchTrackedAuthors();
      
      return true; // Success
    } catch (err) {
      console.error('Error removing author:', err);
      setError(err.message);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes or component mounts
  useEffect(() => {
    if (activeTab === 'trackedAuthors') {
      fetchTrackedAuthors();
    } else if (activeTab === 'upcomingBooks') {
      fetchUpcomingBooks();
    }
  }, [activeTab, user]);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8 bg-card rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please log in to track authors and receive notifications about new book releases.
          </p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Error Display */}
      {error && (
        <div className="mx-8 mt-4 p-4 bg-destructive/20 border border-destructive rounded-lg">
          <div className="flex items-start justify-between">
            <p className="text-destructive font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-destructive hover:text-destructive/80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
            loading={loading}
          />
        )}
        {activeTab === 'trackedAuthors' && (
          <TrackedAuthorsList 
            authors={trackedAuthors}
            onAuthorRemoved={handleAuthorRemoved}
            loading={loading}
            onRefresh={fetchTrackedAuthors}
          />
        )}
        {activeTab === 'upcomingBooks' && (
          <UpcomingBooksList 
            books={upcomingBooks}
            loading={loading}
            onRefresh={fetchUpcomingBooks}
          />
        )}
      </div>
    </div>
  );
}
