import Header from "@/app/_components/ui/header";
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
        ['--background']: commerce.backgroundColor,
        ['--primary']: commerce.primaryColor,
        ['--secondary']: commerce.secondaryColor,
        ['--text-primary']: '#000000',
        ['--text-secondary']: '	#ffffff',
    } as CSSProperties;

    return (
            <div
                style={themeVariables}
                className="min-h-screen bg-va">
                    {/* <Header subdomain={subdomain}/> */}
                    
                {children}
            </div>
    )
}