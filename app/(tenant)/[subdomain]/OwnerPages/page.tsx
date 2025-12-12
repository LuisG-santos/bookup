import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/app/_lib/prisma";
import { MenuIcon, Sidebar } from "lucide-react";
import SidebarOwner from "@/app/_components/sidebar-owner";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { Button } from "@/app/_components/ui/button";
import HeaderOwner from "@/app/_components/ui/headerOwner";

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



    return (
        <div className="relative min-h-screen w-full flex flex-col bg-[var(--background)] text-[var(--text-on-background)]">
            <HeaderOwner commerceId={commerce.id} />
            
            <div className="flex flex-col p-5">
                <h1 className="text-2xl font-bold">Olá, {userName}</h1>
                <p className="text-sm">{formattedDate}</p>

            </div>
        </div>
    );
}

