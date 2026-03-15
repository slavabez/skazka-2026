export interface OrderListItem {
  id: string;
  number: string;
  date: string;
  sum: number;
  status: string;
  paymentType: string;
  deliveryDate: string;
  deliveryAddress: string;
  deliveryType: string;
  deletionMark: boolean;
  partner: string;
  comment: string;
}

export interface OrderDetailItem {
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
  cancelled: boolean;
}

export interface OrderDetail extends OrderListItem {
  items: OrderDetailItem[];
}
