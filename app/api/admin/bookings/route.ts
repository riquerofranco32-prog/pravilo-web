import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/lib/bookings";

// In-memory array for server runtime
let bookingsStorage: Booking[] = [
  {
    id: "sample-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    planTitle: "1 Sesión Individual",
    planPrice: "$35.000",
    date: new Date().toISOString().split("T")[0],
    time: "16:00",
    customerName: "Rocío Ríos",
    customerPhone: "2991234567",
    customerNotes: "Primera sesión, descompresión de columna",
    internalNotes: "Excelente movilidad inicial",
    sessionsCompleted: 1,
    totalSessions: 1,
    status: "confirmado",
  },
  {
    id: "sample-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    planTitle: "8 Sesiones (2x/sem)",
    planPrice: "$240.000",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split("T")[0],
    time: "10:30",
    customerName: "Carlos Méndez",
    customerPhone: "2994567890",
    customerNotes: "Dolor ciático recurrente",
    internalNotes: "Comenzar con tracción progresiva baja",
    sessionsCompleted: 0,
    totalSessions: 8,
    status: "pendiente",
  },
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    bookings: bookingsStorage,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      planTitle,
      planPrice,
      date,
      time,
      customerName,
      customerPhone,
      customerNotes,
      internalNotes,
      status = "pendiente",
    } = body;

    if (!customerName || !date || !time) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    const totalSessions =
      planTitle && planTitle.includes("8")
        ? 8
        : planTitle && planTitle.includes("12")
          ? 12
          : 1;

    const newBooking: Booking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      planTitle: planTitle || "1 Sesión Individual",
      planPrice: planPrice || "$35.000",
      date,
      time,
      customerName,
      customerPhone: customerPhone || "",
      customerNotes: customerNotes || "",
      internalNotes: internalNotes || "",
      sessionsCompleted: 0,
      totalSessions,
      status,
    };

    // Prepend
    bookingsStorage = [newBooking, ...bookingsStorage];

    return NextResponse.json({
      ok: true,
      booking: newBooking,
      bookings: bookingsStorage,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error al registrar turno" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, internalNotes, sessionsCompleted } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
        { status: 400 },
      );
    }

    bookingsStorage = bookingsStorage.map((b) => {
      if (b.id !== id) return b;
      return {
        ...b,
        ...(status !== undefined ? { status } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(sessionsCompleted !== undefined ? { sessionsCompleted } : {}),
      };
    });

    return NextResponse.json({
      ok: true,
      bookings: bookingsStorage,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
        { status: 400 },
      );
    }

    bookingsStorage = bookingsStorage.filter((b) => b.id !== id);

    return NextResponse.json({
      ok: true,
      bookings: bookingsStorage,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error" },
      { status: 500 },
    );
  }
}
