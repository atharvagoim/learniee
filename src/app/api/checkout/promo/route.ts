import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { listCartItems } from "@/lib/cart";
import { evaluatePromoCode } from "@/lib/orders";

const schema = z.object({ code: z.string().min(1).max(40) });

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to apply a promo code." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a promo code." }, { status: 400 });
  }

  const items = listCartItems(user.id);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const result = evaluatePromoCode(parsed.data.code, subtotal);

  if (!result.valid) {
    return NextResponse.json({ error: "That promo code isn't valid." }, { status: 404 });
  }

  return NextResponse.json({ valid: true, discount: result.discount, label: result.label });
}
