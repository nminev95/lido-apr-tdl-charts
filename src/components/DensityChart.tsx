import "./DensityChart.scss";
import useDensityChart from "../hooks/useDensityChart";
import { ITokenStats } from "../models/models";

type ComponentProps = {
  data: ITokenStats[];
  type: string;
};

const DensityChart = (props: ComponentProps) => {
  const { data, type } = props;
  useDensityChart(data, type);

  return <div className={`density-chart-wrapper-${type}`}></div>;
};

export default DensityChart;
