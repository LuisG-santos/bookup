import { db } from "@/app/_lib/prisma";
import { startOfDay, endOfDay, isSameDay } from "date-fns";
import { BookingStatus } from "@prisma/client";

type GetAvailableSlotsParams = {
  commerceId: string;
  serviceId: string;
  date: Date;
  slotIntervalMinutes?: number;
};

export type Slot = {
  startMinutes: number;
  endMinutes: number;
  startTimeLabel: string;
  endTimeLabel: string;
};

export async function getAvailableSlots({
  commerceId,
  serviceId,
  date,
  slotIntervalMinutes = 15,
}: GetAvailableSlotsParams): Promise<Slot[]> {
  
  const [commerce, service] = await Promise.all([
    db.commerce.findUnique({
      where: { id: commerceId },
      select: {
        openingTimeMinutes: true,
        closingTimeMinutes: true,
      },
    }),
    db.services.findUnique({
      where: { id: serviceId },
      select: {
        duration: true, // minutos
      },
    }),
  ]);

  if (!commerce) {
    console.error("getAvailableSlots: commerce não encontrado", { commerceId });
    throw new Error("Commerce não encontrado");
  }

  if (!service) {
    console.error("getAvailableSlots: serviço não encontrado", { serviceId });
    throw new Error("Serviço não encontrado");
  }

  const serviceDuration = service.duration;
  const opening = commerce.openingTimeMinutes;
  const closing = commerce.closingTimeMinutes;

  let minStart = opening;

// se for hoje, não mostrar horários que já passaram
const now = new Date();
if (isSameDay(date, now)) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const roundedNow =
    Math.ceil(nowMinutes / slotIntervalMinutes) * slotIntervalMinutes;

  minStart = Math.max(opening, roundedNow);
}

  // 2) buscar TODOS os bookings do DIA para ESTE COMÉRCIO
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const bookings = await db.booking.findMany({
    where: {
      commerceId,
      date: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
    },
    include: {
      service: {
        select: {
          duration: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const dateToMinutes = (d: Date) => d.getHours() * 60 + d.getMinutes();

  const formatMinutes = (total: number) => {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // 3) montar intervalos ocupados (busy)
  type Interval = { start: number; end: number };

  const busy: Interval[] = bookings.map((b) => {
    const start = dateToMinutes(b.date);
    const duration = b.service.duration; // duração real do serviço do booking
    const end = start + duration;
    return { start, end };
  });

  busy.sort((a, b) => a.start - b.start);

  const merged: Interval[] = [];
  for (const it of busy) {
    const last = merged[merged.length - 1];
    if (!last || it.start > last.end) {
      merged.push({ ...it });
    } else {
      last.end = Math.max(last.end, it.end);
    }
  }

  const overlaps = (start: number, end: number) =>
    merged.some((b) => start < b.end && end > b.start);

  // 4) gerar slots livres
  const slots: Slot[] = [];

  let current = minStart;

  while (current + serviceDuration <= closing) {
    const start = current;
    const end = current + serviceDuration;

    if (!overlaps(start, end)) {
      slots.push({
        startMinutes: start,
        endMinutes: end,
        startTimeLabel: formatMinutes(start),
        endTimeLabel: formatMinutes(end),
      });
    }

    current += slotIntervalMinutes;
  }
  return slots;
}