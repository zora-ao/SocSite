import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border rounded-xl p-6 w-90">
        {mode === "login" ? (
          <>
            <LoginForm onLoginSuccess={() => console.log("Logged in")} />

            <p className="text-sm text-center mt-4">
              Don’t have an account?
            </p>

            <Button
              variant="link"
              className="w-full"
              onClick={() => setMode("signup")}
            >
              Create account
            </Button>
          </>
        ) : (
          <>
            <SignupForm onSuccess={() => setMode("login")} />

            <Button
              variant="link"
              className="w-full mt-4"
              onClick={() => setMode("login")}
            >
              Back to login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
