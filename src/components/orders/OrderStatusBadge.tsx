"use client";

import { Badge } from "@mantine/core";

export default function OrderStatusBadge({
  status,
  deletionMark,
}: {
  status: string;
  deletionMark: boolean;
}) {
  if (deletionMark) {
    return <Badge color="red">Удален</Badge>;
  }
  if (status === "НеСогласован") {
    return <Badge color="gray">На согласовании</Badge>;
  }
  if (status === "КОбеспечению") {
    return <Badge color="yellow">В резерве</Badge>;
  }
  if (status === "КОтгрузке") {
    return <Badge color="blue">Обработан</Badge>;
  }

  return <Badge color="green">Закрыт</Badge>;
}
