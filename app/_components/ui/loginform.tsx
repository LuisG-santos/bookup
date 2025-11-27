"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";

type LoginFormsProps = {
  heroImageURL?: string;
};

export default function LoginForms({ heroImageURL }: LoginFormsProps) {
    const params = useParams<{ subdomain: string }>();
    const subdomain = params?.subdomain;
   const handleLoginWithGoogle = async() => {
    await signIn("google", {
      callbackUrl: `/${subdomain}`,
    });
  };

  return ( 
    <div className="relative min-h-screen flex items-end w-full bg-gray-1000">
      
      <Image
        src="/backgroundLogin.png"
        alt="Login Illustration"
        fill
        className="object-cover pb-40"
        priority
      />

    <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent"></div>

      <div className="relative z-10 p-6 pb-3 text-center w-full max-w-md ">
        <h1 className="text-3xl font-bold leading-tight"> Faça login com Google</h1>
        <p className="text-gray-300  text-lg">para acessar seus agendamentos<br/>  e facilitar suas próximas visitas</p>
        <Button
          variant="outline"
          className="mt-3 mb-12 w-full bg-white  hover:bg-gray-200 flex items-center gap-2 py-6 text-lg font-semibold"
          onClick={handleLoginWithGoogle}
        >
          <Image
            src="/google.svg"
            alt="Google Icon"
            width={20}
            height={20}
            className="inline-block mr-2"
          />
          Login with Google
        </Button>
      </div>
    </div>
  );
}
 
