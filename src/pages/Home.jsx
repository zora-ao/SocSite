// src/pages/Home.jsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import RantForm from "../components/RantForm";
import { getRants, deleteRant } from "../rants/rants";
import { Button } from "@/components/ui/button";
import { getProfile } from "../profile/profile";
import { storage } from "../lib/appwrite";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";
import { motion, AnimatePresence } from "framer-motion";
import { getSongOfTheDay } from "../music/dailySongs";

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
// Home Component
// ---------------------------
export default function Home({ user }) {
  const [rants, setRants] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [profile, setProfile] = useState(null);
  const [editingRant, setEditingRant] = useState(null);
  const [songOfTheDay, setSongOfTheDay] = useState(null);
  const [showRantDialog, setShowRantDialog] = useState(false);

  // ---------------------------
  // Load rants + profiles
  // ---------------------------
  const loadRants = async () => {
    const data = await getRants();
    data.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
    setRants(data);

    const uniqueUserIds = [...new Set(data.map((r) => r.userId).filter(Boolean))];
    const profileResults = await Promise.all(uniqueUserIds.map((id) => getProfile(id)));

    const profileMap = {};
    uniqueUserIds.forEach((id, index) => {
      profileMap[id] = profileResults[index];
    });

    setProfiles(profileMap);
  };

  useEffect(() => {
    if (!user) return;

    loadRants();
    getSongOfTheDay().then(setSongOfTheDay);

    async function loadMyProfile() {
      const p = await getProfile(user.$id);
      setProfile(p);
    }

    loadMyProfile();
  }, [user]);

  // ---------------------------
  // Actions
  // ---------------------------
  const handleDelete = async (rant) => {
    if (!user || rant.userId !== user.$id) return alert("You can only delete your own rants.");
    setRants((prev) => prev.filter((r) => r.$id !== rant.$id));
    await deleteRant(rant.$id);
  };

  const handleEdit = (rant) => {
    if (!user || rant.userId !== user.$id) return alert("You can only edit your own rants.");
    setEditingRant(rant);
    setShowRantDialog(true);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 mt-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={
                profile?.avatarId
                  ? storage.getFileView(APPWRITE_MEMORIES_BUCKET_ID, profile.avatarId)
                  : undefined
              }
            />
            <AvatarFallback>{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg sm:text-2xl font-bold">
            Welcome, {profile?.username || user.email}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to="/music">
            <Button variant="outline" className="w-full sm:w-auto">
              🎵 Music Streak
            </Button>
          </Link>

          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setEditingRant(null);
              setShowRantDialog(true);
            }}
          >
            Post a Rant
          </Button>
        </div>
      </div>

      {/* Song of the Day */}
      {songOfTheDay && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg p-4 bg-yellow-50 shadow-sm space-y-3"
        >
          <h2 className="font-bold text-lg flex items-center gap-2">
            🎵 Song of the Day
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={songOfTheDay.artworkUrl}
              alt="album art"
              className="w-full sm:w-24 h-24 rounded shadow object-cover"
            />

            <div className="flex flex-col w-full sm:w-auto">
              <p className="font-semibold">{songOfTheDay.trackName}</p>
              <p className="text-sm text-gray-600">{songOfTheDay.artistName}</p>
              <p className="text-xs text-gray-500">Picked by {songOfTheDay.username}</p>
              <audio
                controls
                src={songOfTheDay.previewUrl}
                className="w-full sm:w-64 mt-2"
              />

            </div>
          </div>
        </motion.div>
      )}

      {/* Rant Dialog */}
      {showRantDialog && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-2 shadow-lg"
          >
            <h2 className="text-lg font-bold mb-4">Post a Rant</h2>
            <RantForm
              user={user}
              editingRant={editingRant}
              onPosted={(updatedRant) => {
                if (editingRant) {
                  setRants((prev) =>
                    prev.map((r) => (r.$id === updatedRant.$id ? updatedRant : r))
                  );
                  setEditingRant(null);
                } else {
                  setRants((prev) => [updatedRant, ...prev]);
                }
                setShowRantDialog(false);
              }}
              onCancel={() => setShowRantDialog(false)}
            />
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setShowRantDialog(false)}
            >
              Cancel
            </Button>
          </motion.div>
        </div>
      )}

      {/* Rants */}
      <AnimatePresence>
        <div className="space-y-4">
          {rants.length === 0 && <p className="text-center text-gray-500">No rants yet.</p>}

          {rants.map((rant) => {
            const rantProfile = rant.userId ? profiles[rant.userId] : null;

            return (
              <motion.div
                key={rant.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                layout
                className="border rounded p-4 space-y-2 bg-white shadow-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <Link
                    to={`/profile/${rant.userId}`}
                    className="flex items-center gap-3 hover:opacity-80 w-full sm:w-auto"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          rantProfile?.avatarId
                            ? storage.getFileView(APPWRITE_MEMORIES_BUCKET_ID, rantProfile.avatarId)
                            : undefined
                        }
                      />
                      <AvatarFallback>{rantProfile?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col leading-tight">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm">{rantProfile?.username || "Unknown"}</p>
                        <span className="text-gray-400 text-xs">•</span>
                        <p className="text-gray-500 text-xs">{rantProfile?.course || "Unknown"}</p>
                      </div>
                      <p className="text-xs text-gray-400">{timeAgo(rant.$createdAt)}</p>
                    </div>
                  </Link>

                  {rant.userId && user.$id === rant.userId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(rant)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(rant)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <p className="text-sm whitespace-pre-wrap break-words">{rant.content}</p>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
