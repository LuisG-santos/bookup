"use client"
import { createBooking } from "@/app/_actions/createBooking"
import { Calendar } from "@/app/_components/ui/calendar"
import { ca, ptBR } from "date-fns/locale"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { format, set, setHours, setMinutes } from "date-fns"
import { toast } from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { CheckCircle2Icon } from "lucide-react"

type BookingCalendarProps = {
    service: {
        id: string;
        name: string;
        price: string;
        commerceId: string;
    };
}

export function BookingCalendar({ service }: BookingCalendarProps) {
    const { data: session, status } = useSession();
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
    const [showAlert, setShowAlert] = useState(false);
    
    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date);
    }
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    }


    const handleCreateBooking = async () => {
        
        if (!selectedDay || !selectedTime) {
            console.log("Data ou hora não selecionada", { selectedDay, selectedTime });
            return;

        }
        console.log("sessao do user",session);
        const userId = session?.user?.id;
        if (!userId) {
            console.log("Sem userId na sessão");
            toast.error("Você precisa estar logado para criar um agendamento.");
            return;
        }



        try {
            const [hourStr, minuteStr] = selectedTime.split(":");
            const hour = Number(hourStr);
            const minute = Number(minuteStr);

            const newDate = set(selectedDay, {
                hours: hour,
                minutes: minute,
            });

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serviceId: service.id,
                    userId: session?.user?.id, // depois vamos buscar isso da sessão
                    commerceId: service.commerceId,
                    status: "pending",
                    date: newDate.toISOString(),
                }),
            });

            let body: any = null;
            try {
                body = await res.json();
            } catch  {
                body = null;
            }
            console.log("body recebido", body)
            if (!res.ok) {
                console.error("Erro API /api/bookings", {
                    status: res.status,
                    body: body,
                });
                toast.error(body?.error ?? "Erro ao criar agendamento.");
                return;
            }

            toast.success("Agendamento criado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar agendamento. Tente novamente.");
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);

    };
    const timeslots = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
    ];
    return (
        <div className="flex flex-col justify-center items-center py-6 space-y-5 ">
            <Calendar
                className="w-full max-w-full justify-center rounded-3xl p-4 text-white shadow-xl  bg-[var(--primary)] text-[var(--text-on-background)] "
                mode="single"
                locale={ptBR}
                selected={selectedDay}
                onSelect={handleDateSelect}
            />
            {selectedDay && (
                <div className="pt-8 p-4 bg-[var(--primary)] rounded-3xl ">
                    <h2 className="font-semibold text-lg pb-2 border-b-2 border-zinc-800">Selecione o horário</h2>
                    <div className="grid grid-cols-4 gap-3">
                        {timeslots.map((timeslot) => (
                            <Button
                                key={timeslot}

                                onClick={() => handleTimeSelect(timeslot)}
                                className={`m-1 h-12  transition-all active:scale-95 text-lg font-sans ${selectedTime === timeslot ? "bg-zinc-800 text-[var(--text-on-primary)] border-4 border-[var(--secondary)]" : ""}`}>
                                {timeslot}
                            </Button>
                        ))}
                    </div>

                </div>)}
            <div className="flex justify-center p-4 w-full border-t border-zinc-700">
                <Card className=" bg-[var(--primary)] w-full">
                    <CardHeader className=" border-b border-zinc-700 justify-center">
                        <CardTitle className="pb-2 font-bold text-lg">Seu agendamento</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-1">

                        <div className="flex items-center justify-between">

                            <h2 className="text-gray-400 text-lg">Serviço:</h2>
                            <p className="text-sm ">{service?.name}</p>

                        </div>

                        <div className="flex items-center justify-between ">
                            <h2 className="text-gray-400 text-lg">Dia:</h2>
                            <p className="text-sm ">{selectedDay ? format(selectedDay, "d 'de' MMMM", { locale: ptBR }) : ""}</p>
                        </div>

                        <div className="flex items-center justify-between ">
                            <h2 className="text-gray-400 text-lg">Hora:</h2>
                            <p className="text-sm ">{selectedTime}</p>
                        </div >

                        <div className="flex items-center  justify-between">
                            <h2 className="text-gray-400 text-lg">Valor:</h2>
                            <p className="text-sm ">{Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(Number(service.price))}</p>
                        </div>

                        <div className=" pt-3 border-t border-zinc-700 flex justify-center">
                            <Button variant="outline" type="button" onClick={handleCreateBooking} disabled={!selectedDay || !selectedTime || !service} className="bg-[var(--primary)] h-12 w-full hover:bg-zinc-800 font-bold">Confirmar Agendamento</Button>
                        </div>
                        {showAlert && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                <Alert className="max-w-md w-full">
                                    <CheckCircle2Icon />
                                    <AlertTitle>Sucesso! Agendamento criado</AlertTitle>
                                    <AlertDescription>
                                        Aguarde a confirmação do estabelecimento.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                    </CardContent>

                </Card>

            </div>
        </div>
    )

}