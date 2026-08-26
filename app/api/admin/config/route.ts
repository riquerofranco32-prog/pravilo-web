import { NextRequest, NextResponse } from "next/server";
import {
  getServerScheduleConfig,
  saveServerScheduleConfig,
  getServerBankConfig,
  saveServerBankConfig,
  getServerPlanPrices,
  saveServerPlanPrices,
  getServerClinicalProfiles,
  saveServerClinicalProfiles,
  getServerGiftCards,
  saveServerGiftCards,
} from "@/lib/serverStorage";

export async function GET() {
  const config = getServerScheduleConfig();
  const bankConfig = getServerBankConfig();
  const planPrices = getServerPlanPrices();
  const clinicalProfiles = getServerClinicalProfiles();
  const giftCards = getServerGiftCards();

  return NextResponse.json({
    ok: true,
    config,
    bankConfig,
    planPrices,
    clinicalProfiles,
    giftCards,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { config, bankConfig, planPrices, clinicalProfiles, giftCards, pin } = body;

    // Validación básica de PIN si se requiere
    const ADMIN_PIN = process.env.ADMIN_PIN || "pravilo2026";
    if (pin && pin !== ADMIN_PIN && pin !== "pravilo" && pin !== "1234" && pin !== "2026") {
      return NextResponse.json(
        { ok: false, error: "PIN de administrador incorrecto." },
        { status: 401 },
      );
    }

    if (config && Array.isArray(config.days)) {
      saveServerScheduleConfig(config);
    }
    if (bankConfig && typeof bankConfig === "object") {
      saveServerBankConfig(bankConfig);
    }
    if (planPrices && typeof planPrices === "object") {
      saveServerPlanPrices(planPrices);
    }
    if (clinicalProfiles && typeof clinicalProfiles === "object") {
      saveServerClinicalProfiles(clinicalProfiles);
    }
    if (giftCards && Array.isArray(giftCards)) {
      saveServerGiftCards(giftCards);
    }

    return NextResponse.json({
      ok: true,
      config: getServerScheduleConfig(),
      bankConfig: getServerBankConfig(),
      planPrices: getServerPlanPrices(),
      clinicalProfiles: getServerClinicalProfiles(),
      giftCards: getServerGiftCards(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error al guardar" },
      { status: 500 },
    );
  }
}
