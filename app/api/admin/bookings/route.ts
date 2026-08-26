import { NextRequest, NextResponse } from "next/server";
import { Booking, generateSampleBookings } from "@/lib/bookings";
import { getServerBookings, saveServerBookings } from "@/lib/serverStorage";

export async function GET() {
  const bookings = getServerBookings();
  return NextResponse.json({
    ok: true,
    bookings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.resetWithSamples) {
      const samples = generateSampleBookings();
      saveServerBookings(samples);
      return NextResponse.json({
        ok: true,
        bookings: samples,
      });
    }

    const {
      planTitle,
      planPrice,
      totalAmount,
      amountPaid,
      paymentMethod,
      tags,
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
      totalAmount: totalAmount ?? undefined,
      amountPaid: amountPaid ?? undefined,
      paymentMethod: paymentMethod ?? undefined,
      tags: Array.isArray(tags) ? tags : undefined,
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

    const currentBookings = getServerBookings();
    const updatedBookings = [newBooking, ...currentBookings];
    saveServerBookings(updatedBookings);

    return NextResponse.json({
      ok: true,
      booking: newBooking,
      bookings: updatedBookings,
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
    const {
      id,
      status,
      paymentStatus,
      amountPaid,
      totalAmount,
      paymentMethod,
      tags,
      internalNotes,
      sessionsCompleted,
      clinicalProfile,
    } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
        { status: 400 },
      );
    }

    const currentBookings = getServerBookings();
    const updatedBookings = currentBookings.map((b) => {
      if (b.id !== id) return b;
      return {
        ...b,
        ...(status !== undefined ? { status } : {}),
        ...(paymentStatus !== undefined ? { paymentStatus } : {}),
        ...(amountPaid !== undefined ? { amountPaid } : {}),
        ...(totalAmount !== undefined ? { totalAmount } : {}),
        ...(paymentMethod !== undefined ? { paymentMethod } : {}),
        ...(tags !== undefined ? { tags } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(sessionsCompleted !== undefined ? { sessionsCompleted } : {}),
        ...(clinicalProfile !== undefined ? { clinicalProfile } : {}),
      };
    });

    saveServerBookings(updatedBookings);

    return NextResponse.json({
      ok: true,
      bookings: updatedBookings,
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

    const currentBookings = getServerBookings();
    const updatedBookings = currentBookings.filter((b) => b.id !== id);
    saveServerBookings(updatedBookings);

    return NextResponse.json({
      ok: true,
      bookings: updatedBookings,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error" },
      { status: 500 },
    );
  }
}
