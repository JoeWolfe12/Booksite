import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="w-48 h-full p-4 bg-gray-900 text-white border-r border-gray-700">
      {user && <Link to="/my-books" className="block">My Books</Link>}
      <Link to="/books" className="block">Search Books</Link>
      {user && <Link to="/stats" className="block">My Stats</Link>}
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
    </div>
  );
}