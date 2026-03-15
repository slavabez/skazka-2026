import OrdersPageView from "@/components/orders/OrdersPageView";

export default function OrdersDatePage() {
  return (
    <OrdersPageView
      apiRoute="/api/orders/by-date"
      title="Заказы по дате создания"
      dateLabel="Дата заказа"
      description="Здесь показаны заказы, созданные в выбранный день."
    />
  );
}
