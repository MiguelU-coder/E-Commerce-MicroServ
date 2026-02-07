import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { CustomJwtSessionClaims } from "@repo/types";

// Parche para evitar que librerías mal programadas rompan el servidor
if (typeof window === "undefined") {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
}

// Agregamos favicon e internos a las rutas públicas para que el middleware no los toque
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/unauthorized(.*)",
  "/favicon.ico",
  "/.well-known/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Llamamos a auth() una sola vez
    const authObj = await auth();

    if (!authObj.userId) {
      return authObj.redirectToSignIn();
    }

    const userRole = (authObj.sessionClaims as CustomJwtSessionClaims)?.metadata
      ?.role;

    if (userRole !== "admin") {
      return Response.redirect(new URL("/unauthorized", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Ignorar archivos estáticos y rutas internas de Next.js de forma agresiva
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
