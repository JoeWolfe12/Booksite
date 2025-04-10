import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout?.();
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Log Out
    </Button>
  );
}
