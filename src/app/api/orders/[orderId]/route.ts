import { NextResponse } from "next/server";
import { getAuthRequestContext } from "@/lib/auth/server";
import { getOrderById, getOrderContent } from "@/lib/odata/orders.service";
import { mapOrderDetailFrom1C } from "@/lib/orders/adapter";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    await getAuthRequestContext();
    const { orderId } = await params;

    const [orderRows, orderItems] = await Promise.all([
      getOrderById(orderId),
      getOrderContent(orderId),
    ]);

    if (orderRows.length === 0) {
      return new NextResponse("Заказ не найден", { status: 404 });
    }

    return NextResponse.json({
      order: mapOrderDetailFrom1C({
        order: orderRows[0],
        items: orderItems,
      }),
    });
  } catch (error) {
    const rawMessage =
      error instanceof Error
        ? error.message
        : "Не удалось получить детали заказа";
    const status = rawMessage === "Unauthorized" ? 401 : 500;
    const message =
      rawMessage === "Unauthorized" ? "Требуется авторизация" : rawMessage;
    return new NextResponse(message, { status });
  }
}
