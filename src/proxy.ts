import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_LOGIN_PATH, SESSION_COOKIE } from "@/lib/admin/config";

/**
 * Proxy (ex middleware): controllo veloce prima di ogni pagina dell'admin.
 * Senza cookie di sessione si viene mandati al login, senza nemmeno
 * eseguire la pagina. La verifica completa (sessione valida nel database)
 * la fa requireAdmin() in pagine e Server Action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ADMIN_LOGIN_PATH) return NextResponse.next();

  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/gestione-ar/:path*"],
};
