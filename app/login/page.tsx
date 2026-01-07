
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: {callbackUrl?: string} }) {
 const callbackUrl = searchParams.callbackUrl ?? "https://belivio.com.br/";
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary" >
      <LoginClient callbackUrl={callbackUrl} />
    </div>
  );
}

