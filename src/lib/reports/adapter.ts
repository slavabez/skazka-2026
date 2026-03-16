import type {
  ISalesByNomenclatureFields,
  ISalesByPartnersAndNomenclatureFields,
  ISalesByPartnersFields,
} from "@/lib/odata/sales.service";
import type {
  IClientGoodsPartnerGroup,
  IDebtGroup,
  IFormattedNomenclatureReportItem,
  IFormattedPartnerAndNomenclatureReportItem,
  IFormattedPartnerReportItem,
  IGroupedNomenclatureReportItem,
  ISaleReportItem,
} from "@/types/reports";

interface IDebtBalanceItem {
  ДолгBalance: number;
  ЗаказКлиента: string;
}

interface ISellingDocumentItem {
  Ref_Key: string;
  Date: string;
  Number: string;
  СуммаДокумента: number;
  Контрагент: {
    Ref_Key: string;
    Description: string;
    ГоловнойКонтрагент_Key: string;
  };
  Партнер: {
    Ref_Key: string;
    Description: string;
  };
}

export function mapSalesByNomenclatureRows(
  sales: ISalesByNomenclatureFields[],
): IFormattedNomenclatureReportItem[] {
  return sales.map((item) => ({
    sum: item.СуммаВыручкиTurnover,
    quantity: item.КоличествоTurnover,
    discount:
      item.СуммаАвтоматическойСкидкиTurnover + item.СуммаРучнойСкидкиTurnover,
    manufacturer:
      item.АналитикаУчетаНоменклатуры.Номенклатура.Производитель.Description,
    nomenclature: item.АналитикаУчетаНоменклатуры.Номенклатура.Description,
  }));
}

export function groupSalesByManufacturer(
  items: IFormattedNomenclatureReportItem[],
): IGroupedNomenclatureReportItem[] {
  const grouped = new Map<string, IGroupedNomenclatureReportItem>();

  for (const currentItem of items) {
    const existing = grouped.get(currentItem.manufacturer);
    if (existing) {
      existing.items.push(currentItem);
      existing.totals.quantity += currentItem.quantity;
      existing.totals.sum += currentItem.sum;
      existing.totals.discount += currentItem.discount;
      continue;
    }

    grouped.set(currentItem.manufacturer, {
      manufacturer: currentItem.manufacturer,
      items: [currentItem],
      totals: {
        quantity: currentItem.quantity,
        sum: currentItem.sum,
        discount: currentItem.discount,
      },
    });
  }

  return Array.from(grouped.values()).sort((a, b) => b.totals.sum - a.totals.sum);
}

export function mapSalesByPartnersRows(
  sales: ISalesByPartnersFields[],
): IFormattedPartnerReportItem[] {
  return sales.map((item) => ({
    sum: item.СуммаВыручкиTurnover,
    quantity: item.КоличествоTurnover,
    discount:
      item.СуммаАвтоматическойСкидкиTurnover + item.СуммаРучнойСкидкиTurnover,
    partner: item.АналитикаУчетаПоПартнерам.Партнер.Description,
    counterpartyId: item.АналитикаУчетаПоПартнерам.Контрагент,
  }));
}

export function mapSalesByPartnerAndNomenclatureRows(
  sales: ISalesByPartnersAndNomenclatureFields[],
): IFormattedPartnerAndNomenclatureReportItem[] {
  return sales.map((item) => ({
    sum: item.СуммаВыручкиTurnover,
    quantity: item.КоличествоTurnover,
    discount:
      item.СуммаАвтоматическойСкидкиTurnover + item.СуммаРучнойСкидкиTurnover,
    partner: item.АналитикаУчетаПоПартнерам.Партнер.Description,
    counterpartyId: item.АналитикаУчетаПоПартнерам.Контрагент,
    nomenclature: item.АналитикаУчетаНоменклатуры.Номенклатура.Description,
    manufacturer:
      item.АналитикаУчетаНоменклатуры.Номенклатура.Производитель.Description,
  }));
}

export function groupSalesByPartnerAndManufacturer(
  items: IFormattedPartnerAndNomenclatureReportItem[],
): IClientGoodsPartnerGroup[] {
  const grouped = items.reduce(
    (acc, item) => {
      if (!acc[item.partner]) {
        acc[item.partner] = {};
      }
      if (!acc[item.partner][item.manufacturer]) {
        acc[item.partner][item.manufacturer] = [];
      }
      acc[item.partner][item.manufacturer].push(item);
      return acc;
    },
    {} as Record<
      string,
      Record<string, IFormattedPartnerAndNomenclatureReportItem[]>
    >,
  );

  const processed = Object.entries(grouped).map(([partner, manufacturers]) => {
    const manufacturerArray = Object.entries(manufacturers).map(
      ([manufacturer, manufacturerItems]) => {
        const aggregates = manufacturerItems.reduce(
          (acc, item) => {
            acc.sum += item.sum;
            acc.quantity += item.quantity;
            acc.discount += item.discount;
            return acc;
          },
          { sum: 0, quantity: 0, discount: 0 },
        );

        return {
          manufacturer,
          items: manufacturerItems,
          aggregates,
        };
      },
    );

    manufacturerArray.sort((a, b) => b.aggregates.sum - a.aggregates.sum);

    const partnerAggregates = manufacturerArray.reduce(
      (acc, { aggregates }) => {
        acc.sum += aggregates.sum;
        acc.quantity += aggregates.quantity;
        acc.discount += aggregates.discount;
        return acc;
      },
      { sum: 0, quantity: 0, discount: 0 },
    );

    return {
      partner,
      manufacturers: manufacturerArray,
      aggregates: partnerAggregates,
    };
  });

  return processed.sort((a, b) => b.aggregates.sum - a.aggregates.sum);
}

export function mapSellingDocumentsWithDebt({
  sellingDocuments,
  debtItems,
}: {
  sellingDocuments: ISellingDocumentItem[];
  debtItems: IDebtBalanceItem[];
}): ISaleReportItem[] {
  const debtByDocumentId = new Map<string, number>();
  for (const debt of debtItems) {
    debtByDocumentId.set(debt.ЗаказКлиента, debt.ДолгBalance);
  }

  return sellingDocuments.map((doc) => ({
    id: doc.Ref_Key,
    number: doc.Number,
    date: doc.Date,
    amount: doc.СуммаДокумента,
    debtAmount: debtByDocumentId.get(doc.Ref_Key) ?? 0,
    counterpartyId: doc.Контрагент.Ref_Key,
    counterpartyParentId: doc.Контрагент.ГоловнойКонтрагент_Key,
    counterpartyName: doc.Контрагент.Description,
    partnerId: doc.Партнер.Ref_Key,
    partnerName: doc.Партнер.Description,
  }));
}

export function groupDebtByCounterparty(docsWithDebt: ISaleReportItem[]): IDebtGroup[] {
  const groupedByCounterparty = docsWithDebt.reduce((acc, doc) => {
    if (!acc.has(doc.counterpartyId)) {
      acc.set(doc.counterpartyId, {
        counterpartyId: doc.counterpartyId,
        counterpartyName: doc.counterpartyName,
        documents: [],
        totalDebt: 0,
      });
    }
    const group = acc.get(doc.counterpartyId);
    if (!group) {
      return acc;
    }
    group.documents.push(doc);
    group.totalDebt += doc.debtAmount ?? 0;
    return acc;
  }, new Map<string, IDebtGroup>());

  return Array.from(groupedByCounterparty.values())
    .map((group) => {
      group.documents.sort((a, b) => (b.debtAmount ?? 0) - (a.debtAmount ?? 0));
      return group;
    })
    .sort((a, b) => b.totalDebt - a.totalDebt);
}
