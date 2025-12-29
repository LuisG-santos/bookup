"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import { toast } from "react-hot-toast";


type Props = {
    bookingId: string;
}
export function FinalizeButton({ bookingId }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleFinalize = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/bookings/finalize/${bookingId}`, {
                method: "PUT",
            });

            const data = await res.json().catch(() => null);
            console.log("cancel response:", res.status, data);

            if (!res.ok) {
                toast.error(data?.error ?? "Erro ao finalizar agendamento.");
                return;
            }

            toast.success("Agendamento finalizado com sucesso!");
            router.refresh();
        } catch (e) {
            console.error(e);
            toast.error("Erro ao finalizar agendamento.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
       
                    <div className="w-28">
                    <Button
                    
                        className="w-full px-2 py-2 text-xs rounded-xl sm:px-4 sm:py-3 sm:text-base bg-green-500 hover:bg-green-600"
                        onClick={handleFinalize}
                        disabled={isLoading}
                    >
                        {isLoading ? "Finalizando..." : "Finalizar"}
                    </Button>
                    </div>

    );
}

