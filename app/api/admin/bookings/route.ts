import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/lib/bookings";

// In-memory array for server runtime
let bookingsStorage: Booking[] = [
  {
    id: "sample-1",
    createdAt: new Date().toISOString(),
    planTitle: "1 Sesión Individual",
    planPrice: "$35.000",
    date: new Date().toISOString().split("T")[0],
    time: "16:00",
    customerName: "Rocío Ríos",
    customerPhone: "2991234567",
    customerNotes: "Primera sesión, descompresión de columna",
    status: "confirmado",
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
      status = "pendiente",
    } = body;

    if (!customerName || !date || !time) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

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
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: "ID y estado requeridos" },
        { status: 400 },
      );
    }

    bookingsStorage = bookingsStorage.map((b) =>
      b.id === id ? { ...b, status } : b,
    );

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
