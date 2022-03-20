import { useState } from "react";
import { useEffect } from "react";

const useGetTokenStats = () => {
  const [tokenStats, setTokenStats] = useState<any>({ tvlData: [] });

  useEffect(() => {
    const fetchTokenStats = async () => {
      const url =
        "https://api.multifarm.fi/jay_flamingo_random_6ix_vegas/get_assets?pg=1&tvl_min=50000&sort=tvlStaked&sort_order=desc&farms_tvl_staked_gte=10000000";
      const reponse = await fetch(url);
      const responseJSON = await reponse.json();
      const filteredResponse = responseJSON.data.find(
        ({ assetId }: any) => assetId === "TERRA_Lido__LUNA"
      );
      const tvlData = filteredResponse.selected_farm[0].tvlStakedHistory.map(
        (stake: any) => ({ value: stake.value, date: new Date(stake.date) })
      );
      setTokenStats({ tvlData });
    };

    fetchTokenStats();
  }, []);

  return tokenStats;
};

export default useGetTokenStats;
