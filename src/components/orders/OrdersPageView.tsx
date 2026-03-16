"use client";

import { Alert, Stack, Text, TextInput, Title } from "@mantine/core";
import FullPageLoader from "@/components/FullPageLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import OrderList from "@/components/orders/OrderList";
import {
  formatPrice,
  getDateFor1C,
  isValidDateForQuery,
} from "@/lib/orders/format";
import type { OrderListItem } from "@/types/orders";

interface OrdersApiResponse {
  date: string;
  orders: OrderListItem[];
  summary: {
    count: number;
    totalSum: number;
  };
}

export default function OrdersPageView({
  apiRoute,
  title,
  dateLabel,
  description,
}: {
  apiRoute: "/api/orders/by-date" | "/api/orders/by-delivery";
  title: string;
  dateLabel: string;
  description: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = useMemo(() => {
    const fromQuery = searchParams.get("date");
    return fromQuery && isValidDateForQuery(fromQuery)
      ? fromQuery
      : getDateFor1C();
  }, [searchParams]);

  const { data, error, isLoading } = useSWR<OrdersApiResponse>(
    `${apiRoute}?date=${selectedDate}`,
  );

  return (
    <Stack>
      <Title order={2}>{title}</Title>
      <Text c="dimmed">{description}</Text>
      <TextInput
        type="date"
        label={dateLabel}
        value={selectedDate}
        onChange={(event) => {
          const nextDate = event.currentTarget.value;
          router.replace(`?date=${nextDate}`);
        }}
      />

      {isLoading ? <FullPageLoader /> : null}
      {error ? (
        <Alert color="red">
          {error instanceof Error
            ? error.message
            : "Не удалось загрузить заказы"}
        </Alert>
      ) : null}

      {data ? (
        <>
          <Text>
            Заказов: {data.summary.count}, на сумму:{" "}
            {formatPrice(data.summary.totalSum)}
          </Text>
          <OrderList orders={data.orders} />
        </>
      ) : null}
    </Stack>
  );
}
