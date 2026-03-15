"use client";

import {
  Alert,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import FullPageLoader from "@/components/FullPageLoader";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  format1CDocumentNumber,
  formatDateShort,
  formatPrice,
} from "@/lib/orders/format";
import type { SaleDetail } from "@/types/sale";

interface SaleDetailResponse {
  sale: SaleDetail;
}

function DebtAlert({ debt }: { debt: number }) {
  if (!debt || debt === 0) {
    return (
      <Alert color="green" title="Документ оплачен">
        Задолженности по документу не найдено
      </Alert>
    );
  }

  return (
    <Alert color="red" title="Документ не оплачен">
      Задолженность по документу: <b>{formatPrice(debt)}</b>
    </Alert>
  );
}

export default function SaleDocumentDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data, error, isLoading } = useSWR<SaleDetailResponse>(
    `/api/sale-document/${params.id}`,
  );

  if (isLoading) {
    return <FullPageLoader />;
  }
  if (error) {
    return (
      <Alert color="red">
        {error instanceof Error ? error.message : "Ошибка загрузки реализации"}
      </Alert>
    );
  }
  if (!data) {
    return <Alert color="yellow">Данные реализации пока недоступны.</Alert>;
  }

  const sale = data.sale;

  return (
    <Stack>
      <Title order={2}>Реализация №{format1CDocumentNumber(sale.number)}</Title>
      <DebtAlert debt={sale.debt} />

      <Card withBorder>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text c="dimmed">Клиент</Text>
            <Text>{sale.partner}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Дата реализации</Text>
            <Text>{formatDateShort(sale.date)}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Адрес доставки</Text>
            <Text>{sale.deliveryAddress || "-"}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Тип оплаты</Text>
            <Text>{sale.paymentType || "-"}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Комментарий</Text>
            <Text>{sale.comment || "-"}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Сумма</Text>
            <Text fw={700}>{formatPrice(sale.sum)}</Text>
          </Group>
          {sale.orderId ? (
            <Group justify="space-between">
              <Text c="dimmed">Заказ</Text>
              <Button
                component={Link}
                href={`/orders/${sale.orderId}`}
                size="xs"
              >
                Ссылка на заказ
              </Button>
            </Group>
          ) : null}
        </Stack>
      </Card>

      <Table striped withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Товар</Table.Th>
            <Table.Th>Кол-во</Table.Th>
            <Table.Th>Сумма (Скидка)</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sale.items.map((item) => {
            const totalDiscount = item.autoDiscount + item.manualDiscount;
            const totalDiscountPercent =
              (totalDiscount / (item.totalSum + totalDiscount)) * 100;
            return (
              <Table.Tr key={item.line}>
                <Table.Td>{item.nomenclatureName}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>
                  <Text span fw={700}>
                    {formatPrice(item.sum)}
                  </Text>
                  {totalDiscount > 1 ? (
                    <Text span size="sm" c="dimmed">
                      {" "}
                      ({formatPrice(totalDiscount)} -{" "}
                      {totalDiscountPercent.toFixed(2)}%)
                    </Text>
                  ) : null}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
