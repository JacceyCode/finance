"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { signIn, signUp } from "@/lib/actions/user.action";
import { AuthFormSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formSchema = AuthFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);
    try {
      // sign up with appwrite & create a plaid token
      const userData = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        address1: data.address1!,
        city: data.city!,
        state: data.state!,
        postalCode: data.postalCode!,
        dateOfBirth: data.dateOfBirth!,
        ssn: data.ssn!,
        email: data.email,
        password: data.password,
      };

      if (type === "sign-up") {
        const newUser = await signUp(userData);

        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) router.push("/");
      }
    } catch (error: any) {
      console.error("Auth error", error.message);
      // setError(error.message);
      setError("An unexpected error occurred. Please try again or signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1 flex">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />

          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            OneCilck
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}

            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      control={form.control}
                    />

                    <CustomInput
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      control={form.control}
                    />
                  </div>

                  <CustomInput
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                    control={form.control}
                  />

                  <CustomInput
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                    control={form.control}
                  />

                  <div className="flex gap-4">
                    <CustomInput
                      name="state"
                      label="State"
                      placeholder="ex: LA"
                      control={form.control}
                    />

                    <CustomInput
                      name="postalCode"
                      label="Postal Code"
                      placeholder="ex: 11101"
                      control={form.control}
                    />
                  </div>

                  <div className="flex gap-4">
                    <CustomInput
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                      control={form.control}
                    />

                    <CustomInput
                      name="ssn"
                      label="SSN"
                      placeholder="ex: 1234"
                      control={form.control}
                    />
                  </div>
                </>
              )}

              <CustomInput
                name="email"
                label="Email"
                placeholder={`Email ${
                  type === "sign-in" ? " - (test-email: raph@test.com)" : ""
                }`}
                control={form.control}
              />

              <CustomInput
                name="password"
                label="Password"
                placeholder={`Password ${
                  type === "sign-in" ? " - (test-pass: Raph@test)" : ""
                }`}
                control={form.control}
              />

              <div className="flex flex-col gap-4">
                <small className="text-red-400">{error}</small>
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
