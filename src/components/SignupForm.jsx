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
      // 1️⃣ Create account
      await signup(
        data.email,
        data.password,
        data.username,
        data.birthday
      );

      // 2️⃣ Auto login
      await login(data.email, data.password);

      // 3️⃣ Notify parent
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
      className="space-y-4 w-80 mx-auto"
    >
      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      <div>
        <Input placeholder="Username" {...form.register("username")} />
        <p className="text-red-500 text-xs">
          {form.formState.errors.username?.message}
        </p>
      </div>

      <div>
        <Input placeholder="Email" {...form.register("email")} />
        <p className="text-red-500 text-xs">
          {form.formState.errors.email?.message}
        </p>
      </div>

      <div>
        <Input type="date" {...form.register("birthday")} />
        <p className="text-red-500 text-xs">
          {form.formState.errors.birthday?.message}
        </p>
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          {...form.register("password")}
        />
        <p className="text-red-500 text-xs">
          {form.formState.errors.password?.message}
        </p>
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
