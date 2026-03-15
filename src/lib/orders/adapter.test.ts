import { describe, expect, it } from "vitest";
import {
  mapOrderDetailFrom1C,
  mapOrderFrom1C,
  mapOrderItemFrom1C,
} from "./adapter";

describe("orders adapter", () => {
  const baseOrder = {
    Ref_Key: "order-1",
    Number: "0001-000123",
    Date: "2026-03-15T10:00:00",
    СуммаДокумента: 15000,
    Статус: "К отгрузке",
    ФормаОплаты: "Наличный",
    ДатаОтгрузки: "2026-03-16T10:00:00",
    АдресДоставки: "Almaty",
    СпособДоставки: "ДоКлиента",
    Комментарий: "comment",
    Партнер: { Description: "Client A" },
    DeletionMark: false,
  };

  const baseItem = {
    LineNumber: 1,
    Количество: 2,
    Номенклатура_Key: "item-1",
    Цена: 1000,
    Цена_Key: "price-1",
    Сумма: 2000,
    СуммаНДС: 240,
    СуммаСНДС: 2240,
    СуммаРучнойСкидки: 10,
    СуммаАвтоматическойСкидки: 20,
    Отменено: false,
    Номенклатура: { Description: "Product A" },
  };

  it("maps order list item", () => {
    expect(mapOrderFrom1C(baseOrder)).toMatchObject({
      id: "order-1",
      sum: 15000,
      partner: "Client A",
      comment: "comment",
    });
  });

  it("maps order item", () => {
    expect(mapOrderItemFrom1C(baseItem)).toMatchObject({
      line: 1,
      nomenclatureName: "Product A",
      totalSum: 2240,
      autoDiscount: 20,
      manualDiscount: 10,
    });
  });

  it("uses fallback values when nested fields are missing", () => {
    const mappedOrder = mapOrderFrom1C({
      ...baseOrder,
      // @ts-expect-error broken for testing
      Партнер: undefined,
    });
    const mappedItem = mapOrderItemFrom1C({
      ...baseItem,
      // @ts-expect-error broken for testing
      Номенклатура: undefined,
    });

    expect(mappedOrder.partner).toBe("Партнер не найден");
    expect(mappedItem.nomenclatureName).toBe("Неизвестный товар");
  });

  it("maps full order detail", () => {
    const detail = mapOrderDetailFrom1C({
      order: baseOrder,
      items: [baseItem],
    });

    expect(detail.items).toHaveLength(1);
    expect(detail.id).toBe("order-1");
    expect(detail.items[0].nomenclatureId).toBe("item-1");
  });
});
