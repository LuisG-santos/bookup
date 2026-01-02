import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const tz = "America/Sao_Paulo";

export function formatBookingMonth(date: Date | string) {
    return formatInTimeZone(date, tz, "MMMM", { locale: ptBR })
    .replace(/^./, (c) => c.toUpperCase());
}

export function formatBookingDay(date: Date | string) {
    return formatInTimeZone(date, tz, "dd", { locale: ptBR });
}

export function formatBookingTime(date: Date | string) {
    return formatInTimeZone(date, tz, "HH:mm", { locale: ptBR });
}