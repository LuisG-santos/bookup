import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/app/_lib/prisma";
import HeaderOwner from "@/app/_components/ui/headerOwner";
import { addDays } from "date-fns";
import { notFound } from "next/navigation";
import { endOfDay, startOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import NextBookingCard from "@/app/_components/ui/nextBookingsCard";
import { CheckLineIcon, ChevronRightIcon, ClipboardCheckIcon, ClockIcon } from "lucide-react";
import FooterPage from "@/app/_components/ui/Footer";
import Link from "next/link";


type OwnerPageProps = {
    params: Promise<{ subdomain: string }>;

};

export default async function OwnerPage({ params }: OwnerPageProps) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { subdomain } = await params;
    const userName = session?.user?.name ?? "Owner";
    const tz = "America/Sao_Paulo";

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

    if (!userId) {
        throw new Error("Usuário não autenticado");
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

    const today = new Date();

    const formattedDate = today.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const bookings = await db.booking.findMany({
        where: { commerceId: commerce.id },
        include: {
            service: {
                select: {
                    name: true,
                    duration: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: { date: "asc" },
    });



    const now = new Date();
    const nowInTz = toZonedTime(now, tz);
    const startLocal = startOfDay(nowInTz);
    const endLocal = endOfDay(nowInTz);

    const dayStartUtc = fromZonedTime(startLocal, tz);
    const dayEndUtc = fromZonedTime(endLocal, tz);



    const todayBookingsConfirmed = await db.booking.findMany({
        where: {
            commerceId: commerce.id,
            status: "CONFIRMED",
            date: {
                gte: dayStartUtc,
                lte: dayEndUtc,
            },
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

    const next7DaysStartUtc = dayStartUtc; // hoje 00:00 no fuso
    const next7DaysEndLocal = addDays(endLocal, 7);
    const next7DaysEndUtc = fromZonedTime(next7DaysEndLocal, tz);

    const next7DaysBookings = await db.booking.findMany({
        where: {
            commerceId: commerce.id,
            status: { in: ["CONFIRMED", "PENDING"] },
            date: {
                gte: next7DaysStartUtc,
                lte: next7DaysEndUtc,
            },
        },
    });

    const confirmedBookings = bookings.filter(booking => booking.status === "CONFIRMED");

    const pendingBookings = bookings.filter(booking => booking.status === "PENDING");

    const confirmedToday = todayBookingsConfirmed.filter(booking => booking.status === "CONFIRMED");
    const upcoming = confirmedToday.find(booking => booking.date >= now);
    const overdue = [...confirmedToday].reverse().find(booking => booking.date < now);
    const nextBooking = upcoming ?? overdue ?? null;

    return (
        <div className="relative min-h-screen w-full flex flex-col bg-[var(--background)] text-[var(--text-on-background)]">

            <HeaderOwner subdomain={subdomain} />

            <div className="flex flex-col p-5">
                <h1 className="text-2xl font-bold">Olá, {userName}</h1>
                <p className="text-sm">{formattedDate}</p>

            </div>

            <div>
                <h2 className="pl-5 pt-5 text-xs font-bold uppercase text-gray-400">Agendamentos de hoje</h2>
                <NextBookingCard nextBooking={nextBooking ?? null} />
            </div>

            <h2 className="pl-5 pt-5 text-xs font-bold uppercase text-gray-400">Agendamentos</h2>

            <div className="grid grid-cols-2 gap-5 p-5 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-2">

                <div className="">

                    <button
                        className="
                                group
                                w-full
                                rounded-lg
                                border border-zinc-800
                                 bg-[var(--primary)]
                                p-5
                                text-left
                                transition
                                 hover:bg-zinc-900
                                 hover:border-zinc-800
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[var(--primary)]
                                "
                    >
                        <Link href={`/${subdomain}/OwnerPages/bookingPending`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-white">
                                        {pendingBookings.length}
                                    </p>
                                    <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                                        <ClockIcon className="h-4 w-4" />
                                        Pendentes
                                    </p>
                                </div>

                                <ChevronRightIcon
                                    className="
                                        h-5 w-5
                                        text-zinc-500
                                        transition
                                        group-hover:translate-x-1
                                        group-hover:text-zinc-300
                                    "
                                />
                            </div>
                        </Link>
                    </button>
                </div>

                <div className="">
                    <button
                        className="
                                group
                                w-full
                                rounded-lg
                                border border-zinc-800
                                 bg-[var(--primary)]
                                p-5
                                text-left
                                transition
                                 hover:bg-zinc-900
                                 hover:border-zinc-800
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[var(--primary)]
                                "
                    >
                        <Link href={`/${subdomain}/OwnerPages/bookingsToday`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-white">
                                        {todayBookingsConfirmed.length}
                                    </p>
                                    <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                                        <ClipboardCheckIcon className="h-4 w-4" />
                                        Hoje
                                    </p>
                                </div>

                                <ChevronRightIcon
                                    className="
                                        h-5 w-5
                                        text-zinc-500
                                        transition
                                        group-hover:translate-x-1
                                        group-hover:text-zinc-300
                                    "
                                />
                            </div>
                        </Link>
                    </button>

                </div>

                <div className="">
                    <button
                        className="
                                group
                                w-full
                                rounded-lg
                                border border-zinc-800
                                 bg-[var(--primary)]
                                p-5
                                text-left
                                transition
                                 hover:bg-zinc-900
                                 hover:border-zinc-800
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[var(--primary)]
                                "
                    >
                        <Link href={`/${subdomain}/OwnerPages/bookingsConfirm`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-white">
                                        {confirmedBookings.length}
                                    </p>
                                    <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                                        <CheckLineIcon className="h-4 w-4" />
                                        Confirmados
                                    </p>
                                </div>

                                <ChevronRightIcon
                                    className="
                                        h-5 w-5
                                        text-zinc-500
                                        transition
                                        group-hover:translate-x-1
                                        group-hover:text-zinc-300
                                    "
                                />
                            </div>
                        </Link>
                    </button>

                </div>

                <div className="">
                    <div
                        className="
                                group
                                w-full
                                rounded-lg
                                border border-zinc-800
                                 bg-[var(--primary)]
                                p-5
                                text-left
                                transition
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[var(--primary)]
                                "
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">
                                    {next7DaysBookings.length}
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                                    <ClockIcon className="h-4 w-4" />
                                    Próximos 7 dias
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="mt-auto">
                <FooterPage commerceId={commerce.id} />
            </div>
        </div>
    );
}

