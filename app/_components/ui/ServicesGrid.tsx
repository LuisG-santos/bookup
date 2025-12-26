"use client"

import { Card, CardContent } from "./card";
import Image from "next/image";
import { Button } from "./button";
import { Badge } from "./badge";
import { FlameIcon } from "lucide-react";
import { useSession } from "next-auth/react"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface ServicesGridProps {
    services: {
        id: string;
        name: string;
        description: string;
        imageURL: string;
        commerceId: string;
        price: number;
        duration: number;
    };
    basePath: string;
}
const ServicesGrid = ({ services, basePath }: ServicesGridProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const rawDuration = services.duration as number | null | undefined;
    const durationInMinutes =
        typeof rawDuration === "number" ? rawDuration : Number(rawDuration ?? NaN);
    const handleVerifyUser = () => {

        if (!session?.user?.id) {
            toast.error("Você precisa estar logado para agendar um serviço.");
            router.push(`${basePath}/login`);
            return;
        }
        router.push(`${basePath}/schedule/${services.id}`);
    }
    return (

        <Card className="min-w-[170px] p-0 rounded-2xl h-full bg-[var(--primary)] shadow-[0_3px_8px_rgba(0,0,0,.55)]">
            <CardContent className="flex h-full flex- p-0 px-2 pt-2 pb-1 gap-3">
                <div className="relative h-[150px] w-[150px] min-h-[150px] min-w-[150px] max-h-[150px] max-w-[150px]">
                    <Image fill className="object-cover rounded-2xl" src={services.imageURL} alt={services.name} />
                    <Badge className="absolute left-2 top-2 space-x-1 bg-orange-600" variant="secondary">
                        <FlameIcon className="h-4 w-4" />
                        <p>Popular</p>
                    </Badge>
                </div>

                <div className="flex flex-1 flex-col py-3">
                    <h3 className="font-semibold text-[var(--text-on-primary)]">{services.name}</h3>
                    <p className="text-sm text-[var(--text-on-primary)] line-clamp-3">{services.description}</p>
                    <div className=" mt-auto space-y-3 pt-3">
                        <div className="flex gap-2">
                            <p className="text-sm font-medium text-[var(--text-on-primary)] mb-2">
                            {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(services.price)}
                        </p>
                        <p className="text-sm text-[var(--text-on-primary)]">•</p>
                        <p className="text-sm text-[var(--text-on-primary)]">{String(services.duration)} minutos</p>
                        </div>
                        
                        <Button
                            size="sm"
                            onClick={handleVerifyUser}
                            className="w-full px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-base bg-[var(--secondary)] hover:bg-zinc-700"
                        >
                            Agendar
                        </Button>
                    </div>
                </div>


            </CardContent>
        </Card>





    );

}
export default ServicesGrid;
