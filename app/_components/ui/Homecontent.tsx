import { Button } from "./button";
import Header from "./header";
import ServicesGrid from "./ServicesGrid";
import BookingItem from "./BookingItem";
import { BookingStatus } from "@prisma/client";
import { ClientBanner } from "@/app/_components/ui/banner";
import { createQuicksearchOption } from "@/app/_constants/search";
import { db } from "@/app/_lib/prisma";
import FooterPage from "./Footer";
import SearchForm from "./SearchForm";
import { Tag } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Calendar } from "./calendar";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MuiCalendar } from "./calendarMUI";

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
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name ?? "Visitante";
  const userId = session?.user?.id;

  const membership = await db.commerceMembership.findFirst({
    where: {
      userId,
      commerceId: commerceId,
      role: "OWNER",
    },
  });

  const isOwner = membership?.role === "OWNER";

  let nextBookingDTO: {
    id: string;
    date: string;
    status: BookingStatus;
    serviceName: string;
  } | null = null;

  if (userId) {
    const nextBooking = await db.booking.findFirst({
      where: {
        userId,
        commerceId: commerceId,
        date: {
          gte: new Date(),
        },
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
      include: {
        service: true,
      },
      orderBy: { date: "asc" },
    });

    if (nextBooking) {
      nextBookingDTO = {
        id: nextBooking.id,
        status: nextBooking.status,
        date: nextBooking.date.toISOString(),
        serviceName: nextBooking.service.name,
      };
    }
  }


  const term = (searchParams?.search ?? "").trim();
  const Herocommerce = await db.commerce.findUnique({
    where: { id: commerceId },
    select: {
      heroTitle: true,
      heroSubtitle: true,
      heroImageURL: true,
    },
  });

  const servicesRaw = await db.services.findMany({
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

  const services = servicesRaw.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    imageURL: service.imageURL,
    commerceId: service.commerceId,
    price: Number(service.price),
    duration: service.duration,
  }));

  let servicesToShow = services;
  let notFound = false;

  if (term && services.length === 0) {
    notFound = true;

    const AllservicesRaw = await db.services.findMany({
      where: { commerceId },
      orderBy: { name: "asc" },
    });

    servicesToShow = AllservicesRaw.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      imageURL: service.imageURL,
      commerceId: service.commerceId,
      price: Number(service.price),
      duration: service.duration,
    }));
  }

  const categoriesFromDb = await db.services.findMany({
    where: { commerceId },
    select: { category: true },
    distinct: ["category"],
  });

  const quicksearchOptions = createQuicksearchOption(
    categoriesFromDb.map((c) => c.category)
  );

  return (
    <div className="bg-[var(--background)] text-[var(--text-on-background)] min-h-screen">
      <Header subdomain={basePath} commerceName={commerceName} isOwner={isOwner} />

      <div className="p-5">
        <h2 className="text-xl font-bold ">Olá, {userName} !</h2>
        <p className="text-sm ">{formattedDate}</p>

        <SearchForm defaultValue={term} placeholder="O que você esta procurando?" />
        <div className=" flex gap-2 mt-6 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory">

          {quicksearchOptions.map((option) => (
            <Button
              className="gap-2 bg-[var(--primary)] text-[var(--text-on-primary)] snap-start hover:bg-zinc-700"
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
        
        <ClientBanner title={Herocommerce?.heroTitle} subtitle={Herocommerce?.heroSubtitle} imageUrl={Herocommerce?.heroImageURL ?? "/cartoonH.png"} className="mt-6" />
        <BookingItem user={{ name: session?.user?.name ?? "", image: session?.user?.image ?? "" }} booking={nextBookingDTO} />

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
