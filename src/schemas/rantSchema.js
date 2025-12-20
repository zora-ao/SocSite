import { z } from "zod";

export const rantSchema = z.object({
    content: z.string().min(1, "Rant cannot be empty"),
});
