import OrdersPageView from "@/components/orders/OrdersPageView";

export default function OrdersDeliveryPage() {
  return (
    <OrdersPageView
      apiRoute="/api/orders/by-delivery"
      title="Заказы по дате доставки"
      dateLabel="Дата доставки"
      description="Здесь показаны заказы с доставкой на выбранный день."
    />
  );
}
