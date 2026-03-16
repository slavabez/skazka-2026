import { NextResponse } from "next/server";
import { getAuthRequestContext } from "@/lib/auth/server";
import { getOrdersForUserByDeliveryDate } from "@/lib/odata/orders.service";
import { mapOrderFrom1C } from "@/lib/orders/adapter";
import { getDateFor1C, isValidDateForQuery } from "@/lib/orders/format";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") ?? getDateFor1C();

    if (!isValidDateForQuery(date)) {
      return new NextResponse("Неверный формат даты. Используйте YYYY-MM-DD", {
        status: 400,
      });
    }

    const authContext = await getAuthRequestContext();
    const orders = await getOrdersForUserByDeliveryDate({
      userId: authContext.externalUserId,
      startDate: date,
      endDate: date,
    });
    const data = orders.map(mapOrderFrom1C);
    const totalSum = data.reduce((acc, order) => acc + order.sum, 0);

    return NextResponse.json({
      date,
      orders: data,
      summary: {
        count: data.length,
        totalSum,
      },
    });
  } catch (error) {
    const rawMessage =
      error instanceof Error
        ? error.message
        : "Не удалось получить список заказов";
    const status = rawMessage === "Unauthorized" ? 401 : 500;
    const message =
      rawMessage === "Unauthorized" ? "Требуется авторизация" : rawMessage;
    return new NextResponse(message, { status });
  }
}
