import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { Button } from "@/components/ui/button";
import frame2 from "../assets/frame2.png";
import bulb from "../assets/bulbs.png"
import star1 from "../assets/star1.png"
import star2 from "../assets/star2.png"
import mot1 from "../assets/mot1.png"

export default function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
      <img className="md:h-[250px] h-[150px] absolute right-0 md:left-40 top-0 z-10" src={bulb} alt="" />
     
      <img className="md:h-[40px] h-[30px] absolute md:right-40 right-30 top-5 z-10" src={star1} alt="" />
      
      <img className="md:h-[40px] h-[20px] absolute md:right-60 right-20 top-6 z-10" src={star1} alt="" />
      
      <img className="md:h-[40px] h-[20px] absolute md:right-80 top-0 z-10" src={star1} alt="" />
      
      <img className="md:h-[40px] h-[30px] absolute md:right-70 right-3 top-40 z-10" src={star2} alt="" />

      <img className="md:h-[40px] h-[30px] absolute md:right-70 right-12 top-30 z-10" src={star2} alt="" />

      <img className="md:h-[40px] h-[30px] absolute md:right-70 right-0 top-30 z-10" src={star2} alt="" />
      
      <img className="md:h-[350px] h-[250px] absolute md:left-20 left-0 -top-15 z-10" src={mot1} alt="" />
      
      {/* FRAME CONTAINER */}
      <div
        className="relative rounded-xl md:bg-contain md:w-[460px] w-full md:h-[480px] h-[400px] bg-no-repeat md:bg-center flex pt-20 justify-center"
        style={{ backgroundImage: `url(${frame2})` }}
      >
        {/* FORM CONTENT */}
        <div className="w-[80%]">
          <h1 className="text-2xl text-center">
            S-pace
          </h1>
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
