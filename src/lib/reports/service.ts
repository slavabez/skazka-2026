import {
  getAllDebtSellingDocuments,
  getAllSellingDocumentsByAgentIdsOnly,
  getSellingDocumentsByIds,
} from "@/lib/odata/debt.service";
import {
  getSalesByManagerGroupedByNomenclature,
  getSalesByManagerGroupedByPartnerAndNomenclature,
  getSalesByManagerGroupedByPartners,
} from "@/lib/odata/sales.service";
import {
  groupDebtByCounterparty,
  groupSalesByManufacturer,
  groupSalesByPartnerAndManufacturer,
  mapSalesByNomenclatureRows,
  mapSalesByPartnerAndNomenclatureRows,
  mapSalesByPartnersRows,
  mapSellingDocumentsWithDebt,
} from "@/lib/reports/adapter";
import type {
  IClientGoodsPartnerGroup,
  IDebtGroup,
  IFormattedPartnerReportItem,
  IGroupedNomenclatureReportItem,
} from "@/types/reports";

export async function getSalesByGoodsReport({
  managerId,
  startDate,
  endDate,
}: {
  managerId: string;
  startDate: string;
  endDate: string;
}): Promise<IGroupedNomenclatureReportItem[]> {
  const sales = await getSalesByManagerGroupedByNomenclature({
    managerId,
    startDate: `${startDate}T00:00:00`,
    endDate: `${endDate}T23:59:59`,
  });

  const formatted = mapSalesByNomenclatureRows(sales);
  return groupSalesByManufacturer(formatted);
}

export async function getSalesByClientsReport({
  managerId,
  startDate,
  endDate,
}: {
  managerId: string;
  startDate: string;
  endDate: string;
}): Promise<IFormattedPartnerReportItem[]> {
  const sales = await getSalesByManagerGroupedByPartners({
    managerId,
    startDate: `${startDate}T00:00:00`,
    endDate: `${endDate}T23:59:59`,
  });

  return mapSalesByPartnersRows(sales);
}

export async function getSalesByClientsAndGoodsReport({
  managerId,
  startDate,
  endDate,
}: {
  managerId: string;
  startDate: string;
  endDate: string;
}): Promise<IClientGoodsPartnerGroup[]> {
  const sales = await getSalesByManagerGroupedByPartnerAndNomenclature({
    managerId,
    startDate: `${startDate}T00:00:00`,
    endDate: `${endDate}T23:59:59`,
  });

  const formatted = mapSalesByPartnerAndNomenclatureRows(sales);
  return groupSalesByPartnerAndManufacturer(formatted);
}

export async function getDebtReport({
  managerId,
}: {
  managerId: string;
}): Promise<IDebtGroup[]> {
  const [allDebt, allUserDocs] = await Promise.all([
    getAllDebtSellingDocuments(),
    getAllSellingDocumentsByAgentIdsOnly(managerId),
  ]);

  const userDocKeys = new Set(allUserDocs.map((doc) => doc.Ref_Key));
  const userDebts = allDebt.filter((debt) =>
    userDocKeys.has(debt.ЗаказКлиента),
  );
  const sellingDocuments = await getSellingDocumentsByIds(
    userDebts.map((debt) => debt.ЗаказКлиента),
  );

  const docsWithDebt = mapSellingDocumentsWithDebt({
    sellingDocuments,
    debtItems: userDebts,
  });

  return groupDebtByCounterparty(docsWithDebt);
}
