import fs from "fs";
import path from "path";
import { Booking, BankConfig, DEFAULT_BANK_CONFIG, generateSampleBookings } from "./bookings";
import { DEFAULT_SCHEDULE_CONFIG, ScheduleConfig } from "./availability";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const BANK_FILE = path.join(DATA_DIR, "bank.json");

// In-memory memory fallback caches
let cachedBookings: Booking[] | null = null;
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
  if (cachedBookings && cachedBookings.length > 0) {
    return cachedBookings;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const raw = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedBookings = parsed;
        return cachedBookings;
      }
    }
  } catch (err) {
    console.error("Error reading bookings file:", err);
  }

  const initial = generateSampleBookings();
  cachedBookings = initial;
  saveServerBookings(initial);
  return initial;
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
