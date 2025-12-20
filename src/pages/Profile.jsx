import { useEffect, useState } from "react";
import { getCurrentUser, updateName, updateEmail, updatePassword } from "../auth/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Profile() {
    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCurrentUser().then((u) => {
        setUser(u);
        setName(u.name || "");
        setEmail(u.email || "");
        });
    }, []);

    if (!user) return <p>Loading profile...</p>;

    const handleSave = async () => {
        setError("");
        setMessage("");
        setLoading(true);

        try {
        // Update name if changed
        if (name !== user.name) {
            await updateName(name);
        }

        // Update email if changed (requires password)
        if (email !== user.email) {
            if (!currentPassword) {
            throw new Error("Current password is required to change email");
            }
            await updateEmail(email, currentPassword);
        }

        // Update password if provided
        if (newPassword) {
            if (!currentPassword) {
            throw new Error("Current password is required to change password");
            }
            await updatePassword(newPassword, currentPassword);
        }

        setMessage("Profile updated successfully 🎉");
        setNewPassword("");
        setCurrentPassword("");
        } catch (err) {
        setError(err.message || "Failed to update profile");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 space-y-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />

        <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <Input
            type="password"
            placeholder="Current password (required for email/password change)"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <Input
            type="password"
            placeholder="New password (optional)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
        />

        <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
        </Button>
        </div>
    );
}
