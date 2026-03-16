import { getSpecificODataResponseArray } from "@/lib/odata/odata";

export async function getAllSellingDocumentsByAgentIdsOnly(
  agentId: string,
): Promise<
  {
    Ref_Key: string;
  }[]
> {
  return getSpecificODataResponseArray({
    path: "Document_РеализацияТоваровУслуг",
    filter: `Менеджер_Key eq guid'${agentId}' and Posted eq true`,
    select: "Ref_Key",
    cacheExpiration: 300,
  });
}

export async function getAllDebtSellingDocuments(): Promise<
  {
    ДолгBalance: number;
    ЗаказКлиента: string;
  }[]
> {
  return getSpecificODataResponseArray({
    path: "AccumulationRegister_РасчетыСКлиентамиПоДокументам/Balance(Dimensions='ЗаказКлиента')",
    filter: `ЗаказКлиента_Type eq 'StandardODATA.Document_РеализацияТоваровУслуг'`,
    select: "ДолгBalance,ЗаказКлиента",
    cacheExpiration: 300,
  });
}

interface ISellingDocument {
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

export async function getSellingDocumentsByIds(
  ids: string[],
): Promise<ISellingDocument[]> {
  if (ids.length === 0) {
    return [];
  }

  const chunkArray = (arr: string[], size: number): string[][] =>
    arr.length > size
      ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
      : [arr];

  const idChunks = chunkArray(ids, 20);
  const fetchDocumentsForChunk = async (chunk: string[]) =>
    getSpecificODataResponseArray<ISellingDocument>({
      path: "Document_РеализацияТоваровУслуг",
      filter: chunk.map((id) => `Ref_Key eq guid'${id}'`).join(" or "),
      select:
        "Ref_Key,Number,Date,СуммаДокумента,Контрагент/Ref_Key,Контрагент/Description,Контрагент/ГоловнойКонтрагент_Key,Партнер/Ref_Key,Партнер/Description",
      expand: "Контрагент,Партнер",
      cacheExpiration: 300,
    });

  const documents = await Promise.all(idChunks.map(fetchDocumentsForChunk));
  return documents.flat();
}
