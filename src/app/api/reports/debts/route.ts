import { NextResponse } from "next/server";
import { getAuthRequestContext } from "@/lib/auth/server";
import { getDebtReport } from "@/lib/reports/service";

export async function GET() {
  try {
    const authContext = await getAuthRequestContext();
    const data = await getDebtReport({
      managerId: authContext.externalUserId,
    });

    return NextResponse.json({
      items: data,
      summary: {
        totalDebt: data.reduce((acc, item) => acc + item.totalDebt, 0),
        counterparties: data.length,
      },
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
