
import { db } from "@/app/_lib/prisma";
import HomeContent from "@/app/_components/ui/Homecontent";
type PageProps = {
  params: Promise<{ subdomain: string }>;
};

export default async function TenantPage({ params }: PageProps) {
  const { subdomain } = await params;

  const commerce = await db.commerce.findUnique({
    where: { subdomain},
  });

  if (!commerce) {
    return null;
  }

  const basePath = `/${subdomain}`;

  return (
   <HomeContent commerceId={commerce.id} basePath={`${subdomain}`} />
  );
}