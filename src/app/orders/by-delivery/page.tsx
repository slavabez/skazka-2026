import { Suspense } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import OrdersPageView from "@/components/orders/OrdersPageView";

export default function OrdersDeliveryPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <OrdersPageView
        apiRoute="/api/orders/by-delivery"
        title="Заказы по дате доставки"
        dateLabel="Дата доставки"
        description="Здесь показаны заказы с доставкой на выбранный день."
      />
    </Suspense>
  );
}
