import DensityChart from "../../components/DensityChart";
import useGetTokenStats from "../../hooks/useGetTokenStats";
import "./LiquidityPairStatsView.scss";

const LiquidityPairStatsView = () => {
  const tokenStats = useGetTokenStats();

  return (
    <div className="liquidity-pair-stats-view">
      <div className="stats-header">LIDO-LUNA LP Stats</div>
      <div className="charts-wrapper">
        {Object.values(tokenStats.aprData).length && (
          <DensityChart data={tokenStats.aprData} type="APR" />
        )}
        {Object.values(tokenStats.tvlData).length && (
          <DensityChart data={tokenStats.tvlData} type="TVL" />
        )}
      </div>
    </div>
  );
};

export default LiquidityPairStatsView;
