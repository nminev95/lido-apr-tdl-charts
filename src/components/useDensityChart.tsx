import { useEffect, useRef } from "react";
import * as d3 from "d3";

const margin = { top: 30, right: 80, bottom: 30, left: 80 },
  width = 960 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const useDensityChart = (data: any) => {
  const svgRef = useRef<d3.Selection<
    SVGGElement,
    any,
    HTMLElement,
    any
  > | null>(null);
  const yAxisRef = useRef<d3.Selection<
    SVGGElement,
    any,
    HTMLElement,
    any
  > | null>(null);
  const xAxisRef = useRef<d3.Selection<
    SVGGElement,
    any,
    HTMLElement,
    any
  > | null>(null);
  console.log(data);
  const yAxisMaxValue: number = Math.max(
    ...data?.map(({ value }: any) => value)
  );
  const yAxisMinValue: number = Math.min(
    ...data?.map(({ value }: any) => value)
  );
  const dates = data?.map(({ date }: any) => date);
  const xAxisMinValue = Math.min(...dates);
  const xAxisMaxValue = Math.max(...dates);

  useEffect(() => {
    svgRef.current = d3
      .select(".density-chart-wrapper")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    yAxisRef.current = svgRef.current.append("g").attr("class", "yAxis");
    xAxisRef.current = svgRef.current.append("g").attr("class", "xAxis");
  }, []);

  useEffect(() => {
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
      .style("stop-color", "#DC4DFF") //end in red
      .style("stop-opacity", 0.1);

    // add second color
    gradient
      ?.append("stop")
      .attr("offset", "100%")
      .style("stop-color", "#4DBFFF") //start in blue
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
    xAxisRef.current
      ?.attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xAxis).ticks(10).tickSize(0));

    // visualize the data in y axis
    yAxisRef.current?.call(
      d3
        .axisLeft(yAxis)
        .ticks(5)
        .tickSize(0)
        .tickFormat((d: any) => {
          let formattedNumber = d;

          if (d / 1000000 >= 1) {
            formattedNumber = d / 1000000 + "M";
          }
          if (d / 1000000000 >= 1) {
            formattedNumber = d / 1000000000 + "B";
          }
          if (d / 1000000000000 >= 1) {
            formattedNumber = d / 1000000000000 + "T";
          }

          return formattedNumber;
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

    const density = data.map((dataSet: any) => [dataSet.date, dataSet.value]);

    const area = d3
      .area()
      .x(function (d) {
        return xAxis(d[0]);
      })
      .y0(height)
      .y1(function (d) {
        return yAxis(d[1]);
      });
    svgRef.current?.selectAll(".tick line").attr("stroke", "white");
    svgRef.current
      ?.append("path")
      .datum(density)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "url(#density-area-gradient)");
    // .attr("stroke-linecap", "round")
    // .attr("stroke-width", "2")
    // .attr("fill-opacity", "1");
  }, [data]);
};

export default useDensityChart;
