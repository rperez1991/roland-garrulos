import { type NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export default async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Login API
  if (pathname === "/api/auth" && request.method === "POST") {
    try {
      const { password } = await request.json();
      if (password === ADMIN_PASSWORD) {
        const response = NextResponse.json({ ok: true });
        response.cookies.set("admin-auth", "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
        return response;
      }
      return NextResponse.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
    } catch {
      return NextResponse.json({ ok: false, error: "Error" }, { status: 400 });
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin/") || (pathname === "/admin" && searchParams.get("login") !== "1")) {
    const auth = request.cookies.get("admin-auth");
    if (auth?.value !== "true") {
      return NextResponse.redirect(new URL("/admin?login=1", request.url));
    }
  }

  return NextResponse.next();
}
