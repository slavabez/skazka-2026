"use client";

import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { format1CDocumentNumber, formatPrice } from "@/lib/orders/format";
import type { OrderListItem as TOrderListItem } from "@/types/orders";

export default function OrderListItem({
  item,
  index,
}: {
  item: TOrderListItem;
  index: number;
}) {
  return (
    <Card withBorder>
      <Group justify="space-between" align="start">
        <Group gap="xs">
          <Badge variant="outline">{index}</Badge>
          <Text fw={700}>{format1CDocumentNumber(item.number)}</Text>
        </Group>
        <OrderStatusBadge
          status={item.status}
          deletionMark={item.deletionMark}
        />
      </Group>

      <Stack mt="sm" gap={6}>
        <Text fw={600}>{item.partner}</Text>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {item.deliveryAddress || "Адрес доставки не указан"}
          </Text>
          <Text fw={700}>{formatPrice(item.sum)}</Text>
        </Group>
        <Text
          component={Link}
          href={`/orders/${item.id}`}
          size="sm"
          td="underline"
          c="blue"
        >
          Подробнее
        </Text>
      </Stack>
    </Card>
  );
}
