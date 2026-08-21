import { randomUUID } from "crypto";
import { db } from "./db";
import { listCartItems, clearCart } from "./cart";

export interface OrderItemRecord {
  id: string;
  courseId: string;
  title: string;
  subject: string;
  price: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  childName: string | null;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  createdAt: string;
  items: OrderItemRecord[];
}

// A small, fixed set of promo codes for this demo -- there's no real
// payment/discount backend behind this, just illustrative checkout logic.
const PROMO_CODES: Record<string, { label: string; kind: "percent" | "flat"; value: number }> = {
  LEARN10: { label: "10% off", kind: "percent", value: 10 },
  WELCOME500: { label: "\u20b9500 off", kind: "flat", value: 500 },
};

export function evaluatePromoCode(code: string, subtotal: number) {
  const promo = PROMO_CODES[code.trim().toUpperCase()];
  if (!promo) return { valid: false as const, discount: 0 };
  const discount =
    promo.kind === "percent" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return { valid: true as const, discount: Math.min(discount, subtotal), label: promo.label };
}

function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  for (let attempt = 0; attempt < 8; attempt++) {
    let suffix = "";
    for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    const candidate = `LRN-${suffix}`;
    const exists = db.prepare(`SELECT 1 FROM "Order" WHERE orderNumber = ?`).get(candidate);
    if (!exists) return candidate;
  }
  // Astronomically unlikely fallback
  return `LRN-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export class EmptyCartError extends Error {}

export function createOrderFromCart(
  userId: string,
  options: { childName?: string; paymentMethod: string; promoCode?: string }
): OrderRecord {
  const cartItems = listCartItems(userId);
  if (cartItems.length === 0) {
    throw new EmptyCartError("Your cart is empty.");
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const promo = options.promoCode ? evaluatePromoCode(options.promoCode, subtotal) : null;
  const discount = promo?.valid ? promo.discount : 0;
  const total = Math.max(0, subtotal - discount);

  const orderId = randomUUID();
  const orderNumber = generateOrderNumber();
  const childName = options.childName?.trim() || null;
  const promoCode = promo?.valid ? options.promoCode!.trim().toUpperCase() : null;

  db.exec("BEGIN");
  try {
    db.prepare(
      `INSERT INTO "Order" (id, orderNumber, userId, childName, paymentMethod, subtotal, discount, total, promoCode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(orderId, orderNumber, userId, childName, options.paymentMethod, subtotal, discount, total, promoCode);

    const insertItem = db.prepare(
      `INSERT INTO OrderItem (id, orderId, courseId, title, subject, price) VALUES (?, ?, ?, ?, ?, ?)`
    );
    for (const item of cartItems) {
      insertItem.run(randomUUID(), orderId, item.id, item.title, item.subject, item.price);
    }

    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  clearCart(userId);

  return getOrderByNumber(userId, orderNumber)!;
}

export function getOrderByNumber(userId: string, orderNumber: string): OrderRecord | null {
  const order = db
    .prepare(`SELECT * FROM "Order" WHERE orderNumber = ? AND userId = ?`)
    .get(orderNumber, userId) as
    | {
        id: string;
        orderNumber: string;
        childName: string | null;
        paymentMethod: string;
        subtotal: number;
        discount: number;
        total: number;
        promoCode: string | null;
        createdAt: string;
      }
    | undefined;
  if (!order) return null;

  const items = db
    .prepare(`SELECT id, courseId, title, subject, price FROM OrderItem WHERE orderId = ?`)
    .all(order.id) as unknown as OrderItemRecord[];

  // node:sqlite returns null-prototype row objects, which Next.js's
  // Server -> Client Component boundary rejects ("Only plain objects...
  // can be passed"). Spread each row into a genuine plain object before
  // this ever reaches a client component.
  const plainItems = items.map((row) => ({ ...row }));

  return { ...order, items: plainItems };
}

export interface OrderSummary {
  orderNumber: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export function listOrdersForUser(userId: string): OrderSummary[] {
  const rows = db
    .prepare(
      `SELECT o.orderNumber as orderNumber, o.total as total, o.createdAt as createdAt,
              (SELECT COUNT(*) FROM OrderItem oi WHERE oi.orderId = o.id) as itemCount
       FROM "Order" o
       WHERE o.userId = ?
       ORDER BY o.createdAt DESC`
    )
    .all(userId) as unknown as OrderSummary[];
  return rows;
}

export function orderCount(userId: string): number {
  return (
    db.prepare(`SELECT COUNT(*) as count FROM "Order" WHERE userId = ?`).get(userId) as {
      count: number;
    }
  ).count;
}
