import { z } from "zod";

export const AuthFormSchema = (type: string) =>
  z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be a minimum of 8 characters.",
    }),

    // sign up
    firstName:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(3, {
            message: "First name must be a minimum of 3 characters.",
          }),
    lastName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    address1: type === "sign-in" ? z.string().optional() : z.string().max(50),
    city: type === "sign-in" ? z.string().optional() : z.string().max(10),
    state:
      type === "sign-in" ? z.string().optional() : z.string().min(2).max(2),
    postalCode:
      type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
    dateOfBirth: type === "sign-in" ? z.string().optional() : z.string().min(3),
    ssn: type === "sign-in" ? z.string().optional() : z.string().min(3),
  });
