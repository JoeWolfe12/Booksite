import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Password updated! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleReset} className="max-w-sm mx-auto space-y-4 mt-10">
      <h2 className="text-xl font-bold">Reset Your Password</h2>
      <Input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Set New Password
      </Button>
      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </form>
  );
}
