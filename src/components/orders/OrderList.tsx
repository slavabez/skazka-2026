"use client";

import { Stack } from "@mantine/core";
import OrderListItem from "@/components/orders/OrderListItem";
import type { OrderListItem as TOrderListItem } from "@/types/orders";

export default function OrderList({ orders }: { orders: TOrderListItem[] }) {
  return (
    <Stack gap="sm">
      {orders.map((order, index) => (
        <OrderListItem key={order.id} item={order} index={index + 1} />
      ))}
    </Stack>
  );
}
