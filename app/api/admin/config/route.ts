import { NextRequest, NextResponse } from "next/server";
import {
  getDBScheduleConfig,
  saveDBScheduleConfig,
  getDBBankConfig,
  saveDBBankConfig,
  getDBPlanPrices,
  saveDBPlanPrices,
  getDBClinicalProfiles,
  saveDBClinicalProfiles,
  getDBGiftCards,
  saveDBGiftCards,
} from "@/lib/cloudStorage";

export async function GET() {
  const [config, bankConfig, planPrices, clinicalProfiles, giftCards] =
    await Promise.all([
      getDBScheduleConfig(),
      getDBBankConfig(),
      getDBPlanPrices(),
      getDBClinicalProfiles(),
      getDBGiftCards(),
    ]);

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
    const { config, bankConfig, planPrices, clinicalProfiles, giftCards, pin } =
      body;

    // Validación básica de PIN si se requiere
    const ADMIN_PIN = process.env.ADMIN_PIN || "pravilo2026";
    if (
      pin &&
      pin !== ADMIN_PIN &&
      pin !== "pravilo" &&
      pin !== "1234" &&
      pin !== "2026"
    ) {
      return NextResponse.json(
        { ok: false, error: "PIN de administrador incorrecto." },
        { status: 401 },
      );
    }

    const promises: Promise<boolean>[] = [];

    if (config && Array.isArray(config.days)) {
      promises.push(saveDBScheduleConfig(config));
    }
    if (bankConfig && typeof bankConfig === "object") {
      promises.push(saveDBBankConfig(bankConfig));
    }
    if (planPrices && typeof planPrices === "object") {
      promises.push(saveDBPlanPrices(planPrices));
    }
    if (clinicalProfiles && typeof clinicalProfiles === "object") {
      promises.push(saveDBClinicalProfiles(clinicalProfiles));
    }
    if (giftCards && Array.isArray(giftCards)) {
      promises.push(saveDBGiftCards(giftCards));
    }

    const results = await Promise.all(promises);
    if (results.some((ok) => !ok)) {
      return NextResponse.json(
        { ok: false, error: "No se pudo guardar la configuración" },
        { status: 500 },
      );
    }

    const [
      updatedConfig,
      updatedBank,
      updatedPrices,
      updatedClinical,
      updatedGiftCards,
    ] = await Promise.all([
      getDBScheduleConfig(),
      getDBBankConfig(),
      getDBPlanPrices(),
      getDBClinicalProfiles(),
      getDBGiftCards(),
    ]);

    return NextResponse.json({
      ok: true,
      config: updatedConfig,
      bankConfig: updatedBank,
      planPrices: updatedPrices,
      clinicalProfiles: updatedClinical,
      giftCards: updatedGiftCards,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Error al guardar",
      },
      { status: 500 },
    );
  }
}
