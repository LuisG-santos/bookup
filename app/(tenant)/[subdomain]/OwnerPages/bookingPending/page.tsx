import SidebarOwner from "@/app/_components/sidebar-owner";
import { Button } from "@/app/_components/ui/button";
import { CancelButton } from "@/app/_components/ui/CancelButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import FooterPage from "@/app/_components/ui/Footer";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CalendarClockIcon, ChevronLeftIcon, MenuIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation"
import { ConfirmButton } from "@/app/_components/ui/ConfirmButton";
import { Badge } from "@/app/_components/ui/badge";

type BookingPendingsProps = {
    params: Promise<{ subdomain: string }>;
};

export default async function BookingPendings({ params }: BookingPendingsProps) {

    const { subdomain } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const basePath = `/${subdomain}/OwnerPages`;

    const commerce = await db.commerce.findUnique({
        where: { subdomain },
        select: {
            id: true,
            imageURL: true,
            name: true,
            heroImageURL: true,
        },
    });

    if (!commerce) {
        notFound()
    }

    const membership = await db.commerceMembership.findFirst({
        where: {
            userId,
            commerceId: commerce.id,
            role: "OWNER",
        },
    });

    if (!membership) {
        notFound()
    }

    if (!userId) {
        notFound();
    }

    const pendingBookings = await db.booking.findMany({
        where: {
            commerceId: commerce.id,
            status: "PENDING",
        },
        include: {
            service: {
                select: {
                    name: true,
                    duration: true,
                },
            },
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { date: "asc" },
    });

    return (
        <div className="relative min-h-screen w-full flex flex-col bg-[var(--background)] text-[var(--text-on-background)]">
            <div className="fixed w-full bg-[var(--primary)] shadow-[0_20px_10px_rgba(0,0,0,.55)] h-14 flex items-center">
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

                <h2 className="fixed top-5 left-1/2 -translate-x-1/2 text-xl font-semibold">
                    Pendentes
                </h2>

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
                    <SidebarOwner />
                </Sheet>
            </div>

            <div className="grid mt-14 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-20">

                {pendingBookings.length > 0 ? (
                    pendingBookings.map((booking) => (
                        <div key={booking.id} className="animate-fade-in-down">
                            <Card
                                className="m-4 p-4 bg-[var(--primary)] shadow-[0_20px_30px_rgba(0,0,0,.55)]"
                            >
                                <CardHeader className="flex border-b border-solid border-zinc-700">
                                    <CalendarClockIcon />
                                    <CardTitle className="text-[var(--text-on-primary)] text-lg font-semibold mb-4">
                                        
                                        <Badge className="ml-2 bg-yellow-600">Pendente</Badge>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>

                                    <div className="p-0">

                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-[var(--text-on-primary)] text-lg font-semibold">{booking.user.name}</p>
                                                <p className="text-[var(--text-on-primary)] text-sm pt-2">{booking.service.name} • {booking.service.duration} min</p>
                                            </div>

                                            <div className="flex flex-col">

                                                <p className="text-[var(--text-on-primary)] text-sm">
                                                    {new Date(booking.date)
                                                        .toLocaleDateString("pt-BR", { month: "long" })
                                                        .replace(/^./, (c) => c.toUpperCase())}
                                                </p>

                                                <p className="text-xl font-semibold pl-4">
                                                    {new Date(booking.date).toLocaleDateString("pt-BR",
                                                        {
                                                            day: "2-digit",
                                                        }
                                                    )}
                                                </p>

                                                <p className="text-[var(--text-on-primary)] text-sm pl-3">
                                                    {new Date(booking.date).toLocaleTimeString("pt-BR",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center border-t space-x-5 border-zinc-700 p-3 mt-5">
                                            <ConfirmButton bookingId={booking.id} />

                                            <CancelButton bookingId={booking.id} />
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center">
                        <p className="m-4 text-[var(--text-on-background)] uppercase font-semibold text-sm text-zinc-400">
                            Nenhum agendamento pendente.
                        </p>
                    </div>

                )}

            </div>

            <div className="mt-auto">
                <FooterPage commerceId={commerce.id} />
            </div>

        </div>

    );
}
