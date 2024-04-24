"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function SignIn() {
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: Zod.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if (result) {
      setIsSubmitting(false);
    }

    if (result?.error) {
      if (result.error == "CredentialsSignin") {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Incorrect Credentials"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error
        })
      }
    }

    if (result?.url) {
      router.replace("/dashboard")
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">SignIn to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email/username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your email/username for signing in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your password for signing in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  Please Wait <Loader2 className="mr-2 h-4 w-4" />
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link
              href={"/sign-up"}
              className="text-blue-500 hover:text-blue-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
