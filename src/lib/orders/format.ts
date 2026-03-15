export function getDateFor1C(inputDate?: Date): string {
  const date = inputDate ? new Date(inputDate) : new Date();
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ru-KZ", {
    style: "currency",
    currency: "KZT",
  });
}

export function formatDateShort(dateInput: string | Date): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(date);
}

export function format1CDocumentNumber(number: string): string {
  const parts = number.split("-");
  if (parts.length !== 2) {
    return number;
  }
  const parsedSuffix = parseInt(parts[1], 10);
  if (Number.isNaN(parsedSuffix)) {
    return number;
  }
  return `${parts[0].replace(/^0+/, "")}-${parsedSuffix}`;
}

export function translateDeliveryType(type: string): string {
  switch (type) {
    case "Самовывоз":
      return "Самовывоз";
    case "ДоКлиента":
      return "Доставка до клиента";
    default:
      return type;
  }
}

export function isValidDateForQuery(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
