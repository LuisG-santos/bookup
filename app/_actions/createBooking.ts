"use server"
import { db } from "../_lib/prisma"
interface CreateBookingParams {
    serviceId: string;
    userId: string;
    date: Date;
    commerceId: string;
    status: string;
}

export const createBooking = async (params: CreateBookingParams) => {
    await db.booking.create({
        data:{
            serviceId: params.serviceId,
            date: params.date,
            commerceId: params.commerceId,
            status: params.status,
            userId: params.userId,
        } 
    });

}
