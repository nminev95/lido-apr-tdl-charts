import "./DensityChart.scss";
import useDensityChart from "./useDensityChart";
import useGetTokenStats from "./useGetTokenStats";

const DensityChart = () => {
  const tokenStats = useGetTokenStats();
  console.log(tokenStats);

  useDensityChart(tokenStats.tvlData);

  return <div className="density-chart-wrapper"></div>;
};

export default DensityChart;
