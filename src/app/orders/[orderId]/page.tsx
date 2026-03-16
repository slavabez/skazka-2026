"use client";

import {
  Alert,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import FullPageLoader from "@/components/FullPageLoader";
import { useParams } from "next/navigation";
import useSWR from "swr";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import {
  format1CDocumentNumber,
  formatDateShort,
  formatPrice,
  translateDeliveryType,
} from "@/lib/orders/format";
import type { OrderDetail } from "@/types/orders";

interface OrderDetailApiResponse {
  order: OrderDetail;
}

function DiscountText({
  totalSum,
  autoDiscount,
  manualDiscount,
}: {
  totalSum: number;
  autoDiscount: number;
  manualDiscount: number;
}) {
  const totalDiscount = autoDiscount + manualDiscount;
  if (totalDiscount <= 1) {
    return null;
  }
  const percent = (totalDiscount / (totalSum + totalDiscount)) * 100;

  return (
    <Text span size="sm" c="dimmed">
      {" "}
      ({formatPrice(totalDiscount)} - {percent.toFixed(2)}%)
    </Text>
  );
}

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const { data, error, isLoading } = useSWR<OrderDetailApiResponse>(
    `/api/orders/${orderId}`,
  );

  if (isLoading) {
    return <FullPageLoader />;
  }
  if (error) {
    return (
      <Alert color="red">
        {error instanceof Error ? error.message : "Не удалось загрузить заказ"}
      </Alert>
    );
  }
  if (!data) {
    return <Alert color="yellow">Данные заказа пока недоступны.</Alert>;
  }

  const order = data.order;

  return (
    <Stack>
      <Title order={2}>Заказ №{format1CDocumentNumber(order.number)}</Title>
      <Card withBorder>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text c="dimmed">Клиент</Text>
            <Text>{order.partner}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Дата заказа</Text>
            <Text>{formatDateShort(order.date)}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Адрес доставки</Text>
            <Text>{order.deliveryAddress || "-"}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Тип доставки</Text>
            <Text>{translateDeliveryType(order.deliveryType)}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Дата доставки</Text>
            <Text>{formatDateShort(order.deliveryDate)}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Статус</Text>
            <OrderStatusBadge
              status={order.status}
              deletionMark={order.deletionMark}
            />
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Тип оплаты</Text>
            <Text>{order.paymentType}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Комментарий</Text>
            <Text>{order.comment || "-"}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Сумма</Text>
            <Text fw={700}>{formatPrice(order.sum)}</Text>
          </Group>
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
          {order.items.map((item) => (
            <Table.Tr key={item.line}>
              <Table.Td>
                <Text td={item.cancelled ? "line-through" : undefined}>
                  {item.nomenclatureName}
                </Text>
              </Table.Td>
              <Table.Td>{item.quantity}</Table.Td>
              <Table.Td>
                <Text span fw={700}>
                  {formatPrice(item.sum)}
                </Text>
                <DiscountText
                  totalSum={item.totalSum}
                  autoDiscount={item.autoDiscount}
                  manualDiscount={item.manualDiscount}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
