// src/components/LoginForm.jsx

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, getCurrentUser } from "../auth/auth";
import { loginSchema } from "../schemas/loginSchema";

export default function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // 1️⃣ Check if user is already logged in
  try {
    const user = await getCurrentUser();
    if (user) {
      onLoginSuccess(user); // Already logged in, skip login
      return;
    }
  } catch (err) {
    // No active session → continue to login
  }

  // 2️⃣ Attempt login
  try {
    setLoading(true);
    await login(email, password);            // Appwrite login
    const user = await getCurrentUser();    // Fetch logged-in user
    onLoginSuccess(user);
    window.location.reload();
  } catch (err) {
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 mx-auto mt-10">
        {error && <p className="text-red-500">{error}</p>}
        <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
        </Button>
        </form>
    );
}
