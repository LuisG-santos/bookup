import { db } from "@/app/_lib/prisma";
import HomeContent from "@/app/_components/ui/Homecontent";

type PageProps = {
  params: Promise<{ subdomain: string }>;
  searchParams?: Promise<{
    search?: string;
  }>;
};

export default async function TenantPage({ params, searchParams }: PageProps) {
  const { subdomain } = await params;
  const sp = (await searchParams) ?? {};

  if (!subdomain) {
    return null;
  }

  const commerce = await db.commerce.findUnique({
    where: { subdomain },
  });

  if (!commerce) {
    return null;
  }

  return (
    <HomeContent
      commerceId={commerce.id}
      basePath={subdomain}
      commerceName={commerce.name}
      searchParams={sp}
    />
  );
}