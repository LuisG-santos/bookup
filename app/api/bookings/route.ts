import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
 
  try {
     const body = await req.json();
  console.log("Body recebido =", body)

    const {
      serviceId,
      userId,
      date,
      commerceId,
      status,
    } = body as {
      serviceId?: string;
      userId?: string;
      date?: string;
      commerceId?: string;
      status?: string;
    };

    // validação básica
    if (!serviceId || !userId || !date || !commerceId || !status) {
      console.error("Missing required fields", {
        serviceId,
        userId,
        date,
        commerceId,
        status,
      });
      return NextResponse.json(
        { error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format", date);
      return NextResponse.json(
        { error: "Formato de data inválido." },
        { status: 400 }
      );
    }

    await db.booking.create({
      data: {
        serviceId,
        userId,
        commerceId,
        status: status ?? "pending",
        date: parsedDate,
      },
    });

    return NextResponse.json(
      { message: "Booking created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating booking:", error);

    // Se for erro de constraint do Prisma (ex: userId não existe)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: `Erro de banco (${error.code})`,
          meta: error.meta,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}