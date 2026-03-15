import { NextResponse } from "next/server";
import { getAuthRequestContext } from "@/lib/auth/server";
import {
  getDebtBySaleId,
  getSaleById,
  getSaleContent,
} from "@/lib/odata/sale.service";
import { mapSaleDetailFrom1C } from "@/lib/sale/adapter";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await getAuthRequestContext();
    const { id } = await params;

    const [saleRows, saleItems, debt] = await Promise.all([
      getSaleById(id),
      getSaleContent(id),
      getDebtBySaleId(id),
    ]);

    if (saleRows.length === 0) {
      return new NextResponse("Реализация не найдена", { status: 404 });
    }

    return NextResponse.json({
      sale: mapSaleDetailFrom1C({
        sale: saleRows[0],
        items: saleItems,
        debt,
      }),
    });
  } catch (error) {
    const rawMessage =
      error instanceof Error ? error.message : "Не удалось получить реализацию";
    const status = rawMessage === "Unauthorized" ? 401 : 500;
    const message =
      rawMessage === "Unauthorized" ? "Требуется авторизация" : rawMessage;
    return new NextResponse(message, { status });
  }
}
