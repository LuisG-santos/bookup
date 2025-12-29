import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const GRACE_MINUTES = 10;
const ms = (min: number) => min * 60_000;

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const { id: bookingId } = await context.params;

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { commerce: { select: { subdomain: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 });
    }

    // Garante que esse owner pertence ao commerce desse booking
    const membership = await db.commerceMembership.findFirst({
      where: {
        userId,
        commerceId: booking.commerceId,
        role: "OWNER",
      },
      select: { id: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Você não tem permissão para confirmar este agendamento." },
        { status: 403 }
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      return NextResponse.json(
        { error: "Apenas agendamentos pendentes podem ser confirmados." },
        { status: 400 }
      );
    }

    const now = Date.now();
    const bookingTime = new Date(booking.date).getTime();

    if (now > bookingTime + ms(GRACE_MINUTES)) {
      await db.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELED },
      });

      const subdomain = booking.commerce?.subdomain;
      if (subdomain) {
        revalidatePath(`/${subdomain}`);
        revalidatePath(`/${subdomain}/bookings`);
        revalidatePath(`/${subdomain}/OwnerPages/bookingPending`);
        revalidatePath(`/${subdomain}/OwnerPages/bookingConfirm`);
      }

      return NextResponse.json(
        { error: "O período para confirmar este agendamento expirou." },
        { status: 400 }
      );
    }

    const confirmedBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });

    const subdomain = booking.commerce?.subdomain;
    if (subdomain) {
      revalidatePath(`/${subdomain}`);
      revalidatePath(`/${subdomain}/bookings`);
      revalidatePath(`/${subdomain}/OwnerPages/bookingPending`);
      revalidatePath(`/${subdomain}/OwnerPages/bookingConfirm`);
    }

    return NextResponse.json(confirmedBooking, { status: 200 });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return NextResponse.json({ error: "Erro ao confirmar agendamento." }, { status: 500 });
  }
}