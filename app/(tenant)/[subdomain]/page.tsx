
import { db } from "@/app/_lib/prisma";
import HomeContent from "@/app/_components/ui/Homecontent";
type PageProps = {
  params: Promise<{ subdomain: string }>; // em Next 16
};

export default async function TenantPage({ params }: PageProps) {
  const { subdomain } = await params;

  const commerce = await db.commerce.findUnique({
    where: { subdomain: subdomain },
  });

  if (!commerce) {
    return null;
  }

  return (
   <HomeContent commerceId={commerce.id} />
  );
}