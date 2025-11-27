import LoginForms from "@/app/_components/ui/loginform";
import { db } from "@/app/_lib/prisma";


 type PageProps = {
    params: Promise<{ subdomain: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { subdomain } = await params;

  if (!subdomain) {
    return <div>Subdomain not provided</div>;
  }
  const commerce = await db.commerce.findUnique({
    where: { subdomain: subdomain },
    select: {
      heroImageURL: true,
    },
  });

  const heroImageURL = commerce?.heroImageURL ?? undefined;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--primary)]" >

      <LoginForms heroImageURL={heroImageURL}/>
    </div>
  );
}

