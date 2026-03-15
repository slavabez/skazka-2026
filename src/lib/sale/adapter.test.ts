import { describe, expect, it } from "vitest";
import type { ISaleContentFields, ISaleFields } from "@/lib/odata/sale.service";
import { mapSaleDetailFrom1C } from "./adapter";

describe("sale adapter", () => {
  const baseSale: ISaleFields = {
    Ref_Key: "sale-1",
    Number: "0001-000777",
    Date: "2026-03-15T10:00:00",
    Posted: true,
    СуммаДокумента: 5000,
    ФормаОплаты: "Наличный",
    АдресДоставки: "Almaty",
    СпособДоставки: "ДоКлиента",
    Комментарий: "sale comment",
    ЗаказКлиента: "order-1",
    Партнер: { Description: "Client A" },
  };

  const saleItems: ISaleContentFields[] = [
    {
      LineNumber: 1,
      Количество: 1,
      Номенклатура_Key: "item-1",
      Цена: 1000,
      Цена_Key: "price-1",
      Сумма: 1000,
      СуммаНДС: 120,
      СуммаСНДС: 1120,
      СуммаРучнойСкидки: 10,
      СуммаАвтоматическойСкидки: 0,
      Номенклатура: { Description: "Product A" },
    },
  ];

  it("maps sale detail shape", () => {
    const mapped = mapSaleDetailFrom1C({
      sale: baseSale,
      items: saleItems,
      debt: 300,
    });

    expect(mapped.id).toBe("sale-1");
    expect(mapped.partner).toBe("Client A");
    expect(mapped.debt).toBe(300);
    expect(mapped.items[0].nomenclatureName).toBe("Product A");
  });

  it("uses fallback partner and item names", () => {
    const mapped = mapSaleDetailFrom1C({
      sale: { ...baseSale, Партнер: undefined } as unknown as ISaleFields,
      items: [
        {
          ...saleItems[0],
          Номенклатура: undefined,
        } as unknown as ISaleContentFields,
      ],
      debt: 0,
    });

    expect(mapped.partner).toBe("Партнер не найден");
    expect(mapped.items[0].nomenclatureName).toBe("Неизвестный товар");
  });
});
