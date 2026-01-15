import { axiosInstance } from "@/shared/libs/axios";
import type { Asset, UpdateAssetDto } from "../types/assetTypes";

export const getAssets = async (): Promise<Asset[]> => {
  const response = await axiosInstance.get<Asset[]>("/equipment");
  return response.data;

};

export const updateAsset = async (id: string, data: UpdateAssetDto): Promise<Asset> => {
  // TODO: Implement PUT request to update an asset
  // Example endpoint: /api/assets/:id
  // Use axiosInstance.put()
  throw new Error("Not implemented");
};
