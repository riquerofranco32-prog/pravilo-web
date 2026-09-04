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
  getDBGalleryImages,
  saveDBGalleryImages,
} from "@/lib/cloudStorage";

export async function GET() {
  try {
    const [
      config,
      bankConfig,
      planPrices,
      clinicalProfiles,
      giftCards,
      galleryImages,
    ] = await Promise.all([
      getDBScheduleConfig(),
      getDBBankConfig(),
      getDBPlanPrices(),
      getDBClinicalProfiles(),
      getDBGiftCards(),
      getDBGalleryImages(),
    ]);

    return NextResponse.json({
      ok: true,
      config,
      bankConfig,
      planPrices,
      clinicalProfiles,
      giftCards,
      galleryImages,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error ? err.message : "Error al leer la configuración",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      config,
      bankConfig,
      planPrices,
      clinicalProfiles,
      giftCards,
      galleryImages,
      pin,
    } = body;

    // Validación básica de PIN si se requiere
    const ADMIN_PIN = process.env.ADMIN_PIN || "02942564386";
    if (pin && pin !== ADMIN_PIN) {
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
    if (galleryImages && Array.isArray(galleryImages)) {
      promises.push(saveDBGalleryImages(galleryImages));
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
      updatedGalleryImages,
    ] = await Promise.all([
      getDBScheduleConfig(),
      getDBBankConfig(),
      getDBPlanPrices(),
      getDBClinicalProfiles(),
      getDBGiftCards(),
      getDBGalleryImages(),
    ]);

    return NextResponse.json({
      ok: true,
      config: updatedConfig,
      bankConfig: updatedBank,
      planPrices: updatedPrices,
      clinicalProfiles: updatedClinical,
      giftCards: updatedGiftCards,
      galleryImages: updatedGalleryImages,
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
