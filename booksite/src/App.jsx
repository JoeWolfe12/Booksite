import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import './index.css';

import AuthLanding from "@/features/auth/authLanding";
import SearchBooks from "@/features/searchBooks/searchBooks";
import AddBookForm from "@/features/addingBooks/addBookForm"; 
import StatsPage from "@/features/stats/StatsPage"; // create this later
import Sidebar from "@/features/navigation/Sidebar"; 
import ResetPassword from "@/features/auth/resetPassword";
import MyBooksPage from "@/features/myBooks/myBooksPage";
import EditBookPage from "@/features/addingBooks/editBookPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false); 
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <>
        {user ? (
          <div className="flex h-screen">
            <Sidebar user={user} />
            <main className="flex-1 p-6 overflow-y-auto bg-gray-900 text-gray-100">
              <Routes>
                {user.guest ? (
                  <Route path="*" element={<AllBooksPublicPage />} />
                ) : (
                  <>
                    <Route path="/" element={<Navigate to="/books" />} />
                    <Route path="/books" element={<SearchBooks />} />
                    <Route path="/add-book" element={<AddBookForm />} />
                    <Route path="/my-books" element={<MyBooksPage />} />
                    <Route path="/edit-book/:id" element={<EditBookPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<p>404 - Page Not Found</p>} />
                  </>
                )}
              </Routes>
            </main>
          </div>
        ) : (
          <AuthLanding
            onAuth={() => window.location.reload()}
            onGuest={() => setUser({ guest: true })}
          />
        )}
      </>
    </BrowserRouter>
  );
}

export default App;