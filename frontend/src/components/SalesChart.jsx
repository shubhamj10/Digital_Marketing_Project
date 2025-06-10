import React, { useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip);

function SalesChart({ dataFromExcel }) {
  const chartRef = useRef(null);

  if (!dataFromExcel) {
    return <div className="text-center p-8">Loading chart data...</div>;
  }

  const labels = dataFromExcel.map(item => item.Month);

  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Volume (M)',
        data: dataFromExcel.map(item => item['Volume (M)']),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        yAxisID: 'yVolume',
      },
      {
        type: 'line',
        label: 'Value (B)',
        data: dataFromExcel.map(item => item['Value (B)']),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        yAxisID: 'yValue',
      }
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    stacked: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            if (datasetLabel.includes('Volume')) {
              return `${datasetLabel}: ${value}M`;
            } else if (datasetLabel.includes('Value')) {
              return `${datasetLabel}: ${value}B`;
            }
            return `${value}`;
          },
          filter: function (tooltipItem) {
            const activeDatasetIndex = tooltipItem.chart.getActiveElements()[0]?.datasetIndex;
            return tooltipItem.datasetIndex === activeDatasetIndex;
          }
        }
      },
    },
    scales: {
      yValue: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 80,
        ticks: {
          callback: (value) => `${value}B`,
          stepSize: 20,
        },
        title: {
          display: true,
          text: 'Sales Value',
        },
      },
      yVolume: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 320,
        ticks: {
          callback: (value) => `${value}M`,
          stepSize: 80,
        },
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Sales Volume in unit cases',
        },
      },
    },
    onHover: (event, elements) => {
      const chart = chartRef.current;

      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        chart.data.datasets.forEach((dataset, index) => {
          if (datasetIndex === index) {
            if (dataset.type === 'bar') {
              dataset.backgroundColor = 'rgba(54, 162, 235, 0.6)';
            } else if (dataset.type === 'line') {
              dataset.borderColor = 'rgba(255, 99, 132, 1)';
              dataset.pointBackgroundColor = 'rgba(255, 99, 132, 1)';
            }
          } else {
            // Dim inactive datasets (black and white)
            if (dataset.type === 'bar') {
              dataset.backgroundColor = 'rgba(200, 200, 200, 0.3)';
            } else if (dataset.type === 'line') {
              dataset.borderColor = 'rgba(150, 150, 150, 0.5)';
              dataset.pointBackgroundColor = 'rgba(150, 150, 150, 0.5)';
            }
          }
        });
        chart.update();
      } else {
        // Reset all colors when not hovering
        chart.data.datasets.forEach((dataset) => {
          if (dataset.type === 'bar') {
            dataset.backgroundColor = 'rgba(54, 162, 235, 0.6)';
          } else if (dataset.type === 'line') {
            dataset.borderColor = 'rgba(255, 99, 132, 1)';
            dataset.pointBackgroundColor = 'rgba(255, 99, 132, 1)';
          }
        });
        chart.update();
      }
    },
  };

  return <Bar ref={chartRef} data={data} options={options} />;
}

export default SalesChart;
