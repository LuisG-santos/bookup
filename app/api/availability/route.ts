import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/app/_lib/availabitily";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const commerceId = searchParams.get("commerceId");
    const serviceId = searchParams.get("serviceId");
    const dateStr = searchParams.get("date");

    if (!commerceId || !serviceId || !dateStr) {
      return NextResponse.json(
        { error: "commerceId, serviceId e date são obrigatórios" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr); 

    const slots = await getAvailableSlots({
      commerceId,
      serviceId,
      date,
      slotIntervalMinutes: 15,
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Erro interno em /api/availability:", error);
    return NextResponse.json(
      { error: "Erro interno ao calcular horários disponíveis" },
      { status: 500 }
    );
  }
}