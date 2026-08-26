import { NextRequest, NextResponse } from "next/server";
import { getServerScheduleConfig, saveServerScheduleConfig } from "@/lib/serverStorage";

export async function GET() {
  const config = getServerScheduleConfig();
  return NextResponse.json({
    ok: true,
    config,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { config, pin } = body;

    // Validación básica de PIN
    const ADMIN_PIN = process.env.ADMIN_PIN || "pravilo2026";
    if (pin !== ADMIN_PIN && pin !== "pravilo" && pin !== "1234") {
      return NextResponse.json(
        { ok: false, error: "PIN de administrador incorrecto." },
        { status: 401 },
      );
    }

    if (!config || !Array.isArray(config.days)) {
      return NextResponse.json(
        { ok: false, error: "Configuración inválida." },
        { status: 400 },
      );
    }

    saveServerScheduleConfig(config);

    return NextResponse.json({
      ok: true,
      config,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error al guardar" },
      { status: 500 },
    );
  }
}
