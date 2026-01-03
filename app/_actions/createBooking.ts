"use server"
import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma"
import { BookingStatus } from "@prisma/client";
import { addMinutes } from "date-fns";

interface CreateBookingParams {
    serviceId: string;
    userId: string;
    date: Date;
    commerceId: string;
}

export const createBooking = async (params: CreateBookingParams) => {
    const service = await db.services.findUnique({
        where: {id: params.serviceId},
        select: {duration: true},
    });

    if(!service){
        throw new Error("Serviço não encontrado");
    }
    const start = new Date(params.date);
    start.setSeconds(0,0);

    const end = addMinutes(start, service.duration);

   return await db.booking.create({
        data:{
            serviceId: params.serviceId,
            date: start,
            endDate: end,
            commerceId: params.commerceId,
            status: BookingStatus.PENDING,
            userId: params.userId,
        } 
    }); 
    revalidatePath(`/commerce/${params.commerceId}/bookings`);
}