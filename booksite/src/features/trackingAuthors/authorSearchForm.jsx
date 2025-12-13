import { useState } from 'react';

export default function AuthorSearchForm({ onResults, isSearching, setIsSearching }) {
  const [authorSearch, setAuthorSearch] = useState('');

  const handleSearch = async () => {
    if (!authorSearch.trim()) return;

    setIsSearching(true);

    try {
      // Call Open Library Authors Search API
      const response = await fetch(
        `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorSearch)}`
      );
      const data = await response.json();

      // Format results for display
      const formattedResults = data.docs.map(author => ({
        author_id: author.key.replace('/authors/', ''), // Extract just the ID (e.g., "OL2658716A")
        name: author.name,
        birth_date: author.birth_date || null,
        work_count: author.work_count || 0,
        top_work: author.top_work || null,
        top_subjects: author.top_subjects || []
      }));

      onResults(formattedResults);
    } catch (error) {
      console.error('Error searching authors:', error);
      alert('Failed to search authors. Please try again.');
      onResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-card rounded-lg p-8 shadow-sm mb-6">
      <h2 className="text-2xl font-semibold mb-6 text-card-foreground">
        Search for an Author
      </h2>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter author name ..."
          value={authorSearch}
          onChange={(e) => setAuthorSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSearching}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !authorSearch.trim()}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
}
