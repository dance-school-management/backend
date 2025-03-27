"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { redirect, RedirectType } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
  name: z.string(),
  surname: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      name: "",
      surname: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    toast(
      <pre className="w-full rounded-md bg-slate-950">
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        <code className="text-white">{JSON.stringify((({ confirm_password, ...rest }) => rest)(values), null, 2)}</code>
      </pre>
    );

    setTimeout(() => {
      redirect("/", RedirectType.replace);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter informations below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name*</FormLabel>
                    <FormControl>
                      <Input {...field} id="name" type="text" required />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )} />
                <FormField control={form.control} name="surname" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="surname">Surname*</FormLabel>
                    <FormControl>
                      <Input {...field} id="surname" type="text" required />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email*</FormLabel>
                    <FormControl>
                      <Input {...field} id="email" type="email" required />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password*</FormLabel>
                    <Input {...field} id="password" type="password" required />
                    <FormMessage {...field} />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirm_password" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirm_password">Confirm Password*</FormLabel>
                    <FormControl>
                      <Input {...field} id="confirm_password" type="password" required />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Log In
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
