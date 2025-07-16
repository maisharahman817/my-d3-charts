
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import useMeasure from 'react-use-measure';

const useD3 = (renderChartFn, dependencies) => {
  const ref = useRef();
  useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => {};
  }, dependencies);
  return ref;
};

export const BarChartD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={ref} width={width} height={height} />;
};

export const LineChartD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={ref} width={width} height={height} />;
};

export const ScatterPlotD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 4)
      .attr('fill', 'darkorange');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={ref} width={width} height={height} />;
};

export const PieChartD3 = ({ data, width = 400, height = 400 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const radius = Math.min(width, height) / 2;
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arcs = g.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));
  }, [data]);

  return <svg ref={ref} width={width} height={height} />;
};

export const AreaChartD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height - margin.bottom, margin.top]);

    const area = d3.area()
      .x(d => x(d.x))
      .y0(height - margin.bottom)
      .y1(d => y(d.y));

    svg.append('path')
      .datum(data)
      .attr('fill', 'lightblue')
      .attr('d', area);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={ref} width={width} height={height} />;
};
