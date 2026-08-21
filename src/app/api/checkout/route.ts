import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createOrderFromCart, EmptyCartError } from "@/lib/orders";
import { PAYMENT_METHODS } from "@/lib/constants";

const checkoutSchema = z.object({
  childName: z.string().trim().max(80).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  promoCode: z.string().trim().max(40).optional(),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to check out." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check your details and try again." },
      { status: 400 }
    );
  }

  try {
    const order = createOrderFromCart(user.id, parsed.data);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof EmptyCartError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Unable to place your order right now. Please try again." },
      { status: 500 }
    );
  }
}
