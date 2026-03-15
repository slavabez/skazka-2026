export function from1CIdToGuid(id: string): string {
  if (id.length !== 32) {
    throw new Error("Некорректный 1C ID");
  }

  const parts = [
    id.substring(24),
    id.substring(20, 24),
    id.substring(16, 20),
    id.substring(0, 4),
    id.substring(4, 16),
  ];

  return parts.join("-");
}

export function fromGuidTo1CId(guid: string): string {
  if (guid.length !== 36) {
    throw new Error("Некорректный GUID");
  }

  const parts = guid.split("-");
  return `${parts[3]}${parts[4]}${parts[2]}${parts[1]}${parts[0]}`;
}

export function extractRefFrom1CLink(link: string): string {
  const queryIndex = link.indexOf("?");
  if (queryIndex === -1) {
    throw new Error("Некорректная ссылка 1C");
  }

  const queryString = link.substring(queryIndex + 1);
  const searchParams = new URLSearchParams(queryString);
  const ref = searchParams.get("ref");

  if (!ref) {
    throw new Error("Параметр ref не найден");
  }

  return ref;
}
