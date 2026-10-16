import { useQuery } from "@tanstack/react-query";
import { assetApi, type AssetQueryFilter } from "../api/assetApi";

export const useAssets = (filters: AssetQueryFilter) => {
  return useQuery({
    queryKey: ["assets", filters],
    queryFn: () => assetApi.getAssets(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};
