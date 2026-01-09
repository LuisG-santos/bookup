import AuthProvider from "@/app/_providers/auth";
import { db } from "@/app/_lib/prisma";
import type { ReactNode, CSSProperties } from "react";
import { getTextColorsForBackground, hexToHslTriplet } from "@/app/utils/color";
import { Toaster } from "react-hot-toast";
import { Viewport } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type TenantLayoutProps = {
  children: ReactNode;
  params: Promise<{ subdomain: string }>;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
    ["--background"]: hexToHslTriplet(commerce.backgroundColor),
    ["--primary"]: hexToHslTriplet(commerce.primaryColor),
    ["--secondary"]: hexToHslTriplet(commerce.secondaryColor),

    ["--foreground"]: hexToHslTriplet(textColorsBackground.primary),
    ["--primary-foreground"]: hexToHslTriplet(textColorsPrimary.primary),
    ["--secondary-foreground"]: hexToHslTriplet(textColorsSecondary.primary),

    // compat com suas vars antigas, se ainda usar em algum lugar
    ["--text-on-background"]: textColorsBackground.primary,
    ["--text-on-primary"]: textColorsPrimary.primary,
    ["--text-on-secondary"]: textColorsSecondary.primary,
  };
  const rootCss = `
  :root{
    --background: ${themeVariables["--background"]};
    --foreground: ${themeVariables["--foreground"]};
    --primary: ${themeVariables["--primary"]};
    --primary-foreground: ${themeVariables["--primary-foreground"]};
    --secondary: ${themeVariables["--secondary"]};
    --secondary-foreground: ${themeVariables["--secondary-foreground"]};
    --text-on-background: ${themeVariables["--text-on-background"]};
    --text-on-primary: ${themeVariables["--text-on-primary"]};
    --text-on-secondary: ${themeVariables["--text-on-secondary"]};

  }`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: rootCss }} />
      <div
        style={themeVariables}
        className="min-h-screen bg-background"
      >
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
        </AuthProvider>
      </div>
    </>
  );
}
