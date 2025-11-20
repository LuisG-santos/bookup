import { PrismaClient } from "@prisma/client";
import type { ReactNode, CSSProperties } from "react";


const prisma = new PrismaClient();

type TenantLayoutProps = {
  children: ReactNode;
  params: Promise<{ subdomain: string }>;
};

export default async function TenantLayout({ children, params}: TenantLayoutProps) {
    const { subdomain } = await params;

    const commerce = await prisma.commerce.findUnique({
        where: { subdomain: subdomain },
    });

    if (!commerce) {
        return <div>Commerce not found</div>;
    }
    const themeVariables = {
        ['--primary']: commerce.primaryColor,
        ['--secondary']: commerce.secondaryColor,
    } as CSSProperties;

    return (
            <div
                style={themeVariables}
                className="min-h-screen bg-va">
                {children}
            </div>
    )
}