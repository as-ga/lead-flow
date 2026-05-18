import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/leads"];
// const publicRoutes = ["/"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value || null;

  const { pathname } = req.nextUrl;

  if (token) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard", "/leads", "/"],
};
