import { getSpecificODataResponseArray } from "@/lib/odata/odata";

export interface ISaleFields {
  Ref_Key: string;
  Number: string;
  Date: string;
  СуммаДокумента: number;
  Posted: boolean;
  ФормаОплаты: string;
  ДатаОтгрузки: string;
  АдресДоставки: string;
  СпособДоставки: string;
  Комментарий: string;
  ЗаказКлиента: string;
  Партнер: {
    Description: string;
  };
}

export interface ISaleContentFields {
  LineNumber: number;
  Количество: number;
  Номенклатура_Key: string;
  Цена: number;
  Цена_Key: string;
  Сумма: number;
  СуммаНДС: number;
  СуммаСНДС: number;
  СуммаРучнойСкидки: number;
  СуммаАвтоматическойСкидки: number;
  ЗаказКлиента: string;
  Номенклатура: {
    Description: string;
  };
}

export async function getSaleById(saleId: string): Promise<ISaleFields[]> {
  return getSpecificODataResponseArray<ISaleFields>({
    path: "Document_РеализацияТоваровУслуг",
    select:
      "Ref_Key,Number,Date,СуммаДокумента,Posted,Комментарий,ФормаОплаты,ЗаказКлиента,АдресДоставки,СпособДоставки,Партнер/Description",
    filter: `Ref_Key eq guid'${saleId}'`,
    expand: "Партнер",
    cacheExpiration: 300,
  });
}

export async function getSaleContent(
  saleId: string,
): Promise<ISaleContentFields[]> {
  return getSpecificODataResponseArray<ISaleContentFields>({
    path: "Document_РеализацияТоваровУслуг_Товары",
    filter: `Ref_Key eq guid'${saleId}'`,
    expand: "Номенклатура",
    select:
      "LineNumber,Номенклатура_Key,Количество,ВидЦены_Key,Цена,Сумма,СуммаНДС,СуммаСНДС,СуммаРучнойСкидки,СуммаАвтоматическойСкидки,ЗаказКлиента,Номенклатура/Description",
    cacheExpiration: 300,
  });
}

export async function getDebtBySaleId(saleId: string): Promise<number> {
  const response = await getSpecificODataResponseArray<{ ДолгBalance: number }>(
    {
      path: "AccumulationRegister_РасчетыСКлиентамиПоДокументам/Balance(Dimensions='ЗаказКлиента')",
      filter: `ЗаказКлиента eq cast(guid'${saleId}', 'Document_РеализацияТоваровУслуг')`,
      select: "ДолгBalance",
      cacheExpiration: 300,
    },
  );
  return response.length > 0 ? response[0].ДолгBalance : 0;
}
