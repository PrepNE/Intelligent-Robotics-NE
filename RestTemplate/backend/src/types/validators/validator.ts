import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
    password: z.string().min(6)
})

export const validatedUser = (data: any) => {
   const user = userSchema.safeParse(data);
   if(!user.success){
    throw new Error(user.error.errors[0].message);
   }
   return user.data;
}
