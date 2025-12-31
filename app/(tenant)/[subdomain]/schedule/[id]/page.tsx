import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon, MenuIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import SidebarSheet from "@/app/_components/sidebar-sheet";
import Footer from "@/app/_components/ui/Footer"
import { BookingCalendar } from "@/app/_components/ui/BookingCalendar"

type PageProps = {
  params: Promise<{ subdomain: string; id: string }>
}

const SchedulePage = async ({ params }: PageProps) => {
  const { subdomain, id } = await params;

  const service = await db.services.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      commerceId: true,
      duration: true,
    },
  });

  if (!service) {
    return notFound();
  }

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] text-[var(--text-on-background)] overflow-x-hidden">
      {/* botões fixos */}
      <Button
        size="icon"
        variant="outline"
        className="fixed top-4 left-4"
        asChild
      >
        <Link href={`/${subdomain}`}>
          <ChevronLeftIcon />
        </Link>
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="fixed top-4 right-4"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SidebarSheet commerceName={service.name} isOwner={false} />
      </Sheet>

      {/* wrapper de conteúdo centralizado */}
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col p-5 pt-16 space-y-4">
        <h1 className="text-4xl">{service.name}</h1>

        <p className="border-b border-[var(--text-on-primary)] pb-5 text-sm text-zinc-400">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(service.price))}{" "}
          • {String(service.duration)} minutos
        </p>

        <section className="w-full ">
          <h2 className="text-lg font-semibold">Selecione a data</h2>

          <BookingCalendar
            service={{
              id: service.id,
              name: service.name,
              price: service.price.toString(),
              commerceId: service.commerceId,
              duration: service.duration,
            }}
          />
        </section>
      </main>

      <Footer commerceId={service.commerceId} />
    </div>
  );
};

export default SchedulePage;
