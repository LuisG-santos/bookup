import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { id } = await context.params;
    const bookingId = id;
    

    const membership = await db.commerceMembership.findFirst({
      where: {
        userId,
        commerce: {
          bookings: {
            some: { id: bookingId },
          },
        },
        role: "OWNER",
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Você não tem permissão para finalizar este agendamento." },
        { status: 403 }
      );
    }
    if(!userId){
        return NextResponse.json(
            { error: "Usuário não autenticado." },
            { status: 401 }
          );
    }

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

    if (booking.status !== BookingStatus.CONFIRMED) {
        return NextResponse.json(
          { error: "Apenas agendamentos confirmados podem ser finalizados." },
          { status: 400 }
        );
    }

    const finalizedBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.FINALIZED },
    });

    // Revalida home e página de agendamentos do tenant
    const subdomain = booking.commerce?.subdomain;
    if (subdomain) {
      revalidatePath(`/${subdomain}`);
      revalidatePath(`/${subdomain}/bookings`);
      revalidatePath(`/${subdomain}/OwnerPages/bookingPending`);
      revalidatePath(`/${subdomain}/OwnerPages/bookingConfirm`);
    }

    return NextResponse.json(finalizedBooking, { status: 200 });
  } catch (error) {
    console.error("Error finalizing booking:", error);
    return NextResponse.json(
      { error: "Erro ao finalizar agendamento." },
      { status: 500 }
    );
  }
}
