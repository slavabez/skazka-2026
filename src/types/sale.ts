export interface SaleDetailItem {
  line: number;
  nomenclatureId: string;
  nomenclatureName: string;
  quantity: number;
  priceId: string;
  price: number;
  sum: number;
  vat: number;
  totalSum: number;
  autoDiscount: number;
  manualDiscount: number;
}

export interface SaleDetail {
  id: string;
  number: string;
  date: string;
  posted: boolean;
  sum: number;
  paymentType: string;
  deliveryAddress: string;
  deliveryType: string;
  partner: string;
  comment: string;
  debt: number;
  orderId?: string;
  items: SaleDetailItem[];
}
