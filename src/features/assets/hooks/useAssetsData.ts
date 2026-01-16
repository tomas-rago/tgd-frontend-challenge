import { getAssets, updateAsset } from "../services/assetService";
import type { Asset, UpdateAssetDto } from "../types/assetTypes";
import { useState, useEffect } from "react";

const useAssetsData = () => {
  const [data, setData] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      try{
        const assets : Asset[] = await getAssets();
        setData(assets);
      }
      catch{
        setError( new Error("Unexpected error when loading assets."))
      }
      finally{
        setIsLoading(false);
      }
  }

  useEffect(() =>{
    fetchAssets();
  }, []);

  const update = async (id: string, updatedAsset: UpdateAssetDto) => {
    await updateAsset(id, updatedAsset);
    await fetchAssets();
  };


  return {
    data,
    isLoading,
    error,
    update
  };
};

export default useAssetsData;
