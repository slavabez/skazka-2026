import { Suspense } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import OrdersPageView from "@/components/orders/OrdersPageView";

export default function OrdersDatePage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <OrdersPageView
        apiRoute="/api/orders/by-date"
        title="Заказы по дате создания"
        dateLabel="Дата заказа"
        description="Здесь показаны заказы, созданные в выбранный день."
      />
    </Suspense>
  );
}
