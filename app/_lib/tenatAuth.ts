import {db}from "@/app/_lib/prisma";
import { Role } from "@prisma/client";


export async function getCommerceBySubdomain(subdomain: string) {
    return db.commerce.findUnique({
        where: { subdomain },
        select: {
            id: true,
            subdomain: true,
            name: true,
        },
    });
}

export async function getMembership(params: { userId: string; commerceId: string }) {
    return db.commerceMembership.findUnique({
        where: {
            userId_commerceId: { 
                userId: params.userId, 
                commerceId: params.commerceId
            },
        },
        select: {
            id: true,
            role: true,
        },
    });
}

export function hasRole(memberRole: Role, required: Role){
    if (required === Role.CLIENT) return memberRole === Role.CLIENT || memberRole === Role.OWNER;
    if (required === Role.OWNER) return memberRole === Role.OWNER;
    return false;
}