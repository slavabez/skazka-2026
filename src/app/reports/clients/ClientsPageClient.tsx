"use client";

import { Alert, Button, Group, Stack, Table, Text, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import FullPageLoader from "@/components/FullPageLoader";
import ReportDateRangeFilter from "@/components/reports/ReportDateRangeFilter";
import { formatPrice } from "@/lib/orders/format";
import {
  getCurrentMonthRange,
  getMonthStartForQuery,
  getPreviousMonthRange,
  getTodayForQuery,
} from "@/lib/reports/date";
import type { IFormattedPartnerReportItem } from "@/types/reports";

interface ClientsReportResponse {
  items: IFormattedPartnerReportItem[];
  summary: {
    sum: number;
    discount: number;
    quantity: number;
  };
}

export default function ClientsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = useMemo(
    () => searchParams.get("startDate") ?? getMonthStartForQuery(),
    [searchParams],
  );
  const endDate = useMemo(
    () => searchParams.get("endDate") ?? getTodayForQuery(),
    [searchParams],
  );

  const { data, error, isLoading } = useSWR<ClientsReportResponse>(
    `/api/reports/sales/clients?startDate=${startDate}&endDate=${endDate}`,
  );

  const setDates = (nextStartDate: string, nextEndDate: string) => {
    router.replace(`?startDate=${nextStartDate}&endDate=${nextEndDate}`);
  };
  const currentMonth = useMemo(() => getCurrentMonthRange(), []);
  const previousMonth = useMemo(() => getPreviousMonthRange(), []);

  return (
    <Stack>
      <Title order={2}>Продажи по клиентам</Title>
      <Group>
        <Button
          variant="light"
          onClick={() => setDates(previousMonth.startDate, previousMonth.endDate)}
        >
          Предыдущий месяц ({previousMonth.label})
        </Button>
        <Button
          variant="light"
          onClick={() => setDates(currentMonth.startDate, currentMonth.endDate)}
        >
          Текущий месяц ({currentMonth.label})
        </Button>
      </Group>
      <ReportDateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(value) => setDates(value, endDate)}
        onEndDateChange={(value) => setDates(startDate, value)}
      />

      {isLoading ? <FullPageLoader /> : null}
      {error ? (
        <Alert color="red">
          {error instanceof Error ? error.message : "Ошибка загрузки отчета"}
        </Alert>
      ) : null}

      {data ? (
        <>
          <Text>Общие продажи: {formatPrice(data.summary.sum)}</Text>
          <Text>Общая скидка: {formatPrice(data.summary.discount)}</Text>

          {data.items.length === 0 ? (
            <Text c="dimmed">Нет данных за выбранный период</Text>
          ) : (
            <Table withTableBorder withColumnBorders striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Клиент</Table.Th>
                  <Table.Th>Сумма</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.items.map((item) => (
                  <Table.Tr key={`${item.counterpartyId}-${item.partner}`}>
                    <Table.Td>{item.partner}</Table.Td>
                    <Table.Td>{formatPrice(item.sum)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </>
      ) : null}
    </Stack>
  );
}
