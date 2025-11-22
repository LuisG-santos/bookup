"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";

const LoginForms = () => {
    const params = useParams<{ subdomain: string }>();
    const subdomain = params?.subdomain;
   const handleLoginWithGoogle = async() => {
    await signIn("google", {
      callbackUrl: `/${subdomain}`,
    });
  };

  return ( 
    <Card className=" max-w-sm border border-solid ">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full bg-[var(--secondary)] text-[var(--text-primary)] hover:bg-zinc-300">
          Login
        </Button>
        <Button variant="outline" className="w-full" onClick={handleLoginWithGoogle}>
          <Image src="/google.svg" alt="Google Icon" width={20} height={20} className="inline-block mr-2" />
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
 
export default LoginForms;