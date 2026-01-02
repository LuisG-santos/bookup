"use client"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { format, set } from "date-fns"
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { getBookings } from "@/app/_actions/getBookings";
import { MuiCalendar } from "./calendarMUI"

type BookingCalendarProps = {
    service: {
        id: string;
        name: string;
        price: string;
        commerceId: string;
        duration: number;
    };
}

export function BookingCalendar({ service, }: BookingCalendarProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams<{ subdomain: string }>();
    const basePath = `/${params.subdomain}`;

    type Slot = {
        startMinutes: number;
        endMinutes: number;
        startTimeLabel: string;
        endTimeLabel: string;
    };

    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
    const [dayBookings, setDayBookings] = useState<any[]>([]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loadingDay, setLoadingDay] = useState(false);


    useEffect(() => {
        handleDateSelect(new Date());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDateSelect = async (date: Date) => {
        setSelectedDay(date);
        setSlots([]);
        setDayBookings([]);
        setSelectedTime(undefined);

        try {
            setLoadingDay(true);

            const dateParam = date.toISOString();

            console.log("local", new Date().toString());
            console.log("Iso", new Date().toISOString());

            const [bookings, availabilityRes] = await Promise.all([
                getBookings({ date, serviceId: service.id }),
                fetch(
                    `/api/availability?date=${dateParam}&serviceId=${service.id}&commerceId=${service.commerceId}`
                ),
            ]);

            setDayBookings(bookings);

            if (!availabilityRes.ok) {
                const errorText = await availabilityRes.text();
                console.error(
                    "Erro na API /api/availability:",
                    availabilityRes.status,
                    errorText
                );
                throw new Error("Erro ao carregar horários");
            }

            const data = await availabilityRes.json();
            setSlots(data.slots ?? []);
        } catch (error) {
            console.error("Erro ao buscar slots:", error);
            setSlots([]);
            toast.error("Erro ao carregar horários desse dia.");
        } finally {
            setLoadingDay(false);
        }
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleCreateBooking = async () => {
        if (!selectedDay || !selectedTime) {
            return;
        }

        const userId = session?.user?.id;
        if (!userId) {
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
                    userId: userId,
                    commerceId: service.commerceId,
                    date: newDate.toISOString(),
                }),
            });

            let body: any = null;
            try {
                body = await res.json();
            } catch {
                body = null;
            }

            if (!res.ok) {
                console.error("Erro API /api/bookings", {
                    status: res.status,
                    body: body,
                });

                const message = body?.error ?? "Erro ao criar agendamento.";
                toast.error(message);

                // se o back disser que o horário foi ocupado, recarrega os slots do dia
                if (message.includes("horário já está ocupado") && selectedDay) {
                    await handleDateSelect(selectedDay);
                }

                return;
            }

            if (!selectedTime) return;
            //
            setSlots((prevSlots) =>
                prevSlots.filter((slot) => slot.startTimeLabel !== selectedTime)
            );
            setSelectedTime(undefined);

            toast.success("Agendamento criado com sucesso!");

            setSlots((prev) =>
                prev.filter((slot: any) => slot.startTimeLabel !== selectedTime)
            );
            setSelectedTime(undefined);

            router.push(basePath);
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar agendamento. Tente novamente.");
        }
    };


    return (
        <div className="flex flex-col justify-center min-h-screen items-center py-6 space-y-5 bg-background text-[var(--text-on-background)]">
            
            <div className="bg-primary rounded-3xl w-full">
                <MuiCalendar value={selectedDay} onSelect={handleDateSelect} minDate={new Date()} />
            </div>
            
            {selectedDay && (
                <div className="pt-8 p-4 bg-primary rounded-3xl w-full">
                    <h2 className="font-semibold text-lg text-[var(--text-on-background)] pb-2 border-b border-[var(--text-on-primary)]">
                        Selecione o horário
                    </h2>

                    {loadingDay && (
                        <p className="text-sm text-gray-300 mt-3">Carregando horários…</p>
                    )}

                    {!loadingDay && slots.length === 0 && (
                        <p className="text-sm text-gray-400 mt-3">
                            Nenhum horário disponível para este dia.
                        </p>
                    )}

                    <div className="grid grid-cols-4 gap-3 mt-3">
                        {slots.map((slot) => (
                            <Button
                                key={slot.startMinutes}
                                onClick={() => handleTimeSelect(slot.startTimeLabel)}
                                className={`m-1 h-12 transition-all active:scale-95 text-lg hover:bg-zinc-400 font-sans ${selectedTime === slot.startTimeLabel
                                    ? "bg-zinc-400 text-[var(--text-on-background)] border-2 border-[var(--text-on-background)]"
                                    : ""
                                    }`}
                            >
                                {slot.startTimeLabel}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-center p-4 w-full mt-4">
                <Card className=" bg-primary w-full border-2 border-secondary rounded-3xl shadow-xl">
                    <CardHeader className=" border-b border-[var(--text-on-primary)] justify-center">
                        <CardTitle className="pb-2 font-bold text-lg text-[var(--text-on-primary)]">
                            Seu agendamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-gray-400 text-lg">Serviço:</h2>
                            <p className="text-sm text-[var(--text-on-primary)]">{service?.name}</p>
                        </div>

                        <div className="flex items-center justify-between ">
                            <h2 className="text-gray-400 text-lg">Dia:</h2>
                            <p className="text-sm text-[var(--text-on-primary)]">
                                {selectedDay
                                    ? format(selectedDay, "d 'de' MMMM", { locale: ptBR })
                                    : ""}
                            </p>
                        </div>

                        <div className="flex items-center justify-between ">
                            <h2 className="text-gray-400 text-lg">Hora:</h2>
                            <p className="text-sm text-[var(--text-on-background)]">{selectedTime}</p>
                        </div>

                        <div className="flex items-center  justify-between">
                            <h2 className="text-gray-400 text-lg">Valor:</h2>
                            <p className="text-sm text-[var(--text-on-background)]">
                                {Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(Number(service.price))}
                            </p>
                        </div>

                        <div className=" pt-3 border-t border-[var(--text-on-primary)] flex justify-center">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleCreateBooking}
                                disabled={!selectedDay || !selectedTime || !service}
                                className="bg-secondary h-12 w-full hover:bg-zinc-800 font-bold"
                            >
                                Confirmar Agendamento
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


