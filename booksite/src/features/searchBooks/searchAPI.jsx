export async function searchBooks({ title, author }) {
  try {
    const query = [
      title ? `title=${encodeURIComponent(title)}` : "",
      author ? `author=${encodeURIComponent(author)}` : ""
    ]
      .filter(Boolean)
      .join("&");

    const res = await fetch(`https://openlibrary.org/search.json?${query}`);
    const data = await res.json();

    return data.docs.map((doc) => ({
      id: doc.key, // e.g., "/works/OL123456W"
      title: doc.title,
      author: doc.author_name?.join(", ") || "",
      authors: doc.author_name || [],
      cover: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      language: doc.language?.[0] || "",
      isbn: doc.isbn?.[0] || ""
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
  