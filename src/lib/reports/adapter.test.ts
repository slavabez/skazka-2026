import { describe, expect, it } from "vitest";
import {
  groupDebtByCounterparty,
  groupSalesByManufacturer,
  groupSalesByPartnerAndManufacturer,
  mapSalesByNomenclatureRows,
  mapSalesByPartnerAndNomenclatureRows,
  mapSalesByPartnersRows,
  mapSellingDocumentsWithDebt,
} from "./adapter";

describe("reports adapter", () => {
  it("maps and groups sales by manufacturer with totals", () => {
    const mapped = mapSalesByNomenclatureRows([
      {
        КоличествоTurnover: 2,
        СуммаВыручкиTurnover: 200,
        СуммаРучнойСкидкиTurnover: 10,
        СуммаАвтоматическойСкидкиTurnover: 5,
        АналитикаУчетаНоменклатуры: {
          Номенклатура: {
            Description: "Item A",
            Производитель: { Description: "M1" },
          },
        },
      },
      {
        КоличествоTurnover: 1,
        СуммаВыручкиTurnover: 100,
        СуммаРучнойСкидкиTurnover: 0,
        СуммаАвтоматическойСкидкиTurnover: 2,
        АналитикаУчетаНоменклатуры: {
          Номенклатура: {
            Description: "Item B",
            Производитель: { Description: "M1" },
          },
        },
      },
      {
        КоличествоTurnover: 5,
        СуммаВыручкиTurnover: 600,
        СуммаРучнойСкидкиTurnover: 20,
        СуммаАвтоматическойСкидкиTurnover: 10,
        АналитикаУчетаНоменклатуры: {
          Номенклатура: {
            Description: "Item C",
            Производитель: { Description: "M2" },
          },
        },
      },
    ]);

    const grouped = groupSalesByManufacturer(mapped);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].manufacturer).toBe("M2");
    expect(grouped[0].totals).toEqual({ quantity: 5, sum: 600, discount: 30 });
    expect(grouped[1].manufacturer).toBe("M1");
    expect(grouped[1].totals).toEqual({ quantity: 3, sum: 300, discount: 17 });
  });

  it("maps partner rows with calculated discount", () => {
    const mapped = mapSalesByPartnersRows([
      {
        КоличествоTurnover: 3,
        СуммаВыручкиTurnover: 450,
        СуммаАвтоматическойСкидкиTurnover: 12,
        СуммаРучнойСкидкиTurnover: 3,
        АналитикаУчетаПоПартнерам: {
          Партнер: { Description: "Partner A" },
          Контрагент: "cp-1",
        },
      },
    ]);

    expect(mapped[0]).toEqual({
      quantity: 3,
      sum: 450,
      discount: 15,
      partner: "Partner A",
      counterpartyId: "cp-1",
    });
  });

  it("groups partner + manufacturer with sorted aggregates", () => {
    const mapped = mapSalesByPartnerAndNomenclatureRows([
      {
        КоличествоTurnover: 1,
        СуммаВыручкиTurnover: 100,
        СуммаРучнойСкидкиTurnover: 1,
        СуммаАвтоматическойСкидкиTurnover: 1,
        АналитикаУчетаНоменклатуры: {
          Номенклатура: {
            Description: "N1",
            Производитель: { Description: "M1" },
          },
        },
        АналитикаУчетаПоПартнерам: {
          Партнер: { Description: "P1" },
          Контрагент: "cp-1",
        },
      },
      {
        КоличествоTurnover: 2,
        СуммаВыручкиTurnover: 500,
        СуммаРучнойСкидкиTurnover: 10,
        СуммаАвтоматическойСкидкиTurnover: 20,
        АналитикаУчетаНоменклатуры: {
          Номенклатура: {
            Description: "N2",
            Производитель: { Description: "M2" },
          },
        },
        АналитикаУчетаПоПартнерам: {
          Партнер: { Description: "P1" },
          Контрагент: "cp-1",
        },
      },
      {
        КоличествоTurnover: 4,
        СуммаВыручкиTurnover: 300,
        СуммаРучнойСкидкиTurnover: 5,
        СуммаАвтоматическойСкидкиTurnover: 5,
        АналитикаУчетаНоменклатуры: {
          Номенклатура: {
            Description: "N3",
            Производитель: { Description: "M3" },
          },
        },
        АналитикаУчетаПоПартнерам: {
          Партнер: { Description: "P2" },
          Контрагент: "cp-2",
        },
      },
    ]);

    const grouped = groupSalesByPartnerAndManufacturer(mapped);

    expect(grouped[0].partner).toBe("P1");
    expect(grouped[0].aggregates).toEqual({ sum: 600, quantity: 3, discount: 32 });
    expect(grouped[0].manufacturers[0].manufacturer).toBe("M2");
    expect(grouped[0].manufacturers[0].aggregates).toEqual({
      sum: 500,
      quantity: 2,
      discount: 30,
    });

    expect(grouped[1].partner).toBe("P2");
    expect(grouped[1].aggregates.sum).toBe(300);
  });

  it("maps debt amounts to selling documents and groups by counterparty", () => {
    const docsWithDebt = mapSellingDocumentsWithDebt({
      sellingDocuments: [
        {
          Ref_Key: "doc-1",
          Date: "2026-01-01",
          Number: "0001-1",
          СуммаДокумента: 500,
          Контрагент: {
            Ref_Key: "cp-1",
            Description: "Counterparty A",
            ГоловнойКонтрагент_Key: "cp-parent-1",
          },
          Партнер: {
            Ref_Key: "partner-1",
            Description: "Partner A",
          },
        },
        {
          Ref_Key: "doc-2",
          Date: "2026-01-02",
          Number: "0001-2",
          СуммаДокумента: 800,
          Контрагент: {
            Ref_Key: "cp-1",
            Description: "Counterparty A",
            ГоловнойКонтрагент_Key: "cp-parent-1",
          },
          Партнер: {
            Ref_Key: "partner-1",
            Description: "Partner A",
          },
        },
        {
          Ref_Key: "doc-3",
          Date: "2026-01-03",
          Number: "0001-3",
          СуммаДокумента: 700,
          Контрагент: {
            Ref_Key: "cp-2",
            Description: "Counterparty B",
            ГоловнойКонтрагент_Key: "cp-parent-2",
          },
          Партнер: {
            Ref_Key: "partner-2",
            Description: "Partner B",
          },
        },
      ],
      debtItems: [
        { ЗаказКлиента: "doc-1", ДолгBalance: 100 },
        { ЗаказКлиента: "doc-2", ДолгBalance: 250 },
        { ЗаказКлиента: "doc-3", ДолгBalance: 50 },
      ],
    });

    const grouped = groupDebtByCounterparty(docsWithDebt);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].counterpartyId).toBe("cp-1");
    expect(grouped[0].totalDebt).toBe(350);
    expect(grouped[0].documents[0].id).toBe("doc-2");
    expect(grouped[1].counterpartyId).toBe("cp-2");
    expect(grouped[1].totalDebt).toBe(50);
  });
});
