"use client";

import {
  Accordion,
  Alert,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import FullPageLoader from "@/components/FullPageLoader";
import Link from "next/link";
import useSWR from "swr";
import {
  format1CDocumentNumber,
  formatDateShort,
  formatPrice,
} from "@/lib/orders/format";
import type { IDebtGroup } from "@/types/reports";

interface DebtsReportResponse {
  items: IDebtGroup[];
  summary: {
    totalDebt: number;
    counterparties: number;
  };
}

export default function ReportsDebtsPage() {
  const { data, error, isLoading } =
    useSWR<DebtsReportResponse>("/api/reports/debts");

  return (
    <Stack>
      <Title order={2}>Задолженность клиентов</Title>

      {isLoading ? <FullPageLoader /> : null}
      {error ? (
        <Alert color="red">
          {error instanceof Error ? error.message : "Ошибка загрузки отчета"}
        </Alert>
      ) : null}

      {data ? (
        <>
          <Text>Контрагентов с долгом: {data.summary.counterparties}</Text>
          <Text>Общий долг: {formatPrice(data.summary.totalDebt)}</Text>

          {data.items.length === 0 ? (
            <Text c="dimmed">Нет данных по долгам</Text>
          ) : (
            <Accordion variant="contained">
              {data.items.map((group) => (
                <Accordion.Item
                  value={group.counterpartyId}
                  key={group.counterpartyId}
                >
                  <Accordion.Control>
                    {group.counterpartyName} ({group.documents.length}) —{" "}
                    {formatPrice(group.totalDebt)}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {group.documents.map((doc) => (
                        <Group
                          key={doc.id}
                          justify="space-between"
                          align="start"
                          p="sm"
                          style={{
                            border: "1px solid var(--mantine-color-gray-3)",
                          }}
                        >
                          <Stack gap={2}>
                            <Text>
                              Реализация №{format1CDocumentNumber(doc.number)}{" "}
                              от {formatDateShort(doc.date)}
                            </Text>
                            <Text size="sm" c="dimmed">
                              Долг по документу:{" "}
                              <Text span fw={700} c="dark">
                                {formatPrice(doc.debtAmount ?? 0)}
                              </Text>
                            </Text>
                          </Stack>
                          <Button
                            component={Link}
                            href={`/sale-document/${doc.id}`}
                            size="xs"
                            variant="light"
                          >
                            Подробнее
                          </Button>
                        </Group>
                      ))}
                    </Stack>
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
