"use server"
import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma"
import { BookingStatus } from "@prisma/client";

interface CreateBookingParams {
    serviceId: string;
    userId: string;
    date: Date;
    commerceId: string;
}

export const createBooking = async (params: CreateBookingParams) => {
    await db.booking.create({
        data:{
            serviceId: params.serviceId,
            date: params.date,
            commerceId: params.commerceId,
            status: BookingStatus.PENDING,
            userId: params.userId,
        } 
    });
 revalidatePath(`/[subdomain]/schedule/${params.serviceId}`);
}
