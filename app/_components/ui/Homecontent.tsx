import { Button } from "./button";
import Header from "./header";
import ServicesGrid from "./ServicesGrid";
import BookingItem from "./BookingItem";
import Image from "next/image";
import { ClientBanner } from "@/app/_components/ui/banner";
import { createQuicksearchOption } from "@/app/_constants/search";
import { db } from "@/app/_lib/prisma";
import FooterPage from "./Footer";
import SearchForm from "./SearchForm";
import { Tag } from "lucide-react";
import Link from "next/link";
import { encode } from "punycode";

type HomeContentProps = {
  commerceId: string;
  basePath: string;
  commerceName: string;
  searchParams?: {
    search?: string;
  };
};
export const dynamic = "force-dynamic";

export default async function HomeContent({ commerceId, basePath, commerceName, searchParams }: HomeContentProps) {
  const term = (searchParams?.search ?? "").trim();

  const services = await db.services.findMany({
    where: {
      commerceId,
      ...(term && {
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
    orderBy: { name: "asc" },
  });

  let servicesToShow = services;
  let notFound = false;

  if (term && services.length === 0) {
    notFound = true;


    servicesToShow = await db.services.findMany({
      where: { commerceId },
      orderBy: { name: "asc" },
    });
  }

  const categoriesFromDb = await db.services.findMany({
    where: { commerceId },
    select: { category: true },
    distinct: ["category"],
  });

  const quicksearchOptions = createQuicksearchOption(
    categoriesFromDb.map((c) => c.category)
  );

  console.log("TERM:", term, "TOTAL:", services.length);

  return (
    <div className="bg-[var(--background)] min-h-screen">
      <Header subdomain={basePath} commerceName={commerceName} />

      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Luis !</h2>
        <p>Quinta-Feira, 13 de novembro</p>





        <SearchForm defaultValue={term} placeholder="O que você esta procurando?" />
        <div className=" flex gap-2 mt-6 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory">

          {quicksearchOptions.map((option) => (
            <Button
              className="gap-2 bg-[var(--primary)] text-[var(--text-secondary)] snap-start hover:bg-zinc-700"
              variant="secondary"
              key={option.label}
            >
              <Tag className="h-4 w-4" />
              <Link href={`?search=${encodeURIComponent(option.value)}`}>
                {option.label}
              </Link>
            </Button>
          ))}
        </div>

        <ClientBanner className="mt-6" />
        <BookingItem />

        <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Serviços Disponiveis</h2>

        {notFound && (
          <p className="text-sm text-red-400 mb-3">
            Nenhum serviço encontrado para "{term}".
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:overflow-x-auto md:gap-6 overflow-auto [&::-webkit-scrollbar]:hidden">

          {servicesToShow.map((service) => <ServicesGrid services={service} key={service.id} basePath={basePath} />)}
        </div>
      </div>

      <FooterPage commerceId={commerceId} />

    </div>
  );
}
