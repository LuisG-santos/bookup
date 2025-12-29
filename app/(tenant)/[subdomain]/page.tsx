import { db } from "@/app/_lib/prisma";
import HomeContent from "@/app/_components/ui/Homecontent";
import { expirePendingBookings } from "@/app/_lib/expirePendingBookings";

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

  await expirePendingBookings({ commerceId: commerce.id, graceMinutes: 10 });

  return (
    <HomeContent
      commerceId={commerce.id}
      basePath={subdomain}
      commerceName={commerce.name}
      searchParams={sp}
    />
  );
}