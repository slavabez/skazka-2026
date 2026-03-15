import type {
  IOrderContentFields,
  IOrderFields,
} from "@/lib/odata/orders.service";
import type {
  OrderDetail,
  OrderDetailItem,
  OrderListItem,
} from "@/types/orders";

export function mapOrderFrom1C(order: IOrderFields): OrderListItem {
  return {
    id: order.Ref_Key,
    number: order.Number,
    date: order.Date,
    sum: order.СуммаДокумента,
    status: order.Статус,
    paymentType: order.ФормаОплаты,
    deliveryDate: order.ДатаОтгрузки,
    deliveryAddress: order.АдресДоставки,
    deliveryType: order.СпособДоставки,
    deletionMark: order.DeletionMark,
    partner: order?.Партнер?.Description ?? "Партнер не найден",
    comment: order.Комментарий,
  };
}

export function mapOrderItemFrom1C(item: IOrderContentFields): OrderDetailItem {
  return {
    line: item.LineNumber,
    nomenclatureId: item.Номенклатура_Key,
    nomenclatureName: item?.Номенклатура?.Description ?? "Неизвестный товар",
    quantity: item.Количество,
    priceId: item.Цена_Key,
    price: item.Цена,
    sum: item.Сумма,
    vat: item.СуммаНДС,
    totalSum: item.СуммаСНДС,
    autoDiscount: item.СуммаАвтоматическойСкидки,
    manualDiscount: item.СуммаРучнойСкидки,
    cancelled: item.Отменено,
  };
}

export function mapOrderDetailFrom1C({
  order,
  items,
}: {
  order: IOrderFields;
  items: IOrderContentFields[];
}): OrderDetail {
  return {
    ...mapOrderFrom1C(order),
    items: items.map(mapOrderItemFrom1C),
  };
}
