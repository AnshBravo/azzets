import { useQuery } from "@tanstack/react-query";
import { assetApi } from "../api/assetApi.js";

export const useAssetDetail = (assetId: string) => {
  return useQuery({
    queryKey: ["asset-detail", assetId],
    queryFn: () => assetApi.getAssetById(assetId),
    enabled: !!assetId,
    staleTime: 1000 * 60 * 10,
  });
};
