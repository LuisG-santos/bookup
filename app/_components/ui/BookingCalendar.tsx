"use client"
import { Calendar } from "@/app/_components/ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { format, set } from "date-fns"
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { getBookings } from "@/app/_actions/getBookings"


type BookingCalendarProps = {
    service: {
        id: string;
        name: string;
        price: string;
        commerceId: string;
        duration: number;
    };
}

export function BookingCalendar({ service }: BookingCalendarProps) {
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

    const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
    const [dayBookings, setDayBookings] = useState<any[]>([]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loadingDay, setLoadingDay] = useState(false);


    useEffect(() => {
        handleDateSelect(new Date());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDateSelect = async (date: Date | undefined) => {
        setSelectedDay(date);
        setSlots([]);
        setDayBookings([]);
        setSelectedTime(undefined);

        if (!date) return;

        try {
            setLoadingDay(true);

            const dateParam = date.toISOString();

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
        <div className="min-h-[100dvh] w-full flex flex-col items-center py-6 space-y-5 bg-background text-foreground">
            {/* CALENDÁRIO */}
            <div className="w-full max-w-md px-4">
                <div className="rounded-3xl border border-border bg-primary text-card-foreground overflow-hidden shadow-xl">
                    <div className="p-4 bg-primary">
                        <Calendar
                            className="w-full bg-primary"
                            mode="single"
                            locale={ptBR}
                            disabled={{ before: new Date() }}
                            selected={selectedDay}
                            onSelect={handleDateSelect}
                        />
                    </div>
                </div>
            </div>

            {/* HORÁRIOS */}
            {selectedDay && (
                <div className="w-full max-w-md px-4 ">
                    <div className="rounded-3xl bg-primary text-card-foreground shadow-xl border border-border p-4">
                        <h2 className="font-semibold text-lg pb-2 border-b border-border">
                            Selecione o horário
                        </h2>

                        {loadingDay && (
                            <p className="text-sm text-muted-foreground mt-3">Carregando horários…</p>
                        )}

                        {!loadingDay && slots.length === 0 && (
                            <p className="text-sm text-muted-foreground mt-3">
                                Nenhum horário disponível para este dia.
                            </p>
                        )}

                        <div className="grid grid-cols-4 gap-3 mt-3">
                            {slots.map((slot) => (
                                <Button
                                    variant="default"
                                    key={slot.startMinutes}
                                    onClick={() => handleTimeSelect(slot.startTimeLabel)}
                                    className={`h-12 text-base transition-all active:scale-95 ${selectedTime === slot.startTimeLabel
                                        ? " text-foreground border border-zinc-400"
                                        : " text-secondary-foreground hover:bg-muted"
                                        }`}
                                >
                                    {slot.startTimeLabel}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* RESUMO */}
            <div className="w-full max-w-md px-4">
                <Card className="bg-primary text-card-foreground border border-border rounded-3xl shadow-xl">
                    <CardHeader className="border-b border-border justify-center">
                        <CardTitle className="text-lg font-bold">Seu agendamento</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-y-2 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Serviço:</span>
                            <span>{service?.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Dia:</span>
                            <span>
                                {selectedDay ? format(selectedDay, "d 'de' MMMM", { locale: ptBR }) : ""}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Hora:</span>
                            <span>{selectedTime ?? "-"}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Valor:</span>
                            <span>
                                {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    Number(service.price)
                                )}
                            </span>
                        </div>

                        <div className="pt-3 border-t border-border">
                            <Button
                                type="button"
                                onClick={handleCreateBooking}
                                disabled={!selectedDay || !selectedTime || !service}
                                className="h-12 w-full"
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


