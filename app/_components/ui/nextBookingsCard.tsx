import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Button } from "./button";
import {NotebookPenIcon, X, XIcon } from "lucide-react";
import { CancelButton } from "./CancelButton";
import { FinalizeButton } from "./FinalizeButton";

type NextBooking = {
    id: string;
    date: Date;
    user: { name: string | null };
    service: { name: string; duration: number };
};

type NextBookingsCardProps = {
    nextBooking: NextBooking | null;
};


const NextBookingCard = ({ nextBooking }: NextBookingsCardProps) => {
    return (
        <Card className="m-4 p-4 bg-[var(--primary)] shadow-[0_20px_30px_rgba(0,0,0,.55)]">
            <CardHeader className="flex border-b border-solid border-zinc-700">
                <NotebookPenIcon />
                <CardTitle className="text-[var(--text-on-primary)] text-lg font-semibold mb-4">Próximo Agendamento</CardTitle>
            </CardHeader>
            
            <CardContent>
            {nextBooking ? (
                <div className="p-0">

                    <p className="text-[var(--text-on-primary)] text-lg font-semibold">{nextBooking.user.name}</p>


                    <div className="flex justify-between mt-2 pt-2">
                        <p className="text-[var(--text-on-primary)] text-sm">{nextBooking.service.name} • {nextBooking.service.duration} min</p>

                        <p className="text-[var(--text-on-primary)] text-sm">Hoje às {new Date(nextBooking.date).toLocaleTimeString("pt-BR",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        )}</p>
                    </div>


                    <div className="flex justify-between items-center border-t space-x-5 border-zinc-700 p-3 mt-5">
                        <FinalizeButton bookingId={nextBooking.id} />

                        <CancelButton bookingId={nextBooking.id} className="w-32" />
                    </div>

                </div>
            ) : (
                <p className="mt-3 text-[var(--text-on-primary)]">Nenhum agendamento para hoje.</p>
            )}
            </CardContent>
        </Card>
    );
}

export default NextBookingCard;