import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (!token) {
        // If there's no token, redirect to the sign-in page
        if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/home")) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    } else {
        // If token exists and user is on an authentication page, redirect to dashboard
        if (
            url.pathname.startsWith("/sign-in") || 
            url.pathname.startsWith("/sign-up") || 
            url.pathname.startsWith("/verify") || 
            url.pathname === "/"
        ) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/",
        "/dashboard/:path*",
        "/verify/:path*"
    ],
};