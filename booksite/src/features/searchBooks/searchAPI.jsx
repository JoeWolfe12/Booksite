export async function searchBooks(query) {
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const data = await res.json();
  
      return data.docs.map((doc) => ({
        id: doc.key, // e.g., "/works/OL123456W"
        title: doc.title,
        authors: doc.author_name || [],
        cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
        language: doc.language?.[0] || "",
        isbn: doc.isbn?.[0] || "",
      }));
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }
  