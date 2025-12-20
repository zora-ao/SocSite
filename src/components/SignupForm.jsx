// components/SignupForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signupSchema";
import { signup, login } from "../auth/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupForm({ onSuccess }) {
    const form = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data) => {
        await signup(data.email, data.password, data.username);
        await login(data.email, data.password);
        onSuccess();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-80 mx-auto">
        <Input placeholder="Username" {...form.register("username")} />
        <p className="text-red-500">{form.formState.errors.username?.message}</p>

        <Input placeholder="Email" {...form.register("email")} />
        <p className="text-red-500">{form.formState.errors.email?.message}</p>

        <Input type="password" placeholder="Password" {...form.register("password")} />
        <p className="text-red-500">{form.formState.errors.password?.message}</p>

        <Button className="w-full">Sign up</Button>
        </form>
    );
}
