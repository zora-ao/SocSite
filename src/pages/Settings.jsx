import { useState, useEffect } from "react";
import { updateEmail, updatePassword } from "../auth/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/"); // redirect if somehow user is null
    else setEmail(user.email);
  }, [user, navigate]);

  if (!user) return <p className="text-center mt-10">Loading settings...</p>;

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

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) return alert("Fill both password fields");
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

  const handleLogoutClick = async () => {
    await logout(); // update context
    navigate("/");   // login page will appear automatically
  };

  return (
    <div className="w-3/4 max-w-4xl mx-auto mt-10 space-y-8">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Email Section */}
      <div className="space-y-2">
        <label className="font-semibold">Change Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={handleEmailUpdate}>Update Email</Button>
      </div>

      <hr />

      {/* Password Section */}
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
        <Button onClick={handlePasswordUpdate}>Update Password</Button>
      </div>

      <hr />

      {/* Logout */}
      <div className="pt-4">
        <Button variant="destructive" className="w-full" onClick={handleLogoutClick}>
          Logout
        </Button>
      </div>
    </div>
  );
}
