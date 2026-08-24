import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/lib/bookings";

// In-memory array for server runtime (clean state for real bookings)
let bookingsStorage: Booking[] = [];

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
      paymentStatus = "pendiente",
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
      paymentStatus,
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
    const { id, status, paymentStatus, internalNotes, sessionsCompleted } = body;

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
        ...(paymentStatus !== undefined ? { paymentStatus } : {}),
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
