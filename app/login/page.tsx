
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ callbackUrl: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  
  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl;

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary" >
      <LoginClient callbackUrl={callbackUrl} />
    </div>
  );
}

