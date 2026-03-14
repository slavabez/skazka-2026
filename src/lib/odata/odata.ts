import { redis } from "@/config/redis";
import type {
  IODataRequestProperties,
  ODataResponseArray,
  ODataResponseObject,
} from "@/types/odata";

export async function fetchOData<T = any>(
  fullUrl: string,
  authHeader: string,
  cacheEx = 300,
): Promise<T[]> {
  const cacheKey = `odata:${fullUrl}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`Cache hit for ${cacheKey}`);
    }
    return JSON.parse(cachedData);
  }
  if (process.env.NODE_ENV !== "production") {
    console.info(`Cache miss for ${cacheKey}, fetching...`);
  }

  const response = await fetch(fullUrl, {
    headers: {
      Authorization: authHeader ?? "",
    },
  });

  const odataResponse: ODataResponseArray<T> =
    (await response.json()) as ODataResponseArray<T>;

  if ("odata.error" in odataResponse) {
    throw new Error(odataResponse["odata.error"].message.value);
  }

  await redis.setex(cacheKey, cacheEx, JSON.stringify(odataResponse.value));

  return odataResponse.value;
}

export async function getSpecificODataResponseArray<T = any>({
  path,
  filter,
  select,
  expand,
  orderBy,
  top,
  skip,
  cacheExpiration,
}: IODataRequestProperties): Promise<T[]> {
  const authHeader = process.env.ODATA_API_AUTH_HEADER;
  const baseUrl = process.env.ODATA_API_URL;

  if (!authHeader || !baseUrl) {
    throw new Error("ODATA_API_AUTH_HEADER and ODATA_API_URL are not set");
  }

  let params = `$format=json`;
  if (filter) {
    params = `${params}&$filter=${filter}`;
  }
  if (select) {
    params = `${params}&$select=${select}`;
  }
  if (expand) {
    params = `${params}&$expand=${expand}`;
  }
  if (orderBy) {
    params = `${params}&$orderby=${orderBy}`;
  }
  if (top) {
    params = `${params}&$top=${top}`;
  }
  if (skip) {
    params = `${params}&$skip=${skip}`;
  }
  try {
    const fullUrl = `${baseUrl}${path}?${params}`;
    return await fetchOData<T>(fullUrl, authHeader, cacheExpiration);
  } catch (e) {
    console.error("Error while getting OData response", e);
    throw e;
  }
}

export async function getSpecificODataResponseObject<T = any>({
  path,
  filter,
  select,
}: {
  path: string;
  filter?: string;
  select?: string;
}): Promise<ODataResponseObject<T>> {
  const authHeader = process.env.ODATA_API_AUTH_HEADER;
  const baseUrl = process.env.ODATA_API_URL;

  if (!authHeader || !baseUrl) {
    throw new Error("ODATA_API_AUTH_HEADER and ODATA_API_URL are not set");
  }

  let params = `$format=json`;
  if (filter) {
    params = `${params}&$filter=${filter}`;
  }
  if (select) {
    params = `${params}&$select=${select}`;
  }
  try {
    const fullUrl = `${baseUrl}${path}?${params}`;
    if (process.env.NODE_ENV === "development") {
      console.info(`Fetching OData object response from "${fullUrl}"`);
    }

    const response = await fetch(fullUrl, {
      headers: {
        Authorization: authHeader ?? "",
      },
    });

    const odataResponse: ODataResponseObject<T> =
      (await response.json()) as ODataResponseObject<T>;

    if ("odata.error" in odataResponse) {
      throw new Error(odataResponse["odata.error"].message.value);
    }
    return odataResponse;
  } catch (e) {
    console.error("Error while getting OData response", e);
    throw e;
  }
}
