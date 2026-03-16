import { NextResponse } from "next/server";
import { getAuthRequestContext } from "@/lib/auth/server";
import { isValidDateForQuery } from "@/lib/orders/format";
import { getSalesByClientsReport } from "@/lib/reports/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new NextResponse("Укажите startDate и endDate", { status: 400 });
    }
    if (!isValidDateForQuery(startDate) || !isValidDateForQuery(endDate)) {
      return new NextResponse("Неверный формат даты. Используйте YYYY-MM-DD", {
        status: 400,
      });
    }

    const authContext = await getAuthRequestContext();
    const data = await getSalesByClientsReport({
      managerId: authContext.externalUserId,
      startDate,
      endDate,
    });

    const summary = data.reduce(
      (acc, item) => ({
        sum: acc.sum + item.sum,
        discount: acc.discount + item.discount,
        quantity: acc.quantity + item.quantity,
      }),
      { sum: 0, discount: 0, quantity: 0 },
    );

    return NextResponse.json({
      startDate,
      endDate,
      items: data,
      summary,
    });
  } catch (error) {
    const rawMessage =
      error instanceof Error ? error.message : "Не удалось получить отчет";
    const status = rawMessage === "Unauthorized" ? 401 : 500;
    const message =
      rawMessage === "Unauthorized" ? "Требуется авторизация" : rawMessage;
    return new NextResponse(message, { status });
  }
}
