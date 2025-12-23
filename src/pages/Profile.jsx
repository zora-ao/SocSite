import { useEffect, useState } from "react";
import { getCurrentUser } from "../auth/auth";
import { getProfile, createProfile, updateProfile } from "../profile/profile";
import { uploadAvatar } from "../profile/avatar";
import { storage } from "../lib/appwrite";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRants } from "../rants/rants";

// ---------------------------
// Time ago helper
// ---------------------------
function timeAgo(dateString) {
  if (!dateString) return "unknown";
  const now = new Date();
  const past = new Date(dateString);
  if (isNaN(past)) return "unknown";

  const diff = Math.floor((now - past) / 1000);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;

  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ---------------------------
// Profile Page Component
// ---------------------------
export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // single loading state

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [course, setCourse] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [rants, setRants] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true); // start loading

      try {
        const u = await getCurrentUser();
        setUser(u);

        let p = await getProfile(u.$id);
        if (!p) {
          p = await createProfile(u);
        }
        setProfile(p);
        setUsername(p.username);
        setBio(p.bio || "");
        setCourse(p.course || "");

        // Load only user's rants and sort by latest
        const allRants = await getRants();
        const userRants = allRants
          .filter((r) => r.userId === u.$id)
          .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
        setRants(userRants);
      } finally {
        setLoading(false); // stop loading
      }
    }

    load();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  const handleSave = async () => {
    let avatarId = profile.avatarId;

    if (avatarFile) {
      avatarId = await uploadAvatar(avatarFile);
    }

    const updated = await updateProfile(profile.$id, {
      username,
      bio,
      course,
      avatarId,
    });

    setProfile(updated);
    setEditMode(false);
  };

  return (
    <div className="w-3/4 max-w-5xl mx-auto mt-10 space-y-6">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={
            profile.avatarId
              ? storage.getFileView(APPWRITE_MEMORIES_BUCKET_ID, profile.avatarId)
              : "https://placehold.co/100x100"
          }
          className="w-32 h-32 rounded-full object-cover"
        />

        {editMode && (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        )}
      </div>

      {/* Profile Info */}
      {!editMode ? (
        <>
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <p className="text-lg">{profile.bio || "No bio yet"}</p>
          <p className="text-sm text-muted-foreground">{profile.course}</p>

          <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
        </>
      ) : (
        <>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />
          <Input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Course"
          />

          <div className="flex gap-2 mt-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
          </div>
        </>
      )}

      {/* User's Rants */}
      <hr />
      <h3 className="font-semibold text-xl">Your Posts</h3>
      {rants.length === 0 && <p>No posts yet.</p>}
      {rants.map((rant) => (
        <div key={rant.$id} className="border p-4 rounded space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{profile.username}</p>
            <p className="text-xs text-gray-400">{timeAgo(rant.$createdAt)}</p>
          </div>
          <p className="text-sm whitespace-pre-wrap">{rant.content}</p>
        </div>
      ))}
    </div>
  );
}
