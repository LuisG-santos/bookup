import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/app/_lib/prisma";
import { MenuIcon, Sidebar } from "lucide-react";
import SidebarOwner from "@/app/_components/sidebar-owner";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { Button } from "@/app/_components/ui/button";
import HeaderOwner from "@/app/_components/ui/headerOwner";
import { Card } from "@/app/_components/ui/card";

type OwnerPageProps = {
    params: Promise<{ subdomain: string }>;

};

export default async function OwnerPage({ params }: OwnerPageProps) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { subdomain } = await params;
    const userName = session?.user?.name ?? "Owner";

    const commerce = await db.commerce.findUnique({
        where: { subdomain },
        select: {
            id: true,
            imageURL: true,
        },
    });

    if (!commerce) {
        throw new Error("Comércio não encontrado");
    }

    const membership = await db.commerceMembership.findFirst({
        where: {
            userId,
            commerceId: commerce.id,
            role: "OWNER",
        },
    });

    if (!membership || membership.role !== "OWNER") {
        throw new Error("Usuário não autorizado");
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





    const nextBooking = bookings.filter(booking => booking.status !== "CONFIRMED" && booking.date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime())[0];


    return (
        <div className="relative min-h-screen w-full flex flex-col bg-[var(--background)] text-[var(--text-on-background)]">
            <HeaderOwner subdomain={subdomain} commerceName={commerce.imageURL} />

            <div className="flex flex-col p-5">
                <h1 className="text-2xl font-bold">Olá, {userName}</h1>
                <p className="text-sm">{formattedDate}</p>

            </div>

            <div>
                <Card className="m-5 p-5 bg-[var(--primary)] shadow-[0_20px_30px_rgba(0,0,0,.55)]">
                    <h2 className="text-lg font-bold text-[var(--text-on-primary)]">Próximo agendamento</h2>
                    {nextBooking ? (
                        <div className="">
                            <p className="text-[var(--text-on-primary)] text-lg font-semibold">{nextBooking.user.name}</p>
                            <div className="flex justify-between pt-1">
                                <p className="text-[var(--text-on-primary)] text-sm">{nextBooking.service.name}</p>
                                <p className="text-[var(--text-on-primary)] text-sm">{new Date(nextBooking.date).toLocaleTimeString("pt-BR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}</p>
                            </div>

                            <div className="flex justify-between mt-5">
                                <Button variant="secondary" className="rounded-xl ml-5 w-32 bg-green-500 text-white hover:bg-green-600">
                                    Concluir
                                </Button>

                                <Button variant="secondary" className="rounded-xl mr-5 w-32 bg-red-600 text-white hover:bg-red-700">
                                    Cancelar
                                </Button>
                            </div>

                        </div>
                    ) : (
                        <p className="mt-3 text-[var(--text-on-primary)]">Nenhum agendamento futuro encontrado.</p>
                    )}
                </Card>
            </div>
        </div>
    );
}

