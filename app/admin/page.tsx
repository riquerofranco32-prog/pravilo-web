"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_SCHEDULE_CONFIG,
  LOCAL_STORAGE_SCHEDULE_KEY,
  ScheduleConfig,
} from "@/lib/availability";
import {
  BankConfig,
  Booking,
  DEFAULT_BANK_CONFIG,
  GiftCard,
  LOCAL_STORAGE_BANK_KEY,
  LOCAL_STORAGE_BOOKINGS_KEY,
  LOCAL_STORAGE_CLINICAL_KEY,
  LOCAL_STORAGE_GIFTCARDS_KEY,
  LOCAL_STORAGE_PRICES_KEY,
  PaymentMethod,
  PaymentStatus,
  StudentClinicalProfile,
  generateSampleBookings,
  generateSampleClinicalProfiles,
} from "@/lib/bookings";

import { AdminHeader, AdminTab } from "@/components/admin/AdminHeader";
import { SmartAlertsDrawer } from "@/components/admin/SmartAlertsDrawer";
import { ManualBookingModal } from "@/components/admin/ManualBookingModal";
import { PaymentReceiptModal } from "@/components/admin/PaymentReceiptModal";
import { TurnosTab } from "@/components/admin/TurnosTab";
import { AlumnosCrmTab } from "@/components/admin/AlumnosCrmTab";
import { AgendaCalendarTab } from "@/components/admin/AgendaCalendarTab";
import { AnaliticasTab } from "@/components/admin/AnaliticasTab";
import { HorariosTab } from "@/components/admin/HorariosTab";
import { BancoTab } from "@/components/admin/BancoTab";
import { TarifasTab, PlanPricingConfig } from "@/components/admin/TarifasTab";
import { GiftCardsTab } from "@/components/admin/GiftCardsTab";
import { FidelizacionTab } from "@/components/admin/FidelizacionTab";
import { CampanasTab } from "@/components/admin/CampanasTab";
import { GaleriaTab } from "@/components/admin/GaleriaTab";
import { GalleryImageItem, DEFAULT_GALLERY_IMAGES } from "@/lib/gallery";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("turnos");

  // Live time Neuquén
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setCurrentTime(timeStr);
      } catch {
        const now = new Date();
        setCurrentTime(
          `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Config & State
  const [config, setConfig] = useState<ScheduleConfig>(DEFAULT_SCHEDULE_CONFIG);
  const [bankConfig, setBankConfig] = useState<BankConfig>(DEFAULT_BANK_CONFIG);
  const [clinicalProfiles, setClinicalProfiles] = useState<
    Record<string, StudentClinicalProfile>
  >({});
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>(DEFAULT_GALLERY_IMAGES);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Price State
  const [planPrices, setPlanPrices] = useState<PlanPricingConfig>({
    individual: "$35.000",
    pack8: "$240.000",
    pack12: "$300.000",
    individualDesc: "Precio de lanzamiento · 60 min.",
    pack8Desc: "$30.000 por sesión · Vigencia: 2 meses.",
    pack12Desc: "$25.000 por sesión · Vigencia: 3 meses.",
  });

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const knownBookingIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  // Live Toast Notification State
  const [liveNotification, setLiveNotification] = useState<{
    id: string;
    title: string;
    subtitle: string;
    time: string;
  } | null>(null);

  // Audio & Notification State
  const [audioEnabled, setAudioEnabled] = useState(false);
  const notifiedBookingsRef = useRef<Set<string>>(new Set());

  const playChimeSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.15); // A5
      gain2.gain.setValueAtTime(0.22, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 1.2);
    } catch {}
  };

  const notifyNewBooking = (booking: Booking) => {
    playChimeSound();
    setLiveNotification({
      id: booking.id,
      title: `⚡ ¡Nuevo Turno Registrado!`,
      subtitle: `${booking.customerName} · ${booking.planTitle} (${booking.date} a las ${booking.time} hs)`,
      time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    });

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(`⚡ ¡Nuevo Turno en PRAVILO!`, {
        body: `${booking.customerName} reservó ${booking.planTitle} para el ${booking.date} a las ${booking.time} hs.`,
        icon: "/favicon.ico",
      });
    }

    setTimeout(() => {
      setLiveNotification((prev) => (prev?.id === booking.id ? null : prev));
    }, 7000);
  };

  const broadcastBookingsUpdate = (updatedList: Booking[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updatedList));
      localStorage.setItem("pravilo_last_sync_timestamp", String(Date.now()));
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("pravilo_sync_channel");
        bc.postMessage({ type: "UPDATE_BOOKINGS", count: updatedList.length });
        setTimeout(() => bc.close(), 500);
      }
    } catch {}
  };

  const handleToggleAudio = async () => {
    if (!audioEnabled) {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          await Notification.requestPermission();
        }
      }
      playChimeSound();
      setAudioEnabled(true);
      localStorage.setItem("pravilo_audio_alerts", "true");
    } else {
      setAudioEnabled(false);
      localStorage.setItem("pravilo_audio_alerts", "false");
    }
  };

  // Check upcoming bookings every 30s
  useEffect(() => {
    if (!audioEnabled) return;
    const interval = setInterval(() => {
      const today = new Date().toISOString().split("T")[0];
      const now = new Date();
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();
      const currentTotalMins = currentHours * 60 + currentMins;

      bookings.forEach((b) => {
        if (b.date !== today || b.status === "cancelado") return;
        if (notifiedBookingsRef.current.has(b.id)) return;

        const [slotH, slotM] = (b.time || "00:00").split(":").map(Number);
        const slotTotalMins = slotH * 60 + slotM;
        const diff = slotTotalMins - currentTotalMins;

        // Trigger chime if between 0 and 15 mins before session
        if (diff >= 0 && diff <= 15) {
          notifiedBookingsRef.current.add(b.id);
          playChimeSound();
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(`⏰ Próximo Turno: ${b.customerName}`, {
              body: `Sesión de ${b.planTitle} a las ${b.time} hs (en ${diff} minutos).`,
              icon: "/favicon.ico",
            });
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [audioEnabled, bookings]);

  // Modals & Drawers
  const [showAlertsDrawer, setShowAlertsDrawer] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [selectedStudentPhone, setSelectedStudentPhone] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBookings = (isSilent = false) => {
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.bookings)) {
          const incoming: Booking[] = data.bookings;

          // Detect new real bookings on live refresh (only if already loaded and created recently)
          if (!isInitialLoadRef.current && isSilent) {
            const now = Date.now();
            const newOnes = incoming.filter((b) => {
              if (knownBookingIdsRef.current.has(b.id)) return false;
              if (b.id.startsWith("bk_sample")) return false;
              const ageMs = now - new Date(b.createdAt).getTime();
              return ageMs < 120000; // Created in last 2 minutes
            });
            if (newOnes.length > 0) {
              notifyNewBooking(newOnes[0]);
            }
          }

          // Register known ids
          knownBookingIdsRef.current = new Set(incoming.map((b) => b.id));
          isInitialLoadRef.current = false;

          setBookings(incoming);
          localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(incoming));
        } else if (!isSilent) {
          const stored = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                knownBookingIdsRef.current = new Set(parsed.map((b: Booking) => b.id));
                isInitialLoadRef.current = false;
                setBookings(parsed);
                return;
              }
            } catch {}
          }
        }
      })
      .catch(() => {
        if (!isSilent) {
          const stored = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                knownBookingIdsRef.current = new Set(parsed.map((b: Booking) => b.id));
                isInitialLoadRef.current = false;
                setBookings(parsed);
                return;
              }
            } catch {}
          }
        }
      });
  };

  // Real-time synchronization (Polling 3s + Tab Focus + Storage/Broadcast Events)
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Live polling every 3 seconds
    const pollInterval = setInterval(() => {
      fetchBookings(true);
    }, 3000);

    // 2. Window focus & visibility listener
    const handleFocusOrVisible = () => {
      if (document.visibilityState === "visible") {
        fetchBookings(true);
      }
    };
    window.addEventListener("focus", handleFocusOrVisible);
    document.addEventListener("visibilitychange", handleFocusOrVisible);

    // 3. Storage event listener (sync across tabs in same browser)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_BOOKINGS_KEY || e.key === "pravilo_last_sync_timestamp") {
        fetchBookings(true);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 4. BroadcastChannel listener (0ms instant cross-tab sync)
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("pravilo_sync_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "NEW_BOOKING" || event.data?.type === "UPDATE_BOOKINGS") {
            fetchBookings(true);
          }
        };
      }
    } catch {}

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("focus", handleFocusOrVisible);
      document.removeEventListener("visibilitychange", handleFocusOrVisible);
      window.removeEventListener("storage", handleStorageChange);
      if (bc) {
        bc.close();
      }
    };
  }, [isAuthenticated]);

  // Load config, bank & bookings on mount
  useEffect(() => {
    const savedPin = localStorage.getItem("pravilo_admin_auth");
    if (savedPin) {
      setPin(savedPin);
      setIsAuthenticated(true);
    }

    const savedAudio = localStorage.getItem("pravilo_audio_alerts");
    if (savedAudio === "true") {
      setAudioEnabled(true);
    }

    // Schedule Config
    const storedConfig = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_KEY);
    if (storedConfig) {
      try {
        setConfig(JSON.parse(storedConfig));
      } catch {}
    }

    // Bank Config
    const storedBank = localStorage.getItem(LOCAL_STORAGE_BANK_KEY);
    if (storedBank) {
      try {
        setBankConfig(JSON.parse(storedBank));
      } catch {}
    }

    // Clinical Profiles
    const storedClinical = localStorage.getItem(LOCAL_STORAGE_CLINICAL_KEY);
    if (storedClinical) {
      try {
        const parsed = JSON.parse(storedClinical);
        if (Object.keys(parsed).length > 0) {
          setClinicalProfiles(parsed);
        } else {
          const samples = generateSampleClinicalProfiles();
          setClinicalProfiles(samples);
          localStorage.setItem(LOCAL_STORAGE_CLINICAL_KEY, JSON.stringify(samples));
        }
      } catch {
        const samples = generateSampleClinicalProfiles();
        setClinicalProfiles(samples);
        localStorage.setItem(LOCAL_STORAGE_CLINICAL_KEY, JSON.stringify(samples));
      }
    } else {
      const samples = generateSampleClinicalProfiles();
      setClinicalProfiles(samples);
      localStorage.setItem(LOCAL_STORAGE_CLINICAL_KEY, JSON.stringify(samples));
    }

    // Gift Cards
    const storedGiftCards = localStorage.getItem(LOCAL_STORAGE_GIFTCARDS_KEY);
    if (storedGiftCards) {
      try {
        setGiftCards(JSON.parse(storedGiftCards));
      } catch {}
    }

    const savedPrices = localStorage.getItem("pravilo_plan_prices") || localStorage.getItem(LOCAL_STORAGE_PRICES_KEY);
    if (savedPrices) {
      try {
        setPlanPrices(JSON.parse(savedPrices));
      } catch {}
    }

    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok) {
          if (data.config) {
            setConfig(data.config);
            localStorage.setItem(
              LOCAL_STORAGE_SCHEDULE_KEY,
              JSON.stringify(data.config),
            );
          }
          if (data.bankConfig) {
            setBankConfig(data.bankConfig);
            localStorage.setItem(
              LOCAL_STORAGE_BANK_KEY,
              JSON.stringify(data.bankConfig),
            );
          }
          if (data.planPrices) {
            setPlanPrices(data.planPrices);
            localStorage.setItem(
              "pravilo_plan_prices",
              JSON.stringify(data.planPrices),
            );
            localStorage.setItem(
              LOCAL_STORAGE_PRICES_KEY,
              JSON.stringify(data.planPrices),
            );
          }
          if (data.clinicalProfiles && Object.keys(data.clinicalProfiles).length > 0) {
            setClinicalProfiles(data.clinicalProfiles);
            localStorage.setItem(
              LOCAL_STORAGE_CLINICAL_KEY,
              JSON.stringify(data.clinicalProfiles),
            );
          }
          if (data.giftCards && Array.isArray(data.giftCards) && data.giftCards.length > 0) {
            setGiftCards(data.giftCards);
            localStorage.setItem(
              LOCAL_STORAGE_GIFTCARDS_KEY,
              JSON.stringify(data.giftCards),
            );
          }
          if (data.galleryImages && Array.isArray(data.galleryImages) && data.galleryImages.length > 0) {
            setGalleryImages(data.galleryImages);
            localStorage.setItem(
              "pravilo_gallery_images",
              JSON.stringify(data.galleryImages),
            );
          }
        }
      })
      .catch(() => {});

    // Bookings
    fetchBookings(false);
  }, []);

  const handleReloadSamples = () => {
    const freshBookings = generateSampleBookings();
    const freshClinical = generateSampleClinicalProfiles();
    setBookings(freshBookings);
    setClinicalProfiles(freshClinical);
    broadcastBookingsUpdate(freshBookings);
    localStorage.setItem(LOCAL_STORAGE_CLINICAL_KEY, JSON.stringify(freshClinical));

    fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetWithSamples: true }),
    }).catch(() => {});

    setSaveStatus("✨ ¡Turnos nuevos cargados exitosamente!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      pin === "pravilo2026" ||
      pin === "pravilo" ||
      pin === "1234" ||
      pin === "2026"
    ) {
      setIsAuthenticated(true);
      setPinError("");
      localStorage.setItem("pravilo_admin_auth", pin);
    } else {
      setPinError("PIN incorrecto. Probá con 'pravilo2026' o '1234'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin("");
    localStorage.removeItem("pravilo_admin_auth");
  };

  const handleUpdateBookingStatus = async (
    id: string,
    newStatus: Booking["status"],
  ) => {
    // Optimistic instant update
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b,
    );
    setBookings(updated);
    broadcastBookingsUpdate(updated);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
        broadcastBookingsUpdate(data.bookings);
      }
    } catch {}
  };

  const handleUpdatePaymentStatus = async (
    id: string,
    paymentStatus: PaymentStatus,
  ) => {
    // Optimistic instant update
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, paymentStatus } : b,
    );
    setBookings(updated);
    broadcastBookingsUpdate(updated);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
        broadcastBookingsUpdate(data.bookings);
      }
    } catch {}
  };

  const handleSavePaymentDetail = async (
    id: string,
    updates: {
      paymentStatus: PaymentStatus;
      amountPaid?: number;
      paymentMethod?: PaymentMethod;
    },
  ) => {
    // Optimistic instant update
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, ...updates } : b,
    );
    setBookings(updated);
    broadcastBookingsUpdate(updated);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
        broadcastBookingsUpdate(data.bookings);
      }
    } catch {}
  };

  const handleSaveInternalNote = async (id: string, note: string) => {
    // Optimistic instant update
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, internalNotes: note } : b,
    );
    setBookings(updated);
    broadcastBookingsUpdate(updated);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, internalNotes: note }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
        broadcastBookingsUpdate(data.bookings);
      }
    } catch {}
  };

  const handleIncrementSession = async (
    id: string,
    current: number = 0,
    total: number = 1,
  ) => {
    const nextVal = Math.min(total, current + 1);
    const nextStatus: Booking["status"] = nextVal === total ? "realizado" : "confirmado";

    // Optimistic instant update
    const updated: Booking[] = bookings.map((b) =>
      b.id === id ? { ...b, sessionsCompleted: nextVal, status: nextStatus } : b,
    );
    setBookings(updated);
    broadcastBookingsUpdate(updated);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          sessionsCompleted: nextVal,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
        broadcastBookingsUpdate(data.bookings);
      }
    } catch {}
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("¿Eliminar este registro de turno?")) return;

    // Optimistic instant update
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    broadcastBookingsUpdate(updated);

    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
        broadcastBookingsUpdate(data.bookings);
      }
    } catch {}
  };

  const handleCreateManualBooking = async (payload: Partial<Booking>) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.ok && data.bookings) {
        setBookings(data.bookings);
        broadcastBookingsUpdate(data.bookings);
      } else {
        fetchBookings(false);
      }
    } catch {
      fetchBookings(false);
    }
  };

  const handleSaveScheduleConfig = async (newConfig: ScheduleConfig) => {
    setConfig(newConfig);
    localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, JSON.stringify(newConfig));

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: newConfig, pin: pin || "pravilo2026" }),
      });
      if (res.ok) {
        setSaveStatus("✓ Horarios y feriados guardados correctamente.");
      }
    } catch {
      setSaveStatus("✓ Guardado localmente.");
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveBankConfig = (newBank: BankConfig) => {
    setBankConfig(newBank);
    localStorage.setItem(LOCAL_STORAGE_BANK_KEY, JSON.stringify(newBank));
    fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankConfig: newBank, pin: pin || "pravilo2026" }),
    }).catch(() => {});
    setSaveStatus("✓ Datos bancarios guardados correctamente.");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveClinicalProfile = (
    phone: string,
    profile: StudentClinicalProfile,
  ) => {
    const updated = {
      ...clinicalProfiles,
      [phone]: profile,
    };
    setClinicalProfiles(updated);
    localStorage.setItem(LOCAL_STORAGE_CLINICAL_KEY, JSON.stringify(updated));
    fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicalProfiles: updated, pin: pin || "pravilo2026" }),
    }).catch(() => {});
  };

  const handleSavePrices = (newPrices: PlanPricingConfig) => {
    setPlanPrices(newPrices);
    localStorage.setItem("pravilo_plan_prices", JSON.stringify(newPrices));
    localStorage.setItem(LOCAL_STORAGE_PRICES_KEY, JSON.stringify(newPrices));
    fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planPrices: newPrices, pin: pin || "pravilo2026" }),
    }).catch(() => {});
    setSaveStatus("✓ Tarifas guardadas y publicadas correctamente.");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveGiftCards = (updatedCards: GiftCard[]) => {
    setGiftCards(updatedCards);
    localStorage.setItem(LOCAL_STORAGE_GIFTCARDS_KEY, JSON.stringify(updatedCards));
    fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ giftCards: updatedCards, pin: pin || "pravilo2026" }),
    }).catch(() => {});
  };

  const handleSaveGallery = async (updatedImages: GalleryImageItem[]) => {
    setGalleryImages(updatedImages);
    try {
      localStorage.setItem("pravilo_gallery_images", JSON.stringify(updatedImages));
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryImages: updatedImages, pin: pin || "pravilo2026" }),
      });
      const data = await res.json();
      return !!data?.ok;
    } catch {
      return false;
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const raw = evt.target?.result as string;
        const parsed = JSON.parse(raw);

        if (parsed.bookings && Array.isArray(parsed.bookings)) {
          setBookings(parsed.bookings);
          fetch("/api/admin/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.bookings[0]),
          }).catch(() => {});
        }
        if (parsed.config) {
          setConfig(parsed.config);
          localStorage.setItem(
            LOCAL_STORAGE_SCHEDULE_KEY,
            JSON.stringify(parsed.config),
          );
        }
        if (parsed.bankConfig) {
          setBankConfig(parsed.bankConfig);
          localStorage.setItem(
            LOCAL_STORAGE_BANK_KEY,
            JSON.stringify(parsed.bankConfig),
          );
        }
        if (parsed.clinicalProfiles) {
          setClinicalProfiles(parsed.clinicalProfiles);
          localStorage.setItem(
            LOCAL_STORAGE_CLINICAL_KEY,
            JSON.stringify(parsed.clinicalProfiles),
          );
        }
        if (parsed.giftCards && Array.isArray(parsed.giftCards)) {
          setGiftCards(parsed.giftCards);
          localStorage.setItem(
            LOCAL_STORAGE_GIFTCARDS_KEY,
            JSON.stringify(parsed.giftCards),
          );
        }
        if (parsed.planPrices) {
          setPlanPrices(parsed.planPrices);
          localStorage.setItem(
            "pravilo_plan_prices",
            JSON.stringify(parsed.planPrices),
          );
        }
        alert("¡Copia de respaldo restaurada exitosamente!");
      } catch {
        alert("El archivo no tiene un formato JSON válido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Smart alert counts
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const alertCount = useMemo(() => {
    const pendingToday = bookings.filter(
      (b) => b.date === todayStr && b.status === "pendiente",
    ).length;
    const pendingPayments = bookings.filter(
      (b) =>
        b.date >= todayStr &&
        b.status !== "cancelado" &&
        (b.paymentStatus === "pendiente" || b.paymentStatus === "seña"),
    ).length;
    const packRenewals = bookings.filter(
      (b) =>
        (b.totalSessions || 1) > 1 &&
        (b.sessionsCompleted || 0) >= (b.totalSessions || 1) &&
        b.status !== "cancelado",
    ).length;
    return pendingToday + pendingPayments + packRenewals;
  }, [bookings, todayStr]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(160,26,26,0.15)_0,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md bg-surface-raised border border-border rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-text font-condensed font-black text-2xl mx-auto shadow-lg shadow-accent/20">
              P
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground font-condensed uppercase">
              PRAVILO <span className="text-accent-text">ADMIN</span>
            </h1>
            <p className="text-xs text-muted">Ingresá el PIN de seguridad del estudio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-surface border border-border text-center text-xl tracking-widest text-foreground placeholder-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all font-condensed"
              />
              {pinError && (
                <p className="text-xs text-rose-400 text-center mt-2 font-condensed">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-shiny w-full py-3.5 rounded-xl bg-accent hover:opacity-95 text-accent-foreground font-condensed font-bold uppercase tracking-wider text-sm shadow-lg shadow-accent/25 active:scale-95 transition-all"
            >
              Ingresar al Panel
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center">
            <Link
              href="/"
              className="text-xs font-condensed uppercase tracking-wider text-muted hover:text-foreground transition-colors"
            >
              ← Volver a la Web Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTime={currentTime}
        bookings={bookings}
        config={config}
        bankConfig={bankConfig}
        planPrices={planPrices}
        clinicalProfiles={clinicalProfiles}
        alertCount={alertCount}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        onOpenAlerts={() => setShowAlertsDrawer(true)}
        onOpenManualBooking={() => setShowManualModal(true)}
        onLogout={handleLogout}
        onImportBackup={handleImportBackup}
        fileInputRef={fileInputRef}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "turnos" && (
          <TurnosTab
            bookings={bookings}
            bankConfig={bankConfig}
            onUpdateStatus={handleUpdateBookingStatus}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onSaveInternalNote={handleSaveInternalNote}
            onIncrementSession={handleIncrementSession}
            onDeleteBooking={handleDeleteBooking}
            onOpenReceiptModal={(b) => setActiveReceiptBooking(b)}
            onOpenStudentCrm={(phone) => {
              setSelectedStudentPhone(phone);
              setActiveTab("crm");
            }}
            onReloadSamples={handleReloadSamples}
          />
        )}

        {activeTab === "crm" && (
          <AlumnosCrmTab
            bookings={bookings}
            clinicalProfiles={clinicalProfiles}
            onSaveClinicalProfile={handleSaveClinicalProfile}
            selectedStudentPhone={selectedStudentPhone}
            onSelectStudentPhone={setSelectedStudentPhone}
          />
        )}

        {activeTab === "campanas" && <CampanasTab bookings={bookings} />}

        {activeTab === "agenda" && (
          <AgendaCalendarTab
            bookings={bookings}
            config={config}
            onOpenManualBookingForDate={(date, slot) => {
              setShowManualModal(true);
            }}
            onSelectBooking={(id) => {
              const b = bookings.find((bk) => bk.id === id);
              if (b) setActiveReceiptBooking(b);
            }}
          />
        )}

        {activeTab === "analiticas" && <AnaliticasTab bookings={bookings} />}

        {activeTab === "galeria" && (
          <GaleriaTab
            galleryImages={galleryImages}
            onSaveGallery={handleSaveGallery}
            pin={pin}
          />
        )}

        {activeTab === "tarifas" && (
          <TarifasTab
            planPrices={planPrices}
            onSavePrices={handleSavePrices}
            saveStatus={saveStatus}
          />
        )}

        {activeTab === "giftcards" && (
          <GiftCardsTab
            giftCards={giftCards}
            onSaveGiftCards={handleSaveGiftCards}
            planPrices={planPrices}
          />
        )}

        {activeTab === "fidelizacion" && (
          <FidelizacionTab bookings={bookings} />
        )}

        {activeTab === "horarios" && (
          <HorariosTab
            config={config}
            onSaveConfig={handleSaveScheduleConfig}
            saveStatus={saveStatus}
          />
        )}

        {activeTab === "banco" && (
          <BancoTab
            bankConfig={bankConfig}
            onSaveBankConfig={handleSaveBankConfig}
            saveStatus={saveStatus}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <SmartAlertsDrawer
        isOpen={showAlertsDrawer}
        onClose={() => setShowAlertsDrawer(false)}
        bookings={bookings}
        bankConfig={bankConfig}
        onSelectBooking={(id) => {
          setShowAlertsDrawer(false);
          const b = bookings.find((bk) => bk.id === id);
          if (b) setActiveReceiptBooking(b);
        }}
        onUpdateStatus={handleUpdateBookingStatus}
      />

      <ManualBookingModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        config={config}
        planPrices={planPrices}
        onCreated={handleCreateManualBooking}
      />

      <PaymentReceiptModal
        isOpen={!!activeReceiptBooking}
        onClose={() => setActiveReceiptBooking(null)}
        booking={activeReceiptBooking}
        bankConfig={bankConfig}
        onSavePayment={handleSavePaymentDetail}
      />

      {/* Floating Live Notification Toast */}
      {liveNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-2xl bg-surface-raised/95 border-2 border-accent shadow-2xl backdrop-blur-xl flex items-start gap-3.5 shadow-accent/25">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground font-black shrink-0 text-lg shadow-md animate-pulse">
              ⚡
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-condensed font-black text-sm text-foreground uppercase tracking-wide">
                  {liveNotification.title}
                </h4>
                <span className="text-[10px] font-condensed text-muted">
                  {liveNotification.time}
                </span>
              </div>
              <p className="text-xs text-foreground/90 font-medium mt-1 truncate">
                {liveNotification.subtitle}
              </p>
            </div>
            <button
              onClick={() => setLiveNotification(null)}
              className="text-muted hover:text-foreground text-xs p-1 rounded-lg hover:bg-surface"
              title="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
