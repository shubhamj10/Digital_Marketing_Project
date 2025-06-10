import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieData = ({ title, labels, values, colors,excelFile }) => {
  const navigate = useNavigate();
  const total = values.reduce((acc, val) => acc + val, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const handleInsightsClick = () => {
    navigate('/insights', {
      state: {
        title,
        labels,
        values,
        excelFile, 
      },
    });
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg w-full mx-auto h-[450px] flex flex-col justify-between">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <div className="flex items-start gap-4 flex-1 overflow-hidden">
        <div className="w-52 h-52 flex-shrink-0">
          <Doughnut data={data} options={options} />
        </div>

        <div className="w-1/3 ml-auto overflow-y-auto max-h-[200px]">
          <table className="table-auto w-full text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label, index) => (
                <tr key={index}>
                  <td className="px-2 py-1">{label}</td>
                  <td className="px-2 py-1 text-right">
                    {((values[index] / total) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          onClick={handleInsightsClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Get AI Insights
        </button>
      </div>
    </div>
  );
};

export default PieData;
