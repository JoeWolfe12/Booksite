import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) setError(error.message);
      else setProfile(data);

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Live username check
  const checkUsernameAvailable = async (username) => {
    if (!username || username.length < 3) return setUsernameAvailable(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", profile.id)
      .maybeSingle();

    setUsernameAvailable(!data);
  };

  const handleChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    if (key === "username") {
      checkUsernameAvailable(value.trim());
    }
  };

  const handleSave = async () => {
    if (usernameAvailable === false) {
      setError("That username is already taken.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username?.trim(),
        display_name: profile.display_name,
        bio: profile.bio,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setError(null);
    } else {
      setError(error.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <Card>
        <CardContent className="space-y-4 p-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div>
                <Label>Username</Label>
                <Input
                  value={profile.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
                {usernameAvailable === false && (
                  <p className="text-red-500 text-sm mt-1">Username is already taken.</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-green-500 text-sm mt-1">Username is available.</p>
                )}
              </div>

              <div>
                <Label>Display Name</Label>
                <Input
                  value={profile.display_name || ""}
                  onChange={(e) => handleChange("display_name", e.target.value)}
                />
              </div>

              <div>
                <Label>Bio</Label>
                <Input
                  value={profile.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || usernameAvailable === false}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>

              {success && <p className="text-green-500">Changes saved!</p>}
              {error && <p className="text-red-500">{error}</p>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
