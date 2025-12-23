import { useEffect, useState } from "react";
import { getCurrentUser, updateEmail, updatePassword, logout } from "../auth/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      setUser(u);
      setEmail(u.email);
    }
    loadUser();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading settings...</p>;

  // ------------------
  // Update Email
  // ------------------
  const handleEmailUpdate = async () => {
    if (!email) return alert("Email cannot be empty");
    try {
      await updateEmail(email);
      alert("Email updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update email");
    }
  };

  // ------------------
  // Update Password
  // ------------------
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      return alert("Fill both password fields");
    }

    try {
      await updatePassword(newPassword, currentPassword);
      setCurrentPassword("");
      setNewPassword("");
      alert("Password updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  // ------------------
  // Logout
  // ------------------
  const handleLogout = async () => {
    await logout();
    navigate("/"); // goes back to Auth page
  };

  return (
    <div className="w-3/4 max-w-4xl mx-auto mt-10 space-y-8">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Email */}
      <div className="space-y-2">
        <label className="font-semibold">Change Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleEmailUpdate}>Update Email</Button>
      </div>

      <hr />

      {/* Password */}
      <div className="space-y-2">
        <label className="font-semibold">Change Password</label>
        <Input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button onClick={handlePasswordUpdate}>
          Update Password
        </Button>
      </div>

      <hr />

      {/* Logout */}
      <div className="pt-4">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
