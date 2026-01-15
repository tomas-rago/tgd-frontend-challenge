import { getAssets } from "../services/assetService";
import type { Asset } from "../types/assetTypes";
import { useState, useEffect } from "react";

const useAssetsData = () => {
  const [data, setData] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // TODO: Implement the fetch logic using getAssets service
  // Set loading states, handle errors, and update data
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

  return {
    data,
    isLoading,
    error,
  };
};

export default useAssetsData;
