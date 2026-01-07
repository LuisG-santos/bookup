import { Suspense } from "react";
import LoginForms from "@/app/_components/ui/loginform";

export default function LoginClient() {
    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
            <LoginForms/>
        </Suspense>
    );
}