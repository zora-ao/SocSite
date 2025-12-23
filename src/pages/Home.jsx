import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import RantForm from "../components/RantForm";
import { getRants, deleteRant } from "../rants/rants";
import { Button } from "@/components/ui/button";

import { getProfile } from "../profile/profile";
import { storage } from "../lib/appwrite";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";

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

  const [showRantForm, setShowRantForm] = useState(false);
  const [editingRant, setEditingRant] = useState(null);

  // ---------------------------
  // Load rants + profiles
  // ---------------------------
  const loadRants = async () => {
    const data = await getRants();

    // Sort newest first
    data.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
    setRants(data);

    const uniqueUserIds = [...new Set(data.map((r) => r.userId))];
    const profileResults = await Promise.all(uniqueUserIds.map((id) => getProfile(id)));

    const profileMap = {};
    uniqueUserIds.forEach((id, index) => {
      profileMap[id] = profileResults[index];
    });

    setProfiles(profileMap);
  };

  // ---------------------------
  // Initial load
  // ---------------------------
  useEffect(() => {
    loadRants();

    async function loadMyProfile() {
      const p = await getProfile(user.$id);
      setProfile(p);
    }

    loadMyProfile();
  }, []);

  // ---------------------------
  // Actions
  // ---------------------------
  const handleDelete = async (rant) => {
    if (rant.userId !== user.$id) return alert("You can only delete your own rants.");
    await deleteRant(rant.$id);
    loadRants();
  };

  const handleEdit = (rant) => {
    if (rant.userId !== user.$id) return alert("You can only edit your own rants.");
    setEditingRant(rant);
    setShowRantForm(true);
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="w-full md:w-2/3 mx-auto space-y-6 mt-4 md:mt-10 px-2 md:px-0">
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
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome, {profile?.username || user.email}
          </h1>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingRant(null);
            setShowRantForm((prev) => !prev);
          }}
        >
          {showRantForm ? "Cancel" : "Post a Rant"}
        </Button>
      </div>

      {/* Rant Form */}
      {showRantForm && (
        <RantForm
          user={user}
          profile={profile}
          editingRant={editingRant}
          onPosted={() => {
            loadRants();
            setShowRantForm(false);
          }}
        />
      )}

      {/* Rants */}
      <div className="space-y-4">
        {rants.length === 0 && <p className="text-center text-gray-500">No rants yet.</p>}

        {rants.map((rant) => {
          const rantProfile = profiles[rant.userId];
          return (
            <div
              key={rant.$id}
              className="border rounded p-4 space-y-2 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
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
                </div>

                {rant.userId === user.$id && (
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
