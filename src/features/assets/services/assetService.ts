import { axiosInstance } from "@/shared/libs/axios";
import type { Asset, UpdateAssetDto } from "../types/assetTypes";
import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    switch (status) {
      case 400:
        return "The request contains invalid data. Please check your input and try again.";
      case 408:
        return "The request timed out. Please try again.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "An unexpected server error occurred. Please try again later.";
      case 502:
        return "The server is temporarily unavailable. Please try again later.";
      case 503:
        return "The service is currently unavailable. Please try again later.";
      case 504:
        return "The server took too long to respond. Please try again.";
      default:
        if (error.code === "ERR_NETWORK") {
          return "Unable to connect to the server. Please check your internet connection.";
        }
        if (error.code === "ECONNABORTED") {
          return "The request timed out. Please try again.";
        }
        return "An unexpected error occurred. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};


export const getAssets = async (): Promise<Asset[]> => {
  const response = await axiosInstance.get<Asset[]>("/equipment");
  return response.data;

};

export const updateAsset = async (id: string, data: UpdateAssetDto): Promise<Asset> => {
  const response = await axiosInstance.put<Asset>('/equipment', data);
  return response.data;
};
