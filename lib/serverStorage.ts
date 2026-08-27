import fs from "fs";
import path from "path";
import { Booking, BankConfig, DEFAULT_BANK_CONFIG, generateSampleBookings } from "./bookings";
import { DEFAULT_SCHEDULE_CONFIG, ScheduleConfig } from "./availability";
import { GalleryImageItem, DEFAULT_GALLERY_IMAGES } from "./gallery";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const BANK_FILE = path.join(DATA_DIR, "bank.json");

// In-memory memory fallback caches
let cachedBookings: Booking[] | null = null;
let isBookingsLoaded = false;
let cachedConfig: ScheduleConfig = { ...DEFAULT_SCHEDULE_CONFIG };
let cachedBank: BankConfig = { ...DEFAULT_BANK_CONFIG };
let isConfigLoaded = false;
let isBankLoaded = false;

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
  if (isBookingsLoaded && cachedBookings !== null) {
    return cachedBookings;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const raw = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedBookings = parsed;
        isBookingsLoaded = true;
        return cachedBookings;
      }
    }
  } catch (err) {
    console.error("Error reading bookings file:", err);
  }

  const initial = generateSampleBookings();
  cachedBookings = initial;
  isBookingsLoaded = true;
  saveServerBookings(initial);
  return initial;
}

export function saveServerBookings(bookings: Booking[]): boolean {
  cachedBookings = bookings;
  isBookingsLoaded = true;
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
  if (isConfigLoaded) {
    return cachedConfig;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.days)) {
        cachedConfig = parsed;
        isConfigLoaded = true;
        return cachedConfig;
      }
    }
  } catch (err) {
    console.error("Error reading config file:", err);
  }

  cachedConfig = { ...DEFAULT_SCHEDULE_CONFIG };
  isConfigLoaded = true;
  saveServerScheduleConfig(cachedConfig);
  return cachedConfig;
}

export function saveServerScheduleConfig(config: ScheduleConfig): boolean {
  cachedConfig = config;
  isConfigLoaded = true;
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
  if (isBankLoaded) {
    return cachedBank;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(BANK_FILE)) {
      const raw = fs.readFileSync(BANK_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.alias) {
        cachedBank = parsed;
        isBankLoaded = true;
        return cachedBank;
      }
    }
  } catch (err) {
    console.error("Error reading bank file:", err);
  }

  cachedBank = { ...DEFAULT_BANK_CONFIG };
  isBankLoaded = true;
  saveServerBankConfig(cachedBank);
  return cachedBank;
}

export function saveServerBankConfig(bank: BankConfig): boolean {
  cachedBank = bank;
  isBankLoaded = true;
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
const PRICES_FILE = path.join(DATA_DIR, "prices.json");
export const DEFAULT_PLAN_PRICES = {
  individual: "$35.000",
  pack8: "$240.000",
  pack12: "$300.000",
  individualDesc: "Precio de lanzamiento · 60 min.",
  pack8Desc: "$30.000 por sesión · Vigencia: 2 meses.",
  pack12Desc: "$25.000 por sesión · Vigencia: 3 meses.",
};

let cachedPrices: Record<string, string | undefined> = { ...DEFAULT_PLAN_PRICES };
let isPricesLoaded = false;

export function getServerPlanPrices(): Record<string, string | undefined> {
  if (isPricesLoaded) {
    return cachedPrices;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(PRICES_FILE)) {
      const raw = fs.readFileSync(PRICES_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.individual) {
        cachedPrices = parsed;
        isPricesLoaded = true;
        return cachedPrices;
      }
    }
  } catch (err) {
    console.error("Error reading prices file:", err);
  }

  cachedPrices = { ...DEFAULT_PLAN_PRICES };
  isPricesLoaded = true;
  saveServerPlanPrices(cachedPrices);
  return cachedPrices;
}

export function saveServerPlanPrices(prices: Record<string, string | undefined>): boolean {
  cachedPrices = prices;
  isPricesLoaded = true;
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
const CLINICAL_FILE = path.join(DATA_DIR, "clinical.json");
let cachedClinical: Record<string, any> = {};
let isClinicalLoaded = false;

export function getServerClinicalProfiles(): Record<string, any> {
  if (isClinicalLoaded) {
    return cachedClinical;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(CLINICAL_FILE)) {
      const raw = fs.readFileSync(CLINICAL_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        cachedClinical = parsed;
        isClinicalLoaded = true;
        return cachedClinical;
      }
    }
  } catch (err) {
    console.error("Error reading clinical file:", err);
  }

  cachedClinical = {};
  isClinicalLoaded = true;
  return cachedClinical;
}

export function saveServerClinicalProfiles(profiles: Record<string, any>): boolean {
  cachedClinical = profiles;
  isClinicalLoaded = true;
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
const GIFTCARDS_FILE = path.join(DATA_DIR, "giftcards.json");
let cachedGiftCards: any[] = [];
let isGiftCardsLoaded = false;

export function getServerGiftCards(): any[] {
  if (isGiftCardsLoaded) {
    return cachedGiftCards;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(GIFTCARDS_FILE)) {
      const raw = fs.readFileSync(GIFTCARDS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedGiftCards = parsed;
        isGiftCardsLoaded = true;
        return cachedGiftCards;
      }
    }
  } catch (err) {
    console.error("Error reading giftcards file:", err);
  }

  cachedGiftCards = [];
  isGiftCardsLoaded = true;
  return cachedGiftCards;
}

export function saveServerGiftCards(cards: any[]): boolean {
  cachedGiftCards = cards;
  isGiftCardsLoaded = true;
  ensureDataDir();

  try {
    fs.writeFileSync(GIFTCARDS_FILE, JSON.stringify(cards, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving giftcards to file:", err);
    return false;
  }
}

const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
let cachedGallery: GalleryImageItem[] | null = null;
let isGalleryLoaded = false;

export function getServerGalleryImages(): GalleryImageItem[] {
  if (isGalleryLoaded && cachedGallery) {
    return cachedGallery;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(GALLERY_FILE)) {
      const raw = fs.readFileSync(GALLERY_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedGallery = parsed;
        isGalleryLoaded = true;
        return cachedGallery;
      }
    }
  } catch (err) {
    console.error("Error reading gallery file:", err);
  }

  cachedGallery = [...DEFAULT_GALLERY_IMAGES];
  isGalleryLoaded = true;
  saveServerGalleryImages(cachedGallery);
  return cachedGallery;
}

export function saveServerGalleryImages(images: GalleryImageItem[]): boolean {
  cachedGallery = images;
  isGalleryLoaded = true;
  ensureDataDir();

  try {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(images, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving gallery to file:", err);
    return false;
  }
}
