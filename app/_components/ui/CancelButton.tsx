"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { cn } from "@/app/_lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";


type Props = {
    bookingId: string;
    className?: string;
}
export function CancelButton({ bookingId, className }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const handleCancel = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/bookings/cancel/${bookingId}`, {
                method: "PUT",
            });

            const data = await res.json().catch(() => null);
            console.log("cancel response:", res.status, data);

            if (!res.ok) {
                toast.error(data?.error ?? "Erro ao cancelar agendamento.");
                return;
            }

            toast.success("Agendamento cancelado com sucesso!");
            setOpen(false);
            router.refresh();
        } catch (e) {
            console.error(e);
            toast.error("Erro ao cancelar agendamento.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
          className={cn(
            "w-28 px-2 py-2 text-xs rounded-xl sm:px-4 sm:py-3 sm:text-base bg-red-900 hover:bg-red-800",
            className
          )}
        >
                        Cancelar
                    </Button>
                </DialogTrigger>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-white">Cancelar agendamento</DialogTitle>
                    <DialogDescription className="text-white">
                        Tem certeza que deseja cancelar este agendamento? Essa ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="text-white w-20"
                    >
                        Voltar
                    </Button>

                    <Button
                        size="sm"
                        className="w-28 px-2 py-2 text-xs text-white sm:px-4 sm:py-3 sm:text-base bg-red-900 hover:bg-red-800"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {isLoading ? "Cancelando..." : "Cancelar"}
                    </Button>
                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

