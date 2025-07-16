import React from 'react';
import { BarChartD3, LineChartD3, ScatterPlotD3, PieChartD3, AreaChartD3 } from './components/Charts';

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

function App() {
  return (
    <div>
      <h2>Bar Chart</h2>
      <BarChartD3 data={sampleBarData} />

      <h2>Line Chart</h2>
      <LineChartD3 data={sampleXYData} />

      <h2>Scatter Plot</h2>
      <ScatterPlotD3 data={sampleXYData} />

      <h2>Pie Chart</h2>
      <PieChartD3 data={samplePieData} />

      <h2>Area Chart</h2>
      <AreaChartD3 data={sampleXYData} />
    </div>
  );
}

export default App;