import { db } from "./prisma";
import { BookingStatus } from "@prisma/client";

type Options ={
    commerceId: string;
    graceMinutes?: number;
};

export async function expirePendingBookings({ commerceId, graceMinutes = 2 }: Options) { 
    const cutoff = new Date(Date.now() - graceMinutes * 60000);

    return db.booking.updateMany({
        where: {
            commerceId,
            status: BookingStatus.PENDING,
            date: { lt: cutoff },
        },
        data: {
            status: BookingStatus.CANCELED,
        },
    });
}