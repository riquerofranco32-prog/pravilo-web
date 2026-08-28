import fs from "fs";
import path from "path";
import { Booking, BankConfig, DEFAULT_BANK_CONFIG } from "./bookings";
import { DEFAULT_SCHEDULE_CONFIG, ScheduleConfig } from "./availability";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const BANK_FILE = path.join(DATA_DIR, "bank.json");
const PRICES_FILE = path.join(DATA_DIR, "prices.json");
const CLINICAL_FILE = path.join(DATA_DIR, "clinical.json");
const GIFTCARDS_FILE = path.join(DATA_DIR, "giftcards.json");

export const DEFAULT_PLAN_PRICES = {
  individual: "$35.000",
  pack8: "$240.000",
  pack12: "$300.000",
  individualDesc: "Precio de lanzamiento · 60 min.",
  pack8Desc: "$30.000 por sesión · Vigencia: 2 meses.",
  pack12Desc: "$25.000 por sesión · Vigencia: 3 meses.",
};

// In-memory memory fallback caches (for read-only serverless filesystems if any)
let cachedBookings: Booking[] | null = null;
let cachedConfig: ScheduleConfig = { ...DEFAULT_SCHEDULE_CONFIG };
let cachedBank: BankConfig = { ...DEFAULT_BANK_CONFIG };
let cachedPrices: Record<string, string | undefined> = {
  ...DEFAULT_PLAN_PRICES,
};
let cachedClinical: Record<string, any> = {};
let cachedGiftCards: any[] = [];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

// ----------------- BOOKINGS -----------------
export function getServerBookings(): Booking[] {
  ensureDataDir();

  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const raw = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedBookings = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading bookings file:", err);
  }

  if (cachedBookings !== null) {
    return cachedBookings;
  }

  // ponytail: no file and no cache means "no local data yet", not "seed fake
  // bookings". Auto-seeding here used to resurrect fabricated sample turnos
  // any time Firestore was unreachable and this fs fallback kicked in.
  cachedBookings = [];
  return cachedBookings;
}

export function saveServerBookings(bookings: Booking[]): boolean {
  cachedBookings = bookings;
  ensureDataDir();

  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving bookings to file:", err);
    return false;
  }
}

// ----------------- SCHEDULE CONFIG -----------------
export function getServerScheduleConfig(): ScheduleConfig {
  ensureDataDir();

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.days)) {
        cachedConfig = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading config file:", err);
  }

  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = { ...DEFAULT_SCHEDULE_CONFIG };
  saveServerScheduleConfig(cachedConfig);
  return cachedConfig;
}

export function saveServerScheduleConfig(config: ScheduleConfig): boolean {
  cachedConfig = config;
  ensureDataDir();

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving config to file:", err);
    return false;
  }
}

// ----------------- BANK CONFIG -----------------
export function getServerBankConfig(): BankConfig {
  ensureDataDir();

  try {
    if (fs.existsSync(BANK_FILE)) {
      const raw = fs.readFileSync(BANK_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.alias) {
        cachedBank = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading bank file:", err);
  }

  if (cachedBank) {
    return cachedBank;
  }

  cachedBank = { ...DEFAULT_BANK_CONFIG };
  saveServerBankConfig(cachedBank);
  return cachedBank;
}

export function saveServerBankConfig(bank: BankConfig): boolean {
  cachedBank = bank;
  ensureDataDir();

  try {
    fs.writeFileSync(BANK_FILE, JSON.stringify(bank, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving bank to file:", err);
    return false;
  }
}

// ----------------- PLAN PRICES CONFIG -----------------
export function getServerPlanPrices(): Record<string, string | undefined> {
  ensureDataDir();

  try {
    if (fs.existsSync(PRICES_FILE)) {
      const raw = fs.readFileSync(PRICES_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.individual) {
        cachedPrices = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading prices file:", err);
  }

  if (cachedPrices) {
    return cachedPrices;
  }

  cachedPrices = { ...DEFAULT_PLAN_PRICES };
  saveServerPlanPrices(cachedPrices);
  return cachedPrices;
}

export function saveServerPlanPrices(
  prices: Record<string, string | undefined>,
): boolean {
  cachedPrices = prices;
  ensureDataDir();

  try {
    fs.writeFileSync(PRICES_FILE, JSON.stringify(prices, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving prices to file:", err);
    return false;
  }
}

// ----------------- CLINICAL PROFILES -----------------
export function getServerClinicalProfiles(): Record<string, any> {
  ensureDataDir();

  try {
    if (fs.existsSync(CLINICAL_FILE)) {
      const raw = fs.readFileSync(CLINICAL_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        cachedClinical = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading clinical file:", err);
  }

  return cachedClinical || {};
}

export function saveServerClinicalProfiles(
  profiles: Record<string, any>,
): boolean {
  cachedClinical = profiles;
  ensureDataDir();

  try {
    fs.writeFileSync(CLINICAL_FILE, JSON.stringify(profiles, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving clinical to file:", err);
    return false;
  }
}

// ----------------- GIFT CARDS -----------------
export function getServerGiftCards(): any[] {
  ensureDataDir();

  try {
    if (fs.existsSync(GIFTCARDS_FILE)) {
      const raw = fs.readFileSync(GIFTCARDS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedGiftCards = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading giftcards file:", err);
  }

  return cachedGiftCards || [];
}

export function saveServerGiftCards(cards: any[]): boolean {
  cachedGiftCards = cards;
  ensureDataDir();

  try {
    fs.writeFileSync(GIFTCARDS_FILE, JSON.stringify(cards, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving giftcards to file:", err);
    return false;
  }
}
