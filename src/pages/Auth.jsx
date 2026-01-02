import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { Button } from "@/components/ui/button";
import bg from "../assets/bg.png";
import star2 from "../assets/star2.png";

export default function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 bg-center bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* FORM CONTAINER */}
      <div className="relative rounded-xl w-full md:w-[460px] md:h-[380px] py-4 flex items-center justify-center shadow-md bg-[#F5F5F0]/90 backdrop-blur-sm">
        <div className="w-[80%]">
          <img
            className="md:h-[40px] h-[30px] absolute right-0 top-10 z-10"
            src={star2}
            alt=""
          />
          <img
            className="md:h-[40px] h-[30px] absolute left-0 top-10 z-10"
            src={star2}
            alt=""
          />

          <h1 className="text-2xl pacifico  text-center mb-4">S-pace</h1>

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
    </div>
  );
}
