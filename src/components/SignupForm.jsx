import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signupSchema";
import { useAuth } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SignupForm({ onSuccess }) {
  const [submitError, setSubmitError] = useState("");
  const { signup, login } = useAuth();

  const form = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setSubmitError("");

    try {
      await signup(
        data.email,
        data.password,
        data.username,
        data.birthday
      );

      await login(data.email, data.password);
      onSuccess();
    } catch (err) {
      const message = err?.message || "Signup failed";

      if (
        message.toLowerCase().includes("data breach") ||
        message.toLowerCase().includes("password")
      ) {
        setSubmitError(
          "This password is too common or unsafe. Please choose a stronger password."
        );
      } else if (message.toLowerCase().includes("already exists")) {
        setSubmitError("An account with this email already exists.");
      } else {
        setSubmitError(message);
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="
        space-y-4
        w-full max-w-md
        mx-auto
        px-2 sm:px-0
      "
    >
      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      {/* Username */}
      <div>
        <Input
          placeholder="Username"
          {...form.register("username")}
          className="h-11 sm:h-10"
        />
        <p className="text-red-500 text-xs mt-1">
          {form.formState.errors.username?.message}
        </p>
      </div>

      {/* Email */}
      <div>
        <Input
          placeholder="Email"
          type="email"
          {...form.register("email")}
          className="h-11 sm:h-10"
        />
        <p className="text-red-500 text-xs mt-1">
          {form.formState.errors.email?.message}
        </p>
      </div>

      {/* Birthday */}
      <div>
        <Input
          type="date"
          {...form.register("birthday")}
          className="h-11 sm:h-10"
        />
        <p className="text-red-500 text-xs mt-1">
          {form.formState.errors.birthday?.message}
        </p>
      </div>

      {/* Password */}
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...form.register("password")}
          className="h-11 sm:h-10"
        />
        <p className="text-red-500 text-xs mt-1">
          {form.formState.errors.password?.message}
        </p>
      </div>

      <Button
        className="w-full h-11 bg-[#5D866C] active:scale-95 transition-transform"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
