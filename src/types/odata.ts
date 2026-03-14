export type ODataResponseArray<T = any> =
  | {
      "odata.metadata": string;
      value: T[];
    }
  | {
      "odata.error": {
        code: string;
        message: {
          lang: string;
          value: string;
        };
      };
    };

export type ODataResponseObject<T = any> =
  | ({
      "odata.metadata": string;
    } & T)
  | {
      "odata.error": {
        code: string;
        message: {
          lang: string;
          value: string;
        };
      };
    };

export interface IODataRequestProperties {
  path: string;
  filter?: string;
  select?: string;
  expand?: string;
  orderBy?: string;
  top?: number;
  skip?: number;
  cacheExpiration?: number;
}
