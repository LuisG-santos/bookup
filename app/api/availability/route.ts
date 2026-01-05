import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/app/_lib/availabitily";
import { fromZonedTime } from "date-fns-tz";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const commerceId = searchParams.get("commerceId");
    const serviceId = searchParams.get("serviceId");
    const dateStr = searchParams.get("date");
    const TZ = "America/Sao_Paulo";

    if (!commerceId || !serviceId || !dateStr) {
      return NextResponse.json(
        { error: "commerceId, serviceId e date são obrigatórios" },
        { status: 400 }
      );
    }

    const date = fromZonedTime(`${dateStr}T00:00:00`, TZ); 

    const slots = await getAvailableSlots({
      commerceId,
      serviceId,
      date,
    });

    return NextResponse.json({ slots },
      {headers:{
        'Cache-Control': 'no-store',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store'
      }
    }
    );
  } catch (error) {
    console.error("Erro interno em /api/availability:", error);
    return NextResponse.json(
      { error: "Erro interno ao calcular horários disponíveis" },
      { status: 500 }
    );
  }
}