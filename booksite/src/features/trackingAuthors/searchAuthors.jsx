import { useState } from 'react';
import AuthorSearchForm from './authorSearchForm';
import AuthorSearchResults from './authorSearchResults';

export default function SearchAuthors({ trackedAuthors, onAuthorAdded }) {
  const [searchResults, setSearchResults] = useState([]);

  const handleAuthorAdd = (author) => {
    // Check if already tracking
    if (trackedAuthors.some(a => a.author_id === author.author_id)) {
      alert(`You're already tracking ${author.name}!`);
      return;
    }

    // TODO: Call API to add to database
    // For now, just add to local state
    const newAuthor = {
      id: trackedAuthors.length + 1,
      author_id: author.author_id,
      name: author.name,
      addedDate: new Date().toISOString().split('T')[0],
      workCount: author.work_count,
    };

    onAuthorAdded(newAuthor);
    setSearchResults([]);
    alert(`${author.name} has been added to your tracked authors!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AuthorSearchForm onResults={setSearchResults} />
      <AuthorSearchResults 
        results={searchResults} 
        onAddAuthor={handleAuthorAdd}
      />
    </div>
  );
}
