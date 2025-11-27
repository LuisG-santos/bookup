
import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { MenuIcon } from "lucide-react";
import SidebarSheet from "@/app/_components/sidebar-sheet";
import Footer from "@/app/_components/ui/Footer"
import { BookingCalendar } from "@/app/_components/ui/BookingCalendar"

type PageProps = {
    params: Promise<{ subdomain: string; id: string }>
}

const SchedulePage = async ({ params }: PageProps) => {
    const { subdomain, id } = await params;
    const service = await db.services.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            price: true,
            commerceId: true,
        }
    });

    if (!service) {
        return notFound();
    }



return (
    <div className="relative h-[250px] w-full">
        <Button size="icon" variant="outline" className="fixed top-4 left-4" asChild>
            <Link href={`/${subdomain}`} className="">
                <ChevronLeftIcon />
            </Link>
        </Button>

        <div>

        </div>

        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="fixed top-4 right-4">
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SidebarSheet commerceName={service?.name ?? ""} />
        </Sheet>

        <div className="flex flex-col p-5 mt-12 space-y-4">
            <h1 className="text-4xl">{service?.name}</h1>
            <p className="text-sm text-zinc-400 border-b pb-5 border-zinc-700"> {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(Number(service.price))} • 50 minutos
            </p>
            <div className="flex flex-col justify-center">

                <div className="w-full max-w-3xl border-b border-zinc-700 ">
                    <h2 className="font-semibold text-lg ">Selecione a data</h2>
                    <BookingCalendar service={{
                        id: service.id,
                        name: service.name,
                        price: service.price.toString(), // ou Number(service.price)
                        commerceId: service.commerceId,
                    }} />

                </div>
            </div>




        </div>

        <Footer commerceId={service.commerceId} />

    </div>
)
}

export default SchedulePage