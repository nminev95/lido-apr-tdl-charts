import { useState } from "react";
import { useEffect } from "react";
import { IGetTokenStatsResponse, ITokenStats } from "../models/models";

const useGetTokenStats = () => {
  const [tokenStats, setTokenStats] = useState<{
    tvlData: ITokenStats[];
    aprData: ITokenStats[];
  }>({
    tvlData: [],
    aprData: [],
  });

  useEffect(() => {
    const fetchTokenStats = async () => {
      const url =
        "https://api.multifarm.fi/jay_flamingo_random_6ix_vegas/get_assets?pg=1&tvl_min=50000&sort=tvlStaked&sort_order=desc&farms_tvl_staked_gte=10000000";
      const reponse = await fetch(url);
      const responseJSON = await reponse.json();
      const filteredResponse = responseJSON.data.find(
        ({ assetId }: IGetTokenStatsResponse) => assetId === "TERRA_Lido__LUNA"
      );
      const tvlData = filteredResponse.selected_farm[0].tvlStakedHistory.map(
        (stake: ITokenStats) => ({
          value: stake.value,
          date: new Date(stake.date),
        })
      );
      const baseAPR = filteredResponse.aprYearly;
      const aprData: ITokenStats[] = [];

      tvlData.reverse().forEach(({ date }: ITokenStats, i: number) => {
        aprData.push({ date, value: baseAPR + i * 10 });
      });
      console.log({ tvlData, aprData });

      setTokenStats({ tvlData, aprData });
    };

    fetchTokenStats();
  }, []);

  return tokenStats;
};

export default useGetTokenStats;
