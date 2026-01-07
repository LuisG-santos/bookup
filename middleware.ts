import { NextRequest, NextResponse } from "next/server";
import path from "path";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "belivio.com.br";

function getHostname(request: NextRequest) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost ?? request.headers.get("host") ?? "";
    return host.toLowerCase();
}

function stripPort(host: string) {
    return host.split(":")[0];
}

function isRootOrwww(host: string) {
    return host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`;
}

function getSubdomain(host: string) {
    if(!host.endsWith(`.${ROOT_DOMAIN}`)) return null; 

    const sub = host.slice(0, -('.${ROOT_DOMAIN}'.length));
    if (!sub) return null;

    if (sub === 'www') return null;

    return sub;
}

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;
    const proto = request.headers.get("x-forwarded-proto");
    const host = stripPort(getHostname(request));

    if (process.env.NODE_ENV === "production" && proto !== "https") {
        return NextResponse.redirect(`https://${host}${url.pathname}${url.search}`, 301);
    }
    
    if(
        pathname.startsWith("/api/") ||
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/favicon.ico")||
        pathname.startsWith("/robots.txt")||
        pathname.startsWith("/sitemap.xml")||
        pathname.startsWith(".")
    ) {
        return NextResponse.next();
    }

    if(isRootOrwww(host)) {
        return NextResponse.next();
    }

    const tenant = getSubdomain(host);
    if(!tenant) {
        return NextResponse.next();
    }

    if (pathname === `/${tenant}` || pathname.startsWith(`/${tenant}/`)) {
        return NextResponse.next();
    }

    url.pathname = `/${tenant}${pathname}`;
    return NextResponse.rewrite(url);
}
export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
    
};