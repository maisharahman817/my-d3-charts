import React from 'react';
import { 
  BarChartD3, 
  LineChartD3, 
  ScatterPlotD3, 
  PieChartD3, 
  AreaChartD3,
  HistogramD3,
  KDED3,
  RugPlotD3,
  BoxPlotD3,
  ViolinPlotD3,
  BeanPlotD3,
  DotPlotD3,
  StripPlotD3,
  StemAndLeafD3,
  ECDFD3,
  QQPlotD3,
  // New discrete charts
  DiscreteBarChartD3,
  DotChartD3,
  ParetoChartD3,
  FrequencyPolygonD3,
  DiscreteStemAndLeafD3,
  SpikePlotD3
} from './components/Charts';

const sampleBarData = [
  { name: 'A', value: 30 },
  { name: 'B', value: 80 },
  { name: 'C', value: 45 },
  { name: 'D', value: 60 },
];

const sampleXYData = [
  { x: 1, y: 10 },
  { x: 2, y: 30 },
  { x: 3, y: 20 },
  { x: 4, y: 60 },
];

const samplePieData = [
  { name: 'Apples', value: 10 },
  { name: 'Bananas', value: 20 },
  { name: 'Cherries', value: 30 },
];

// Generate sample data for distribution plots
const generateNormalData = (n = 100, mean = 0, std = 1) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    data.push(z0 * std + mean);
  }
  return data;
};

const sampleDistributionData = generateNormalData(100, 50, 15);
const sampleDistributionData2 = generateNormalData(100, 55, 12);

const sampleStemLeafData = [23, 25, 27, 31, 33, 35, 37, 42, 44, 46, 48, 51, 53, 55];

// Generate discrete data samples
const generateDiscreteData = () => {
  const data = [];
  const values = [1, 2, 3, 4, 5, 6];
  const weights = [0.1, 0.15, 0.25, 0.25, 0.15, 0.1]; // Probability weights
  
  for (let i = 0; i < 100; i++) {
    const rand = Math.random();
    let cumulative = 0;
    for (let j = 0; j < values.length; j++) {
      cumulative += weights[j];
      if (rand <= cumulative) {
        data.push(values[j]);
        break;
      }
    }
  }
  return data;
};

const generatePoissonData = (lambda = 3, n = 100) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    // Simple Poisson approximation
    let k = 0;
    let p = 1;
    const L = Math.exp(-lambda);
    
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    
    data.push(k - 1);
  }
  return data;
};

const sampleDiscreteData = generateDiscreteData();
const samplePoissonData = generatePoissonData(3, 80);
const sampleSmallRangeData = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>D3 Chart Components</h1>
      
      <h2>Continuous Data Charts</h2>
      
      <h3>Bar Chart</h3>
      <BarChartD3 data={sampleBarData} />

      <h3>Line Chart</h3>
      <LineChartD3 data={sampleXYData} />

      <h3>Scatter Plot</h3>
      <ScatterPlotD3 data={sampleXYData} />

      <h3>Pie Chart</h3>
      <PieChartD3 data={samplePieData} />

      <h3>Area Chart</h3>
      <AreaChartD3 data={sampleXYData} />

      <h3>Histogram</h3>
      <HistogramD3 data={sampleDistributionData} bins={20} />

      <h3>Kernel Density Estimate (KDE)</h3>
      <KDED3 data={sampleDistributionData} bandwidth={3} />

      <h3>Rug Plot</h3>
      <RugPlotD3 data={sampleDistributionData} />

      <h3>Box Plot</h3>
      <BoxPlotD3 data={sampleDistributionData} />

      <h3>Violin Plot</h3>
      <ViolinPlotD3 data={sampleDistributionData} bandwidth={3} />

      <h3>Bean Plot</h3>
      <BeanPlotD3 data={sampleDistributionData} bandwidth={3} />

      <h3>Dot Plot</h3>
      <DotPlotD3 data={sampleBarData} />

      <h3>Strip Plot</h3>
      <StripPlotD3 data={sampleDistributionData} />

      <h3>Stem-and-Leaf Plot</h3>
      <StemAndLeafD3 data={sampleStemLeafData} />

      <h3>ECDF (Empirical Cumulative Distribution Function)</h3>
      <ECDFD3 data={sampleDistributionData} />

      <h3>Q-Q Plot</h3>
      <QQPlotD3 data1={sampleDistributionData} data2={sampleDistributionData2} />

      <h2>Discrete (Integer-Valued) Data Charts</h2>

      <h3>Discrete Bar Chart of Counts</h3>
      <DiscreteBarChartD3 data={sampleDiscreteData} />

      <h3>Dot Chart (Lollipop Plot)</h3>
      <DotChartD3 data={sampleDiscreteData} />

      <h3>Pareto Chart (Bar + Cumulative Count Line)</h3>
      <ParetoChartD3 data={samplePoissonData} />

      <h3>Frequency Polygon</h3>
      <FrequencyPolygonD3 data={sampleDiscreteData} />

      <h3>Discrete Stem-and-Leaf Plot (Small Range)</h3>
      <DiscreteStemAndLeafD3 data={sampleSmallRangeData} />

      <h3>Spike Plot (Vertical Lines)</h3>
      <SpikePlotD3 data={sampleDiscreteData} />
    </div>
  );
}

export default App;