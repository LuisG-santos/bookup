// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { BookingStatus } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, serviceId, commerceId, date } = body;
  
    if (!userId || !serviceId || !commerceId || !date) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);

    if (parsedDate < new Date()) {
      return NextResponse.json(
        { error: "A data do agendamento não pode ser no passado." },
        { status: 400 }
      );
    }

    const dayStart = startOfDay(parsedDate);
    const dayEnd = endOfDay(parsedDate);
    // 1) checar se o USUÁRIO já tem um booking para ESTE SERVIÇO neste DIA
    const existingSameService = await db.booking.findFirst({
      where: {
        userId,
        serviceId,
        commerceId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
    });

    if (existingSameService) {
      return NextResponse.json(
        {
          error:
            "Você já possui este serviço agendado neste dia. Escolha outro dia ou serviço.",
        },
        { status: 400 }
      );
    }

    // 2) checar se já existe booking nesse COMÉRCIO nesse MESMO HORÁRIO
    const existingBooking = await db.booking.findFirst({
      where: {
        commerceId,
        date: parsedDate,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Este horário já está ocupado neste estabelecimento." },
        { status: 400 }
      );
    }

    

    // 3) criar o booking
    const booking = await db.booking.create({
      data: {
        userId,
        serviceId,
        commerceId,
        date: parsedDate,
        status: BookingStatus.PENDING,
      },
    });
    

    const commerce = await db.commerce.findUnique({
      where: { id: commerceId },
      select: { subdomain: true },
    });

    revalidatePath(`/${commerce?.subdomain}`);
    
    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 }
    );
  }
}
