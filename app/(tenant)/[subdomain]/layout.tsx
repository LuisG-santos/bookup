import AuthProvider from "@/app/_providers/auth";
import { db } from "@/app/_lib/prisma";
import type { ReactNode, CSSProperties } from "react";
import { getTextColorsForBackground } from "@/app/utils/color";
import { Toaster } from "react-hot-toast";

type TenantLayoutProps = {
  children: ReactNode;
  params: Promise<{ subdomain: string }>;
};

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { subdomain } = await params;

  const commerce = await db.commerce.findUnique({
    where: { subdomain },
  });

  if (!commerce) {
    return <div>Commerce not found</div>;
  }

  const textColorsBackground = getTextColorsForBackground(commerce.backgroundColor);
  const textColorsPrimary = getTextColorsForBackground(commerce.primaryColor);
  const textColorsSecondary = getTextColorsForBackground(commerce.secondaryColor);

  const themeVariables: CSSProperties & { [key: string]: string } = {
    // vars de cor usadas pelo shadcn (bg-background, bg-primary, bg-secondary, etc.)
    ["--background"]: commerce.backgroundColor,
    ["--primary"]: commerce.primaryColor,
    ["--secondary"]: commerce.secondaryColor,

    ["--foreground"]: textColorsBackground.primary,
    ["--primary-foreground"]: textColorsPrimary.primary,
    ["--secondary-foreground"]: textColorsSecondary.primary,

    // compat com suas vars antigas, se ainda usar em algum lugar
    ["--text-on-background"]: textColorsBackground.primary,
    ["--text-on-primary"]: textColorsPrimary.primary,
    ["--text-on-secondary"]: textColorsSecondary.primary,
  };

  return (
    <div
      style={themeVariables}
      className="min-h-screen bg-background text-foreground"
    >
      <AuthProvider>
        <Toaster position="top-center" />
        {children}
      </AuthProvider>
    </div>
  );
}
