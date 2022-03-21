import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { largeNumberFormatter, percentageFormatter } from "../helpers/helpers";
import { ITokenStats } from "../models/models";

const margin = { top: 50, right: 90, bottom: 50, left: 90 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const chartHeaderPadding = 15;

const useDensityChart = (data: ITokenStats[], type: string) => {
  const svgRef = useRef<d3.Selection<
    SVGGElement,
    any,
    HTMLElement,
    any
  > | null>(null);
  const yAxisRef = useRef<d3.Selection<
    SVGGElement,
    Number,
    HTMLElement,
    any
  > | null>(null);
  const xAxisRef = useRef<d3.Selection<
    SVGGElement,
    Date,
    HTMLElement,
    any
  > | null>(null);

  // map values in array
  const values = data?.map(({ value }) => value);
  // map dates in array
  const dates = data?.map(({ date }) => date);
  // create density array
  const density = data.map(({ date, value }) => [date, value]);

  const yAxisMaxValue: number = Math.max(...values);
  const yAxisMinValue: number = Math.min(...values);
  const xAxisMinValue = Math.min(...(dates as any));
  const xAxisMaxValue = Math.max(...(dates as any));

  useEffect(() => {
    svgRef.current = d3
      .select(`.density-chart-wrapper-${type}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    yAxisRef.current = svgRef.current.append("g").attr("class", "yAxis");
    xAxisRef.current = svgRef.current.append("g").attr("class", "xAxis");
  }, []);

  useEffect(() => {
    // append chart header
    svgRef.current
      ?.append("text")
      .text(`Asset ${type}`)
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", -chartHeaderPadding)
      .attr("fill", "white")
      .style("font-weight", "bold")
      .style("letter-spacing", "1px");

    // create gradient for fill
    const gradient = svgRef.current
      ?.append("defs")
      .append("linearGradient")
      .attr("id", "density-area-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    // add first color
    gradient
      ?.append("stop")
      .attr("offset", "0%")
      .style("stop-color", "#DC4DFF")
      .style("stop-opacity", 0.1);

    // add second color
    gradient
      ?.append("stop")
      .attr("offset", "100%")
      .style("stop-color", "#4DBFFF")
      .style("stop-opacity", 0.3);

    // add the xAxis
    const xAxis = d3
      .scaleTime()
      .domain([xAxisMinValue, xAxisMaxValue])
      .range([0, width]);

    // add the y Axis
    const yAxis = d3
      .scaleLinear()
      .domain([yAxisMinValue, yAxisMaxValue])
      .range([height, 0]);

    // visualize the data in x axis
    xAxisRef.current?.attr("transform", "translate(0," + height + ")").call(
      d3
        .axisBottom(xAxis)
        .ticks(10)
        .tickSize(0)
        .tickPadding(15)
        .tickFormat((d) => {
          const timeFormatter = d3.timeFormat("%b %d");
          return timeFormatter(d as Date);
        })
    );

    // visualize the data in y axis
    yAxisRef.current?.call(
      d3
        .axisLeft(yAxis)
        .ticks(5)
        .tickSize(0)
        .tickPadding(15)
        .tickFormat((d) => {
          if (type === "TVL") {
            return largeNumberFormatter(d as number);
          }
          return percentageFormatter(d as number);
        })
    );

    // add vertical gridlines
    d3.selectAll("g.yAxis g.tick")
      .append("line")
      .attr("class", "gridline")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0);

    // add horizontal gridlines
    d3.selectAll("g.xAxis g.tick")
      .append("line")
      .attr("class", "gridline")
      .attr("x1", 0)
      .attr("y1", -height)
      .attr("x2", 0)
      .attr("y2", 0);

    // create the density line
    const densityLine = d3
      .line()
      .x(function (d) {
        return xAxis(d[0]);
      })
      .y(function (d) {
        return yAxis(d[1]);
      });

    // create the density area
    const densityArea = d3
      .area()
      .x((d) => {
        return xAxis(d[0]);
      })
      .y0(height)
      .y1((d) => {
        return yAxis(d[1]);
      });

    // append density area
    svgRef.current
      ?.append("path")
      .datum(density)
      .attr("class", "density-area")
      .style("fill", "url(#density-area-gradient)")
      .attr("d", densityArea as any);

    // append density line
    svgRef.current
      ?.append("path")
      .datum(density)
      .attr("stroke", "#D733FF")
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .attr("class", "density-line")
      .attr("stroke-linecap", "round")
      .attr("d", densityLine as any);
  }, [data]);
};

export default useDensityChart;
