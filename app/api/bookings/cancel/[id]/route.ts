import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { BookingStatus } from "@prisma/client";
import { differenceInMinutes } from "date-fns";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await context.params;
    const bookingId = id;

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { commerce: { select: { subdomain: true } } },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    // Já está cancelado
    if (booking.status === BookingStatus.CANCELED) {
      return NextResponse.json(
        { error: "Este agendamento já está cancelado." },
        { status: 400 }
      );
    }

    const now = new Date();
    const bookingDate = new Date(booking.date);
    const diffMinutes = differenceInMinutes(bookingDate, now);

    //confirmado só pode cancelar com 1h de antecedência
    if (booking.status === BookingStatus.CONFIRMED && diffMinutes < 60) {
      return NextResponse.json(
        {
          error:
            "Você só pode cancelar um agendamento confirmado com pelo menos 1 hora de antecedência.",
        },
        { status: 400 }
      );
    }

    const canceledBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELED },
    });

    // Revalida home e página de agendamentos do tenant
    const subdomain = booking.commerce?.subdomain;
    if (subdomain) {
      revalidatePath(`/${subdomain}`);
      revalidatePath(`/${subdomain}/bookings`);
    }

    return NextResponse.json(canceledBooking, { status: 200 });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar agendamento." },
      { status: 500 }
    );
  }
}
