import { db } from "@/app/_lib/prisma";
import { BookingStatus } from "@prisma/client";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

type GetAvailableSlotsParams = {
  commerceId: string;
  serviceId: string;
  date: Date;
  baseStepMinutes?: number;     // varredura interna (ex.: 5)
  displayStepMinutes?: number;
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
  baseStepMinutes = 5,
  displayStepMinutes,
}: GetAvailableSlotsParams): Promise<Slot[]> {

  const TZ = "America/Sao_Paulo";

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
  const nowZoned = toZonedTime(new Date(), TZ);
  const dateZoned = toZonedTime(date, TZ);

  const isSameDayInTz =
    nowZoned.getFullYear() === dateZoned.getFullYear() &&
    nowZoned.getMonth() === dateZoned.getMonth() &&
    nowZoned.getDate() === dateZoned.getDate();

  if (isSameDayInTz) {
    const nowMinutes = nowZoned.getHours() * 60 + nowZoned.getMinutes();
    const roundedNow = Math.ceil(nowMinutes / baseStepMinutes) * baseStepMinutes;
    minStart = Math.max(opening, roundedNow);
  }


  const y = dateZoned.getFullYear();
  const m = String(dateZoned.getMonth() + 1).padStart(2, "0");
  const d = String(dateZoned.getDate()).padStart(2, "0");
  const dayKey = `${y}-${m}-${d}`;

  // Range do dia no TZ convertido para UTC (pra query no Postgres)
  const dayStart = fromZonedTime(`${dayKey}T00:00:00`, TZ);
  const dayEnd = fromZonedTime(`${dayKey}T23:59:59.999`, TZ);
  // 2) buscar TODOS os bookings do DIA para ESTE COMÉRCIO
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
    select: {
      date: true,
      endDate: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const dateToMinutesInTz = (d: Date, tz: string = TZ) => {
    const zoned = toZonedTime(d, tz);
    return zoned.getHours() * 60 + zoned.getMinutes();
  }

  const formatMinutes = (total: number) => {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // 3) montar intervalos ocupados (busy)
  type Interval = { start: number; end: number };

  const busy: Interval[] = bookings.map((b) => {
    const start = dateToMinutesInTz(b.date, TZ);
    const end = dateToMinutesInTz(b.endDate, TZ);
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

  const displayStep = displayStepMinutes ??
    (serviceDuration <= 15 ? serviceDuration : 15);

  let current = minStart;

  while (current + serviceDuration <= closing) {
    const start = current;
    const end = current + serviceDuration;

    if (!overlaps(start, end)) {
      // FILTRO DE EXIBIÇÃO (não cria slot fixo)
      if (start % displayStep === 0) {
        slots.push({
          startMinutes: start,
          endMinutes: end,
          startTimeLabel: formatMinutes(start),
          endTimeLabel: formatMinutes(end),
        });
      }
    }

    // AVANÇA SEMPRE PELO BASE STEP
    current += baseStepMinutes;
  }
  return slots;
}