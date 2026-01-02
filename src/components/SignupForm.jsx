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
    defaultValues: {
      username: "",
      email: "",
      birthday: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitError("");

    // Ensure all fields are strings
    const username = data.username || "";
    const email = data.email || "";
    const birthday = data.birthday || "";
    const password = data.password || "";

    try {
      // 1️⃣ Create account
      await signup(email, password, username, birthday);

      // 2️⃣ Auto login
      await login(email, password);

      // 3️⃣ Notify parent
      onSuccess?.();
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
      className="space-y-4 w-full max-w-md mx-auto px-2 sm:px-0"
    >
      {/* Error message */}
      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      {/* Username */}
      <div>
        <Input
          placeholder="Username"
          {...form.register("username")}
          value={form.watch("username") || ""}
          onChange={(e) => form.setValue("username", e.target.value)}
          className="h-11 sm:h-10"
          autoComplete="username"
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
          value={form.watch("email") || ""}
          onChange={(e) => form.setValue("email", e.target.value)}
          className="h-11 sm:h-10"
          autoComplete="email"
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
          value={form.watch("birthday") || ""}
          onChange={(e) => form.setValue("birthday", e.target.value)}
          className="h-11 sm:h-10"
          autoComplete="bday"
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
          value={form.watch("password") || ""}
          onChange={(e) => form.setValue("password", e.target.value)}
          className="h-11 sm:h-10"
          autoComplete="new-password"
        />
        <p className="text-red-500 text-xs mt-1">
          {form.formState.errors.password?.message}
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full h-11 bg-[#5D866C] active:scale-95 transition-transform"
      >
        {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
