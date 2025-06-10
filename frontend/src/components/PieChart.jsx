import React, { useEffect, useState } from 'react';
import PieData from './PieData';
import DataCard from './Cards';

function PieChart() {
  const [generalData, setGeneralData] = useState([]);
  const [digitalData, setDigitalData] = useState([]);

  useEffect(() => {
    // Fetch general spends
    fetch('http://localhost:5000/data/piechart-general-spends')
      .then(res => res.json())
      .then(data => setGeneralData(data))
      .catch(err => console.error('General data error:', err));

    // Fetch digital spends
    fetch('http://localhost:5000/data/piechart-digital-spends')
      .then(res => res.json())
      .then(data => setDigitalData(data))
      .catch(err => console.error('Digital data error:', err));
  }, []);

  const extractLabels = (data) => data.map(item => item.Label);
  const extractValues = (data) => data.map(item => parseFloat(item.Value));

  const generalColors = ['#A0C7D5', '#A3CED5', '#A1D3D3', '#CDEDED'];
  const digitalColors = ['#34D399', '#10B981', '#059669', '#047857'];

  return (
    <div>
      {/* Data Cards */}
      <div
        className="grid gap-6 mt-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}
      >
        <DataCard title="Total Spends(in INR)" value="76.46B" />
        <DataCard title="TV Total Impressions" value="668.03B" />
        <DataCard title="Digital Total Impressions" value="113.52B" />
        <DataCard title="Total Volume in Unit Cases" value="3.84B" />
      </div>

      {/* Pie Charts */}
      <div className="flex flex-wrap gap-4 mt-8">
        {generalData.length > 0 && (
          <div className="flex-1 min-w-[350px]">
            <PieData
              title="General Spend Distribution"
              labels={extractLabels(generalData)}
              values={extractValues(generalData)}
              colors={generalColors}
              excelFile="Distribution of Spends (in INR) as per Month & Brand Selection.csv"
            />
          </div>
        )}
        {digitalData.length > 0 && (
          <div className="flex-1 min-w-[350px]">
            <PieData
              title="Digital Spend Distribution"
              labels={extractLabels(digitalData)}
              values={extractValues(digitalData)}
              colors={digitalColors}
              excelFile="Distribution of Other Digital Spends (in INR) as per Month & Brand Selection.csv"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PieChart;