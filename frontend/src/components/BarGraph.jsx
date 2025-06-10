import React, { useEffect, useState } from 'react';
import SalesChart from './SalesChart';

function BarGraph() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/sales-data`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setChartData(jsonData);  // Set the data to state
      } catch (error) {
        console.error('Error loading Excel data:', error);
      }
    };

    fetchExcelData();
  }, []);  // Fetch data once when the component mounts

  return (
    <div>
      <div className="flex gap-4 mt-8">
        <div className="flex-1">
          <SalesChart dataFromExcel={chartData} />
        </div>
        <div className="flex-1">
          <SalesChart dataFromExcel={chartData} />
        </div>
      </div>
    </div>
  );
}

export default BarGraph;
