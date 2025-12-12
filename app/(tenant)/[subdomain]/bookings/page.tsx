import { db } from "@/app/_lib/prisma";
import FooterPage from "@/app/_components/ui/Footer";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import SidebarSheet from "@/app/_components/sidebar-sheet";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { Badge } from "@/app/_components/ui/badge";
import { BookingStatus } from "@prisma/client";
import { CancelButton } from "@/app/_components/ui/CancelButton";
import { startOfDay } from "date-fns"

type PageProps = {
    params: Promise<{ subdomain: string }>;
};

export default async function BookingsPage({ params }: PageProps) {
    const { subdomain } = await params; 

    const basePath = `/${subdomain}`;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Usuário não autenticado");
    }

    const commerce = await db.commerce.findFirst({
        where: { subdomain },
        select: { id: true, name: true },
    });

    if (!commerce) {
        throw new Error("Comércio não encontrado");
    }

    const bookings = await db.booking.findMany({
        where: { commerceId: commerce.id, userId },
        include: {
            service: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { date: "asc" },
    });

    const StatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-600";
            case "CONFIRMED":
                return "bg-green-600";
            case "CANCELED":
                return "bg-red-600";
            default:
                return "bg-yellow-600";
        }
    };

    function translateStatus(status: string) {
        switch (status) {
            case "PENDING":
                return "Pendente";
            case "CONFIRMED":
                return "Confirmado";
            case "CANCELED":
                return "Cancelado";
            default:
                return status;
        }
    }
    const now = new Date();
    const todayStart = startOfDay(now);

    const activeBookings = bookings.filter((b) =>
        (b.status === BookingStatus.PENDING ||
            b.status === BookingStatus.CONFIRMED) &&
        b.date >= todayStart
    );

    const historyBookings = bookings.filter(
        (b) =>
            b.status === BookingStatus.CANCELED ||
            b.date < todayStart
    );

    return (
        <div className="relative min-h-screen w-full flex flex-col bg-[var(--background)] text-[var(--text-on-background)]">
            <div className="relative w-full">
                <Button
                    size="icon"
                    variant="outline"
                    className="fixed top-4 left-4"
                    asChild
                >
                    <Link href={basePath}>
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
                    <SidebarSheet commerceName={commerce.name} />
                </Sheet>
            </div>

            <main className="flex flex-1 flex-col items-center justify-start p-5 mt-10">
                <h1 className="text-xl text-[var(--text-on-background)]">Meus Agendamentos</h1>

                {activeBookings.length === 0 ? (
                    <p className="mt-4 text-sm text-zinc-500 text-[var(--text-on-background)]">
                        Você não possui agendamentos.
                    </p>
                ) : (
                    activeBookings.map((booking) => (
                        <div key={booking.id} className="w-full max-w-md mt-4">
                            <div className="flex-1">
                                <Card className="bg-[var(--primary)] shadow-[0_5px_7px_rgba(0,0,0,.55)]">
                                    <CardHeader className="flex justify-between">
                                        <h3 className="text-xl font-semibold">{booking.service?.name}</h3>
                                        <Badge className={`ml-2 h-7 w-20 ${StatusColor(booking.status)} `}>{translateStatus(booking.status)}</Badge>
                                    </CardHeader>
                                    <CardContent className="flex justify-between">
                                        <p className="text-sm text-zinc-400">{new Date(booking.date).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}</p>

                                        <p className="text-sm text-zinc-400">{new Date(booking.date).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}</p>


                                    </CardContent>

                                    {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                                        <CancelButton bookingId={booking.id} />
                                    )}
                                </Card>
                            </div>
                        </div>
                    ))
                )}

                {historyBookings.length > 0 && (
                    <>
                        <div className="w-full max-w-md mt-4">
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold mt-8 mb-2 text">Histórico</h2>

                                {historyBookings.map((booking) => (
                                    <Card
                                        key={booking.id}
                                        className="mb-4 bg-[var(--primary)] text-[var(--text-on-background)] opacity-60 border border-zinc-800"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{booking.service.name}</h3>
                                                    <p>{booking.date.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}</p>
                                                </div>

                                                <Badge className="bg-red-700 text-white">
                                                    Cancelado
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
            <FooterPage commerceId={commerce.id} />
        </div>
    );
}