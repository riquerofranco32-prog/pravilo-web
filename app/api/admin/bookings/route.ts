import { NextRequest, NextResponse } from "next/server";
import { Booking, generateSampleBookings } from "@/lib/bookings";
import {
  getDBBookings,
  saveDBBookings,
  upsertDBBooking,
  deleteDBBooking,
} from "@/lib/cloudStorage";

export async function GET() {
  try {
    const bookings = await getDBBookings();
    return NextResponse.json({
      ok: true,
      bookings,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Error al leer turnos",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.resetWithSamples) {
      const samples = generateSampleBookings();
      const saved = await saveDBBookings(samples);
      if (!saved) {
        return NextResponse.json(
          { ok: false, error: "No se pudieron guardar los turnos de ejemplo" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        ok: true,
        bookings: samples,
      });
    }

    if (body.importAllBookings && Array.isArray(body.importAllBookings)) {
      const saved = await saveDBBookings(body.importAllBookings);
      if (!saved) {
        return NextResponse.json(
          { ok: false, error: "No se pudo importar el respaldo" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        ok: true,
        bookings: body.importAllBookings,
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

    const saved = await upsertDBBooking(newBooking);
    if (!saved) {
      return NextResponse.json(
        { ok: false, error: "No se pudo guardar el turno" },
        { status: 500 },
      );
    }
    const updatedBookings = await getDBBookings();

    return NextResponse.json({
      ok: true,
      booking: newBooking,
      bookings: updatedBookings,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Error al registrar turno",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      date,
      time,
      planTitle,
      planPrice,
      customerName,
      customerPhone,
      customerNotes,
      internalNotes,
      status,
      paymentStatus,
      amountPaid,
      totalAmount,
      paymentMethod,
      tags,
      sessionsCompleted,
      totalSessions,
      clinicalProfile,
    } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
        { status: 400 },
      );
    }

    const currentBookings = await getDBBookings();
    const existing = currentBookings.find((b) => b.id === id);

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Turno no encontrado" },
        { status: 404 },
      );
    }

    const updatedBooking: Booking = {
      ...existing,
      ...(date !== undefined ? { date } : {}),
      ...(time !== undefined ? { time } : {}),
      ...(planTitle !== undefined ? { planTitle } : {}),
      ...(planPrice !== undefined ? { planPrice } : {}),
      ...(customerName !== undefined ? { customerName } : {}),
      ...(customerPhone !== undefined ? { customerPhone } : {}),
      ...(customerNotes !== undefined ? { customerNotes } : {}),
      ...(internalNotes !== undefined ? { internalNotes } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(paymentStatus !== undefined ? { paymentStatus } : {}),
      ...(amountPaid !== undefined ? { amountPaid } : {}),
      ...(totalAmount !== undefined ? { totalAmount } : {}),
      ...(paymentMethod !== undefined ? { paymentMethod } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(sessionsCompleted !== undefined ? { sessionsCompleted } : {}),
      ...(totalSessions !== undefined ? { totalSessions } : {}),
      ...(clinicalProfile !== undefined ? { clinicalProfile } : {}),
    };

    const saved = await upsertDBBooking(updatedBooking);
    if (!saved) {
      return NextResponse.json(
        { ok: false, error: "No se pudo guardar el turno" },
        { status: 500 },
      );
    }
    const updatedBookings = await getDBBookings();

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

    const deleted = await deleteDBBooking(id);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "No se pudo eliminar el turno" },
        { status: 500 },
      );
    }
    const updatedBookings = await getDBBookings();

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
