
import AuthProvider from "@/app/_providers/auth";
import { PrismaClient } from "@prisma/client";
import type { ReactNode, CSSProperties } from "react";
import { getTextColorsForBackground } from "@/app/utils/color";


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

    const textColorsBackground = getTextColorsForBackground(commerce.backgroundColor);
    const textColorsPrimary = getTextColorsForBackground(commerce.primaryColor);
    const textColorsSecondary = getTextColorsForBackground(commerce.secondaryColor);
    const themeVariables = {
        ['--background']: commerce.backgroundColor,
        ['--primary']: commerce.primaryColor,
        ['--secondary']: commerce.secondaryColor,
        ['--text-on-background']: textColorsBackground.primary,
        ['--text-on-primary']: textColorsPrimary.primary,
        ['--text-on-secondary']: textColorsSecondary.primary,
    } as CSSProperties;

   
    return (
            <div style={themeVariables} className="min-h-screen bg-va">
                <AuthProvider>{children}</AuthProvider>
            </div>
    )
}