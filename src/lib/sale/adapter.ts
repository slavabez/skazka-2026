import type { ISaleContentFields, ISaleFields } from "@/lib/odata/sale.service";
import type { SaleDetail, SaleDetailItem } from "@/types/sale";

function mapSaleItemFrom1C(item: ISaleContentFields): SaleDetailItem {
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
  };
}

export function mapSaleDetailFrom1C({
  sale,
  items,
  debt,
}: {
  sale: ISaleFields;
  items: ISaleContentFields[];
  debt: number;
}): SaleDetail {
  return {
    id: sale.Ref_Key,
    number: sale.Number,
    date: sale.Date,
    posted: sale.Posted,
    sum: sale.СуммаДокумента,
    paymentType: sale.ФормаОплаты,
    deliveryAddress: sale.АдресДоставки,
    deliveryType: sale.СпособДоставки,
    partner: sale?.Партнер?.Description ?? "Партнер не найден",
    comment: sale.Комментарий,
    debt,
    orderId: sale.ЗаказКлиента,
    items: items.map(mapSaleItemFrom1C),
  };
}
