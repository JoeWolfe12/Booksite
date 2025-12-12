import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const NavLinks = () => (
    <nav className="flex flex-col space-y-2">
      {user && <Link to="/my-books" className="block">My Books</Link>}
      {user && <Link to="/all-books" className="block">All Books</Link>}
      <Link to="/books" className="block">Search Books</Link>
      {user && <Link to="/stats" className="block">My Stats</Link>}
      {user && <Link to="/profile" className="block">My Profile</Link>}
      {user && <Link to="/authors" className="block">Tracking Authors</Link>}
      <div className="pt-4">
        {user ? (
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Log Out
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden p-2">
        <button
          className="text-white bg-gray-800 p-2 rounded"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative bg-gray-900 w-64 h-full p-4 text-white border-r">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <NavLinks />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col w-48 h-full p-4 bg-gray-900 text-white border-r">
        <NavLinks />
      </div>
    </>
  );
}
