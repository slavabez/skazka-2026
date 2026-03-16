export interface IFormattedNomenclatureReportItem {
  quantity: number;
  sum: number;
  discount: number;
  nomenclature: string;
  manufacturer: string;
}

export interface IGroupedNomenclatureReportItem {
  manufacturer: string;
  items: IFormattedNomenclatureReportItem[];
  totals: {
    quantity: number;
    sum: number;
    discount: number;
  };
}

export interface IFormattedPartnerReportItem {
  quantity: number;
  sum: number;
  discount: number;
  partner: string;
  counterpartyId: string;
}

export interface IFormattedPartnerAndNomenclatureReportItem {
  quantity: number;
  sum: number;
  discount: number;
  partner: string;
  counterpartyId: string;
  nomenclature: string;
  manufacturer: string;
}

export interface ISaleReportItem {
  id: string;
  number: string;
  date: string;
  amount: number;
  debtAmount?: number;
  counterpartyId: string;
  counterpartyParentId: string;
  counterpartyName: string;
  partnerId: string;
  partnerName: string;
}

export interface IDebtGroup {
  counterpartyId: string;
  counterpartyName: string;
  documents: ISaleReportItem[];
  totalDebt: number;
}

export interface IClientGoodsPartnerGroup {
  partner: string;
  manufacturers: {
    manufacturer: string;
    items: IFormattedPartnerAndNomenclatureReportItem[];
    aggregates: {
      sum: number;
      quantity: number;
      discount: number;
    };
  }[];
  aggregates: {
    sum: number;
    quantity: number;
    discount: number;
  };
}
