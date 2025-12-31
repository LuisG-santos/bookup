import { db } from "@/app/_lib/prisma";
import FooterPage from "@/app/_components/ui/Footer";
import { Card, CardContent } from "@/app/_components/ui/card";
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
import { startOfDay } from "date-fns";
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import { expirePendingBookings } from "@/app/_lib/expirePendingBookings";

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

    await expirePendingBookings({ commerceId: commerce.id, graceMinutes: 10 });

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
            case "FINALIZED":
                return "bg-gray-600";
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
            case "FINALIZED":
                return "Finalizado";
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
            b.date < todayStart ||
            b.status === BookingStatus.FINALIZED
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
                    <SidebarSheet commerceName={commerce.name} isOwner={false}/>
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

                            <Card className="mt-6 p-3 bg-[var(--primary)] shadow-[0_5px_7px_rgba(0,0,0,.55)]">

                                <CardContent className="flex justify-between p-0">

                                    <div className="flex flex-col gap-2 p-5 pl-5">
                                        <Badge className={` text-sm font-semibold w-fit ${StatusColor(booking.status)} `}>{translateStatus(booking.status)}</Badge>
                                        <h3 className=" font-semibold">{booking.service?.name}</h3>

                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-6 h-6 rounded-full bg-gray-100">
                                                <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
                                            </Avatar>
                                            <p className="text-sm">{session.user.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid border-zinc-400">
                                        <p className="text-sm text-[var(--text-on-primary)] font-semibold">
                                            {(() => {
                                                const month = booking.date.toLocaleDateString("pt-BR", { month: "long" });
                                                return month.charAt(0).toUpperCase() + month.slice(1);
                                            })()}
                                        </p>

                                        <p className="text-xl text-[var(--text-on-primary)] font-bold">{booking.date.toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                        })}</p>

                                        <p className="text-sm text-[var(--text-on-primary)]">{new Date(booking.date).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}</p>
                                        <div className="mt-2 pl-1 self-end">
                                            {(booking.status === "PENDING") && (
                                                <CancelButton bookingId={booking.id} />
                                            )}
                                        </div>


                                    </div>


                                </CardContent>


                            </Card>
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
                                        className="mt-6 p-3 opacity-65 bg-[var(--primary)] shadow-[0_5px_7px_rgba(0,0,0,.55)]"
                                    >
                                        <CardContent className="flex justify-between p-0">

                                            <div className="flex flex-col gap-2 p-5 pl-5">
                                                <Badge className={` text-sm font-semibold w-fit ${StatusColor(booking.status)} `}>{translateStatus(booking.status)}</Badge>
                                                <h3 className=" font-semibold">{booking.service?.name}</h3>

                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-6 h-6 rounded-full bg-gray-100">
                                                        <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
                                                    </Avatar>
                                                    <p className="text-sm">{session.user.name}</p>
                                                </div>
                                            </div>



                                            <div className="flex flex-col items-center justify-center px-7 border-l-2 border-solid border-zinc-400">
                                                <p className="text-sm text-[var(--text-on-primary)] font-semibold">
                                                    {(() => {
                                                        const month = booking.date.toLocaleDateString("pt-BR", { month: "long" });
                                                        return month.charAt(0).toUpperCase() + month.slice(1);
                                                    })()}
                                                </p>

                                                <p className="text-xl text-[var(--text-on-primary)] font-bold">{booking.date.toLocaleDateString("pt-BR", {
                                                    day: "2-digit",
                                                })}</p>

                                                <p className="text-sm text-[var(--text-on-primary)]">{new Date(booking.date).toLocaleTimeString("pt-BR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}</p>

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