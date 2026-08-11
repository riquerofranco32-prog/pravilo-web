import { SITE_URL } from "@/lib/constants";

export async function POST(req: Request) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return Response.json(
      { error: "Mercado Pago todavía no está configurado." },
      { status: 501 },
    );
  }

  const { title, price } = await req.json();
  if (typeof title !== "string" || typeof price !== "number" || price <= 0) {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const backUrl = `${SITE_URL}/reserva-confirmada?plan=${encodeURIComponent(title)}&price=${price}`;

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [
        {
          title: `PRAVILO ARG — ${title}`,
          quantity: 1,
          currency_id: "ARS",
          unit_price: price,
        },
      ],
      back_urls: {
        success: backUrl,
        pending: backUrl,
        failure: SITE_URL,
      },
      auto_return: "approved",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json(
      { error: data.message ?? "No se pudo iniciar el pago." },
      { status: 502 },
    );
  }

  return Response.json({ init_point: data.init_point });
}
