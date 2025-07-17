
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


// Histogram
export const HistogramD3 = ({ data, width = 500, height = 300, bins = 30 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const x = d3.scaleLinear()
      .domain(d3.extent(data)).nice()
      .range([margin.left, width - margin.right]);

    const histogram = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(bins));

    const binsData = histogram(data);
    const y = d3.scaleLinear()
      .domain([0, d3.max(binsData, d => d.length)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .selectAll('rect')
      .data(binsData)
      .join('rect')
      .attr('x', d => x(d.x0) + 1)
      .attr('y', d => y(d.length))
      .attr('width', d => x(d.x1) - x(d.x0) - 1)
      .attr('height', d => y(0) - y(d.length))
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

// Kernel Density Estimate (KDE)
export const KDED3 = ({ data, width = 500, height = 300, bandwidth = 1 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.scaleLinear()
      .domain(d3.extent(data)).nice()
      .range([margin.left, width - margin.right]);

    const kde = (kernel, thresholds, data) => {
      return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    };

    const kernelEpanechnikov = k => v => Math.abs(v /= k) <= 1 ? .75 * (1 - v * v) / k : 0;

    const xTicks = x.ticks(100);
    const density = kde(kernelEpanechnikov(bandwidth), xTicks, data);

    const y = d3.scaleLinear()
      .domain([0, d3.max(density, d => d[1])]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .curve(d3.curveBasis)
      .x(d => x(d[0]))
      .y(d => y(d[1]));

    svg.append('path')
      .datum(density)
      .attr('fill', 'none')
      .attr('stroke', 'darkred')
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

// Rug Plot
export const RugPlotD3 = ({ data, width = 500, height = 50 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 10, right: 30, bottom: 10, left: 40 };
    const x = d3.scaleLinear()
      .domain(d3.extent(data)).nice()
      .range([margin.left, width - margin.right]);

    svg.selectAll('line')
      .data(data)
      .join('line')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', 'black');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));
  }, [data]);

  return <svg ref={ref} width={width} height={height} />;
};

// Box Plot
export const BoxPlotD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = d3.quantile(sortedData, 0.25);
    const median = d3.quantile(sortedData, 0.5);
    const q3 = d3.quantile(sortedData, 0.75);
    const iqr = q3 - q1;
    const min = Math.max(d3.min(sortedData), q1 - 1.5 * iqr);
    const max = Math.min(d3.max(sortedData), q3 + 1.5 * iqr);
    
    const outliers = sortedData.filter(d => d < min || d > max);
    
    const y = d3.scaleLinear()
      .domain([d3.min(sortedData), d3.max(sortedData)]).nice()
      .range([height - margin.bottom, margin.top]);
    
    const boxWidth = 60;
    const centerX = width / 2;
    
    // Box
    svg.append('rect')
      .attr('x', centerX - boxWidth / 2)
      .attr('y', y(q3))
      .attr('width', boxWidth)
      .attr('height', y(q1) - y(q3))
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');
    
    // Median line
    svg.append('line')
      .attr('x1', centerX - boxWidth / 2)
      .attr('x2', centerX + boxWidth / 2)
      .attr('y1', y(median))
      .attr('y2', y(median))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
    
    // Whiskers
    svg.append('line')
      .attr('x1', centerX)
      .attr('x2', centerX)
      .attr('y1', y(q1))
      .attr('y2', y(min))
      .attr('stroke', 'black');
    
    svg.append('line')
      .attr('x1', centerX)
      .attr('x2', centerX)
      .attr('y1', y(q3))
      .attr('y2', y(max))
      .attr('stroke', 'black');
    
    // Whisker caps
    svg.append('line')
      .attr('x1', centerX - 10)
      .attr('x2', centerX + 10)
      .attr('y1', y(min))
      .attr('y2', y(min))
      .attr('stroke', 'black');
    
    svg.append('line')
      .attr('x1', centerX - 10)
      .attr('x2', centerX + 10)
      .attr('y1', y(max))
      .attr('y2', y(max))
      .attr('stroke', 'black');
    
    // Outliers
    svg.selectAll('circle')
      .data(outliers)
      .join('circle')
      .attr('cx', centerX)
      .attr('cy', d => y(d))
      .attr('r', 3)
      .attr('fill', 'red');
    
    // Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Violin Plot
export const ViolinPlotD3 = ({ data, width = 500, height = 300, bandwidth = 1 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const y = d3.scaleLinear()
      .domain(d3.extent(data)).nice()
      .range([height - margin.bottom, margin.top]);
    
    const kde = (kernel, thresholds, data) => {
      return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    };
    
    const kernelEpanechnikov = k => v => Math.abs(v /= k) <= 1 ? .75 * (1 - v * v) / k : 0;
    
    const yTicks = y.ticks(100);
    const density = kde(kernelEpanechnikov(bandwidth), yTicks, data);
    
    const maxDensity = d3.max(density, d => d[1]);
    const x = d3.scaleLinear()
      .domain([0, maxDensity])
      .range([0, 100]);
    
    const centerX = width / 2;
    
    const area = d3.area()
      .y(d => y(d[0]))
      .x0(d => centerX - x(d[1]))
      .x1(d => centerX + x(d[1]))
      .curve(d3.curveBasis);
    
    svg.append('path')
      .datum(density)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black')
      .attr('d', area);
    
    // Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Bean Plot (combination of violin and rug plot)
export const BeanPlotD3 = ({ data, width = 500, height = 300, bandwidth = 1 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const y = d3.scaleLinear()
      .domain(d3.extent(data)).nice()
      .range([height - margin.bottom, margin.top]);
    
    const kde = (kernel, thresholds, data) => {
      return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    };
    
    const kernelEpanechnikov = k => v => Math.abs(v /= k) <= 1 ? .75 * (1 - v * v) / k : 0;
    
    const yTicks = y.ticks(100);
    const density = kde(kernelEpanechnikov(bandwidth), yTicks, data);
    
    const maxDensity = d3.max(density, d => d[1]);
    const x = d3.scaleLinear()
      .domain([0, maxDensity])
      .range([0, 50]);
    
    const centerX = width / 2;
    
    // Violin shape
    const area = d3.area()
      .y(d => y(d[0]))
      .x0(d => centerX - x(d[1]))
      .x1(d => centerX + x(d[1]))
      .curve(d3.curveBasis);
    
    svg.append('path')
      .datum(density)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .attr('d', area);
    
    // Individual data points (beans)
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', centerX)
      .attr('cy', d => y(d))
      .attr('r', 2)
      .attr('fill', 'darkblue')
      .attr('opacity', 0.7);
    
    // Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Dot Plot
export const DotPlotD3 = ({ data, width = 500, height = 300 }) => {
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
    
    // Lines from axis to dots
    svg.selectAll('line')
      .data(data)
      .join('line')
      .attr('x1', d => x(d.name) + x.bandwidth() / 2)
      .attr('x2', d => x(d.name) + x.bandwidth() / 2)
      .attr('y1', height - margin.bottom)
      .attr('y2', d => y(d.value))
      .attr('stroke', 'gray')
      .attr('stroke-width', 1);
    
    // Dots
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.name) + x.bandwidth() / 2)
      .attr('cy', d => y(d.value))
      .attr('r', 5)
      .attr('fill', 'steelblue');
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Strip Plot
export const StripPlotD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const y = d3.scaleLinear()
      .domain(d3.extent(data)).nice()
      .range([height - margin.bottom, margin.top]);
    
    const centerX = width / 2;
    const jitterWidth = 40;
    
    // Add jitter to x position
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', () => centerX + (Math.random() - 0.5) * jitterWidth)
      .attr('cy', d => y(d))
      .attr('r', 3)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.7);
    
    // Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Stem-and-Leaf Plot (text-based approximation)
export const StemAndLeafD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const processedData = data.map(d => Math.floor(d)).sort((a, b) => a - b);
    
    const stemLeafData = {};
    processedData.forEach(value => {
      const stem = Math.floor(value / 10);
      const leaf = value % 10;
      if (!stemLeafData[stem]) {
        stemLeafData[stem] = [];
      }
      stemLeafData[stem].push(leaf);
    });
    
    const stems = Object.keys(stemLeafData).sort((a, b) => a - b);
    const lineHeight = 20;
    
    stems.forEach((stem, i) => {
      const leaves = stemLeafData[stem].sort((a, b) => a - b);
      const text = `${stem} | ${leaves.join(' ')}`;
      
      svg.append('text')
        .attr('x', margin.left)
        .attr('y', margin.top + (i + 1) * lineHeight)
        .attr('font-family', 'monospace')
        .attr('font-size', '14px')
        .text(text);
    });
    
    // Title
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top - 5)
      .attr('font-family', 'monospace')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('Stem | Leaf');
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// ECDF (Empirical Cumulative Distribution Function)
export const ECDFD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const sortedData = [...data].sort((a, b) => a - b);
    const ecdfData = sortedData.map((value, i) => ({
      x: value,
      y: (i + 1) / sortedData.length
    }));
    
    const x = d3.scaleLinear()
      .domain(d3.extent(sortedData))
      .range([margin.left, width - margin.right]);
    
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);
    
    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveStepAfter);
    
    svg.append('path')
      .datum(ecdfData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Q-Q Plot
export const QQPlotD3 = ({ data1, data2, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const sorted1 = [...data1].sort((a, b) => a - b);
    const sorted2 = [...data2].sort((a, b) => a - b);
    
    const n = Math.min(sorted1.length, sorted2.length);
    const qqData = [];
    
    for (let i = 0; i < n; i++) {
      const quantile = (i + 0.5) / n;
      const q1 = d3.quantile(sorted1, quantile);
      const q2 = d3.quantile(sorted2, quantile);
      qqData.push({ x: q1, y: q2 });
    }
    
    const x = d3.scaleLinear()
      .domain(d3.extent(qqData, d => d.x))
      .range([margin.left, width - margin.right]);
    
    const y = d3.scaleLinear()
      .domain(d3.extent(qqData, d => d.y))
      .range([height - margin.bottom, margin.top]);
    
    // Reference line (y = x)
    const xDomain = x.domain();
    const yDomain = y.domain();
    const minVal = Math.max(xDomain[0], yDomain[0]);
    const maxVal = Math.min(xDomain[1], yDomain[1]);
    
    svg.append('line')
      .attr('x1', x(minVal))
      .attr('x2', x(maxVal))
      .attr('y1', y(minVal))
      .attr('y2', y(maxVal))
      .attr('stroke', 'red')
      .attr('stroke-dasharray', '5,5');
    
    // Q-Q points
    svg.selectAll('circle')
      .data(qqData)
      .join('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 3)
      .attr('fill', 'steelblue');
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data1, data2]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Bar Chart of Counts (for discrete data)
export const DiscreteBarChartD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    // Count frequencies
    const counts = {};
    data.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    const countData = Object.entries(counts)
      .map(([value, count]) => ({ value: +value, count }))
      .sort((a, b) => a.value - b.value);
    
    const x = d3.scaleBand()
      .domain(countData.map(d => d.value))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(countData, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);
    
    // Bars
    svg.append('g')
      .selectAll('rect')
      .data(countData)
      .join('rect')
      .attr('x', d => x(d.value))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.count))
      .attr('fill', 'steelblue');
    
    // Count labels on bars
    svg.append('g')
      .selectAll('text')
      .data(countData)
      .join('text')
      .attr('x', d => x(d.value) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.count);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Dot Chart (Lollipop Plot) for discrete data
export const DotChartD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    // Count frequencies
    const counts = {};
    data.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    const countData = Object.entries(counts)
      .map(([value, count]) => ({ value: +value, count }))
      .sort((a, b) => a.value - b.value);
    
    const x = d3.scaleBand()
      .domain(countData.map(d => d.value))
      .range([margin.left, width - margin.right])
      .padding(0.3);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(countData, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);
    
    // Stems (lines)
    svg.append('g')
      .selectAll('line')
      .data(countData)
      .join('line')
      .attr('x1', d => x(d.value) + x.bandwidth() / 2)
      .attr('x2', d => x(d.value) + x.bandwidth() / 2)
      .attr('y1', height - margin.bottom)
      .attr('y2', d => y(d.count))
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2);
    
    // Dots
    svg.append('g')
      .selectAll('circle')
      .data(countData)
      .join('circle')
      .attr('cx', d => x(d.value) + x.bandwidth() / 2)
      .attr('cy', d => y(d.count))
      .attr('r', 6)
      .attr('fill', 'steelblue');
    
    // Count labels
    svg.append('g')
      .selectAll('text')
      .data(countData)
      .join('text')
      .attr('x', d => x(d.value) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.count);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Pareto Chart (Bar + Cumulative Count Line)
export const ParetoChartD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 60, bottom: 30, left: 40 };
    
    // Count frequencies
    const counts = {};
    data.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    const countData = Object.entries(counts)
      .map(([value, count]) => ({ value: +value, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
    
    // Calculate cumulative counts
    let cumulative = 0;
    countData.forEach(d => {
      cumulative += d.count;
      d.cumulative = cumulative;
    });
    
    const totalCount = cumulative;
    
    const x = d3.scaleBand()
      .domain(countData.map(d => d.value))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(countData, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);
    
    const y2 = d3.scaleLinear()
      .domain([0, totalCount])
      .range([height - margin.bottom, margin.top]);
    
    // Bars
    svg.append('g')
      .selectAll('rect')
      .data(countData)
      .join('rect')
      .attr('x', d => x(d.value))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.count))
      .attr('fill', 'steelblue')
      .attr('opacity', 0.7);
    
    // Cumulative line
    const line = d3.line()
      .x(d => x(d.value) + x.bandwidth() / 2)
      .y(d => y2(d.cumulative));
    
    svg.append('path')
      .datum(countData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Cumulative points
    svg.append('g')
      .selectAll('circle')
      .data(countData)
      .join('circle')
      .attr('cx', d => x(d.value) + x.bandwidth() / 2)
      .attr('cy', d => y2(d.cumulative))
      .attr('r', 4)
      .attr('fill', 'red');
    
    // Left Y-axis (counts)
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
    // Right Y-axis (cumulative)
    svg.append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisRight(y2));
    
    // X-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    
    // Y-axis labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Count');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', width - 15)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Cumulative');
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Frequency Polygon
export const FrequencyPolygonD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    // Count frequencies
    const counts = {};
    data.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    const countData = Object.entries(counts)
      .map(([value, count]) => ({ value: +value, count }))
      .sort((a, b) => a.value - b.value);
    
    const x = d3.scaleLinear()
      .domain(d3.extent(countData, d => d.value))
      .range([margin.left, width - margin.right]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(countData, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);
    
    // Line
    const line = d3.line()
      .x(d => x(d.value))
      .y(d => y(d.count));
    
    svg.append('path')
      .datum(countData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Points
    svg.append('g')
      .selectAll('circle')
      .data(countData)
      .join('circle')
      .attr('cx', d => x(d.value))
      .attr('cy', d => y(d.count))
      .attr('r', 4)
      .attr('fill', 'steelblue');
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Discrete Stem-and-Leaf Plot (optimized for small ranges)
export const DiscreteStemAndLeafD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const sortedData = [...data].sort((a, b) => a - b);
    
    // Determine appropriate stem unit
    const range = d3.max(sortedData) - d3.min(sortedData);
    const stemUnit = range <= 100 ? 10 : range <= 1000 ? 100 : 1000;
    
    const stemLeafData = {};
    sortedData.forEach(value => {
      const stem = Math.floor(value / stemUnit);
      const leaf = value % stemUnit;
      if (!stemLeafData[stem]) {
        stemLeafData[stem] = [];
      }
      stemLeafData[stem].push(leaf);
    });
    
    const stems = Object.keys(stemLeafData).sort((a, b) => a - b);
    const lineHeight = 20;
    
    // Title with unit explanation
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top - 5)
      .attr('font-family', 'monospace')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(`Stem | Leaf (unit: ${stemUnit})`);
    
    stems.forEach((stem, i) => {
      const leaves = stemLeafData[stem].sort((a, b) => a - b);
      const text = `${stem} | ${leaves.join(' ')}`;
      
      svg.append('text')
        .attr('x', margin.left)
        .attr('y', margin.top + (i + 1) * lineHeight + 10)
        .attr('font-family', 'monospace')
        .attr('font-size', '14px')
        .text(text);
    });
    
    // Add count information
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top + (stems.length + 2) * lineHeight + 10)
      .attr('font-family', 'monospace')
      .attr('font-size', '12px')
      .attr('fill', 'gray')
      .text(`n = ${sortedData.length}`);
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};

// Spike Plot (Vertical lines at each value)
export const SpikePlotD3 = ({ data, width = 500, height = 300 }) => {
  const ref = useD3((svg) => {
    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    // Count frequencies
    const counts = {};
    data.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    const countData = Object.entries(counts)
      .map(([value, count]) => ({ value: +value, count }))
      .sort((a, b) => a.value - b.value);
    
    const x = d3.scaleLinear()
      .domain(d3.extent(countData, d => d.value))
      .range([margin.left, width - margin.right]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(countData, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);
    
    // Spikes (vertical lines)
    svg.append('g')
      .selectAll('line')
      .data(countData)
      .join('line')
      .attr('x1', d => x(d.value))
      .attr('x2', d => x(d.value))
      .attr('y1', height - margin.bottom)
      .attr('y2', d => y(d.count))
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 3);
    
    // Optional: Add dots at the top of spikes
    svg.append('g')
      .selectAll('circle')
      .data(countData)
      .join('circle')
      .attr('cx', d => x(d.value))
      .attr('cy', d => y(d.count))
      .attr('r', 3)
      .attr('fill', 'steelblue');
    
    // Count labels
    svg.append('g')
      .selectAll('text')
      .data(countData)
      .join('text')
      .attr('x', d => x(d.value))
      .attr('y', d => y(d.count) - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text(d => d.count);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
  }, [data]);
  
  return <svg ref={ref} width={width} height={height} />;
};