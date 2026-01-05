// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { BookingStatus, Prisma } from "@prisma/client";
import { addMinutes} from "date-fns";
import { revalidatePath } from "next/cache";
import {toZonedTime ,fromZonedTime } from "date-fns-tz";

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, serviceId, commerceId, date } = body ?? {};
    const TZ = "America/Sao_Paulo";

    if (!userId || !serviceId || !commerceId || !date) {
      return NextResponse.json({ error: "Dados obrigatórios ausentes." }, { status: 400 });
    }

    const rawDate = new Date(date);
    if (Number.isNaN(rawDate.getTime())) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 });
    }

    // Busca duração do serviço
    const service = await db.services.findUnique({
      where: { id: serviceId },
      select: { duration: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
    }

    // Normaliza + calcula endDate
    const start = new Date(rawDate);
    start.setSeconds(0, 0);
    const end = addMinutes(start, service.duration);

    if (start < new Date()) {
      return NextResponse.json(
        { error: "A data do agendamento não pode ser no passado." },
        { status: 400 }
      );
    }

    const commerce = await db.commerce.findUnique({
      where: { id: commerceId },
      select: {
        openingTimeMinutes: true,
        closingTimeMinutes: true,
        subdomain: true,
      },
    });

    if (!commerce) {
      return NextResponse.json(
        { error: "Commerce não encontrado." },
        { status: 404 }
      );
    }

    const startZoned = toZonedTime(start, TZ);
    const endZoned = toZonedTime(end, TZ);

    const startMin = startZoned.getHours() * 60 + startZoned.getMinutes();
    const endMin = endZoned.getHours() * 60 + endZoned.getMinutes();

    if (
      startMin < commerce.openingTimeMinutes ||
      endMin > commerce.closingTimeMinutes
    ) {
      return NextResponse.json(
        { error: "Fora do horário de funcionamento." },
        { status: 400 }
      );
    }

    const y = startZoned.getFullYear();
    const m = String(startZoned.getMonth() + 1).padStart(2, "0");
    const d = String(startZoned.getDate()).padStart(2, "0");
    const dayKey = `${y}-${m}-${d}`;

    const dayStart = fromZonedTime(`${dayKey}T00:00:00`, TZ);
    const dayEnd = fromZonedTime(`${dayKey}T23:59:59.999`, TZ);

    // Regra: mesmo usuário não pode agendar o mesmo serviço no mesmo dia
    const existingSameService = await db.booking.findFirst({
      where: {
        userId,
        serviceId,
        commerceId,
        date: { gte: dayStart, lte: dayEnd },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
      select: { id: true },
    });

    if (existingSameService) {
      return NextResponse.json(
        { error: "Você já possui este serviço agendado neste dia." },
        { status: 400 }
      );
    }

    // (UX) Checagem de conflito por overlap no app
    // ATENÇÃO: isso NÃO garante exclusividade (race condition). Quem garante é a constraint no banco.
    const dayBookings = await db.booking.findMany({
      where: {
        commerceId,
        date: { gte: dayStart, lte: dayEnd },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
      select: { date: true, endDate: true },
      orderBy: { date: "asc" },
    });

    const hasConflict = dayBookings.some((b) => {
      if (!b.endDate) return false; // segurança
      return overlaps(start, end, b.date, b.endDate);
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: "Este horário já está ocupado neste estabelecimento." },
        { status: 409 }
      );
    }

    // CREATE: aqui o banco deve impedir corrida via EXCLUDE constraint (recomendado)
    const booking = await db.booking.create({
      data: {
        userId,
        serviceId,
        commerceId,
        date: start,
        endDate: end,
        status: BookingStatus.PENDING,
      },
    });

    revalidatePath(`/${commerce?.subdomain}`);

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    // 1) EXCLUDE constraint do Postgres (overlap) -> SQLSTATE 23P01
    const pgCode = error?.code || error?.cause?.code;
    if (pgCode === "23P01") {
      return NextResponse.json(
        { error: "Este horário já está ocupado neste estabelecimento." },
        { status: 409 }
      );
    }

    // 2) Unique constraint (se existir) -> Prisma P2002
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Este horário já está ocupado neste estabelecimento." },
          { status: 409 }
        );
      }
    }

    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento." }, { status: 500 });
  }
}