import type { SkyscannerAPIRefreshResponse } from "./refresh-response";
import { getIndicative } from "../indicative/indicative-sdk";

// SDK Types
export interface RefreshSDK {
  search: SkyscannerAPIRefreshResponse | { error: string };
}

export const getRefreshSDK = async ({
  res,
  sessionToken,
}: {
  res?: SkyscannerAPIRefreshResponse;
  sessionToken?: string;
  ?: string;
}): Promise<IndicativeSDK> => {
  const search = res
    ? res
    : await getIndicative({
        apiUrl: apiUrl ? apiUrl : "",
        query,
        month,
        year,
        groupType,
      });

  return {
    search,
  };
};
