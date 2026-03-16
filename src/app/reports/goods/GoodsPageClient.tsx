"use client";

import {
  Accordion,
  Alert,
  Button,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
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
import type { IGroupedNomenclatureReportItem } from "@/types/reports";

interface GoodsReportResponse {
  items: IGroupedNomenclatureReportItem[];
  summary: {
    sum: number;
    discount: number;
  };
}

export default function GoodsPageClient() {
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

  const { data, error, isLoading } = useSWR<GoodsReportResponse>(
    `/api/reports/sales/goods?startDate=${startDate}&endDate=${endDate}`,
  );

  const setDates = (nextStartDate: string, nextEndDate: string) => {
    router.replace(`?startDate=${nextStartDate}&endDate=${nextEndDate}`);
  };
  const currentMonth = useMemo(() => getCurrentMonthRange(), []);
  const previousMonth = useMemo(() => getPreviousMonthRange(), []);

  return (
    <Stack>
      <Title order={2}>Продажи по товарам</Title>
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
            <Accordion variant="contained">
              {data.items.map((group) => (
                <Accordion.Item value={group.manufacturer} key={group.manufacturer}>
                  <Accordion.Control>
                    {group.manufacturer} — {formatPrice(group.totals.sum)}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Table withTableBorder withColumnBorders striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Товар</Table.Th>
                          <Table.Th>Кол-во</Table.Th>
                          <Table.Th>Сумма</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {group.items.map((item) => (
                          <Table.Tr key={`${group.manufacturer}-${item.nomenclature}`}>
                            <Table.Td>{item.nomenclature}</Table.Td>
                            <Table.Td>{item.quantity}</Table.Td>
                            <Table.Td>{formatPrice(item.sum)}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </>
      ) : null}
    </Stack>
  );
}
