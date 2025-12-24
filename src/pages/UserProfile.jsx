import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../profile/profile";
import { getRants } from "../rants/rants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { storage } from "../lib/appwrite";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/AuthContext";

export default function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // logged-in user

    const [profile, setProfile] = useState(null);
    const [rants, setRants] = useState([]);

    useEffect(() => {
        // 🔥 If user opens THEIR OWN profile → go to editable profile
        if (user && user.$id === userId) {
        navigate("/profile", { replace: true });
        return;
        }

        async function loadData() {
        const p = await getProfile(userId);
        setProfile(p);

        const allRants = await getRants();
        const userRants = allRants
            .filter((r) => r.userId === userId)
            .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

        setRants(userRants);
        }

        loadData();
    }, [userId, user, navigate]);

    if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">

        {/* 🔙 Back Button */}
        <Button
            variant="ghost"
            className="mb-2"
            onClick={() => navigate("/home")}
        >
            ← Back to Home
        </Button>

        {/* Profile Header */}
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
            <AvatarImage
                src={
                profile.avatarId
                    ? storage.getFileView(
                        APPWRITE_MEMORIES_BUCKET_ID,
                        profile.avatarId
                    )
                    : undefined
                }
            />
            <AvatarFallback>
                {profile.username?.[0]?.toUpperCase()}
            </AvatarFallback>
            </Avatar>

            <div>
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="text-sm text-gray-500">{profile.course}</p>
            {profile.bio && (
                <p className="text-sm mt-1 text-gray-600">{profile.bio}</p>
            )}
            </div>
        </div>

        <hr />

        {/* User Rants */}
        <div className="space-y-4">
            {rants.length === 0 && (
            <p className="text-gray-500 text-center">
                This user hasn’t posted yet.
            </p>
            )}

            {rants.map((rant) => (
            <div
                key={rant.$id}
                className="border rounded p-4 bg-white shadow-sm"
            >
                <p className="text-sm whitespace-pre-wrap">
                {rant.content}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                {new Date(rant.$createdAt).toLocaleString()}
                </p>
            </div>
            ))}
        </div>
        </div>
    );
}
