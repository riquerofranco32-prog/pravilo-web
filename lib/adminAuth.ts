import { NextRequest } from "next/server";

// Server-only: never imported by "use client" code, so this never reaches
// the browser bundle. Falls back to a default only for local dev without an
// .env — set ADMIN_PIN in production.
const ADMIN_PIN = process.env.ADMIN_PIN || "02942564386";

export function isValidPin(pin: unknown): pin is string {
  return typeof pin === "string" && pin.length > 0 && pin === ADMIN_PIN;
}

export function getRequestPin(req: NextRequest): string | null {
  return req.headers.get("x-admin-pin") ?? req.nextUrl.searchParams.get("pin");
}
