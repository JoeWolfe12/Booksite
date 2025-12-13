import { useState } from 'react';
import AuthorSearchForm from './authorSearchForm';
import AuthorSearchResults from './authorSearchResults';

export default function SearchAuthors({ trackedAuthors, onAuthorAdded, loading }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAuthorAdd = async (author) => {
    // Check if already tracking
    if (trackedAuthors.some(a => a.author_id === author.author_id)) {
      alert(`You're already tracking ${author.name}!`);
      return;
    }

    // Call the parent's API function
    const success = await onAuthorAdded(author);
    
    if (success) {
      setSearchResults([]);
      alert(`${author.name} has been added to your tracked authors!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AuthorSearchForm 
        onResults={setSearchResults}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
      <AuthorSearchResults 
        results={searchResults} 
        onAddAuthor={handleAuthorAdd}
        loading={loading}
        trackedAuthors={trackedAuthors}
      />
    </div>
  );
}
