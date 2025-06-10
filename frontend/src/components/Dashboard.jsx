import React, { useState } from 'react';
import DataCard from './DataCard';

function Dashboard({ filters }) {
  const [selectedCard, setSelectedCard] = useState(null);

  const data = {
    sales: { totalVolume: '164.63 Cr', pp: '219.28 Cr', change: '-24.92%' },
    digitalCampaign: { totalCampaign: 311, pp: 231, change: '34.63%' },
    digitalSpends: { spends: '1,958.26 Cr', pp: '2,174.63 Cr', change: '-9.95%' },
    tvGRPs: { grps: '77.18K', pp: '74.98K', change: '2.93%' },
    tvSpends: { spends: '11.16 Cr', pp: '12.92 Cr', change: '-13.66%' },
    videos: { total: 46, pp: 43, change: '6.98%' },
    views: { total: '12,915.21 Cr', pp: '7,372.74 Cr', change: '75.18%' },
    tvImpressions: { total: '208.91B', pp: '184.45B', change: '13.26%' },
    digitalImpressions: { total: '29,784.71 Cr', pp: '34,815.23 Cr', change: '-14.45%' },
    totalNumber: { total: '311', pp: '231', change: '34.63%' },
  };

  const openPopup = (title, value, pp, change) => {
    setSelectedCard({ title, value, pp, change });
  };

  const closePopup = () => {
    setSelectedCard(null);
  };

  return (
    <div className="space-y-4 min-h-[70vh]" style={{ backgroundColor: '#f9fafb' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="border-[1.5px] p-4 rounded text-center font-bold bg-white" style={{ borderColor: 'rgba(112, 199, 197, 0.5)' }}>Sales</div>
        <div className="border-[1.5px] p-4 rounded text-center font-bold bg-white" style={{ borderColor: 'rgba(112, 199, 197, 0.5)' }}>Digital Campaign</div>
        <div className="border-[1.5px] p-4 rounded text-center font-bold bg-white" style={{ borderColor: 'rgba(112, 199, 197, 0.5)' }}>TV Campaign</div>
        <div className="border-[1.5px] p-4 rounded text-center font-bold bg-white" style={{ borderColor: 'rgba(112, 199, 197, 0.5)' }}>Statistics</div>
        <div className="border-[1.5px] p-4 rounded text-center font-bold bg-white" style={{ borderColor: 'rgba(112, 199, 197, 0.5)' }}>India Level</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            onClick={() => {
              const titleMap = {
                sales: 'Total Volume',
                digitalCampaign: 'Total Campaign',
                digitalSpends: 'Total Spends (Digital)',
                tvGRPs: 'GRPs (TV)',
                tvSpends: 'Spends (TV)',
                videos: 'Total Videos',
                views: 'Total Views',
                tvImpressions: 'TV Impressions',
                digitalImpressions: 'Digital Impressions',
                totalNumber: 'Total Number',
              };
              openPopup(
                titleMap[key],
                Object.values(value)[0],
                value.pp,
                value.change
              );
            }}
          >
            <DataCard
              title={
                {
                  sales: 'Total Volume',
                  digitalCampaign: 'Total Campaign',
                  digitalSpends: 'Total Spends (Digital)',
                  tvGRPs: 'GRPs (TV)',
                  tvSpends: 'Spends (TV)',
                  videos: 'Total Videos',
                  views: 'Total Views',
                  tvImpressions: 'TV Impressions',
                  digitalImpressions: 'Digital Impressions',
                  totalNumber: 'Total Number',
                }[key]
              }
              value={Object.values(value)[0]}
              pp={value.pp}
              change={value.change}
            />
          </div>
        ))}
      </div>

      {selectedCard && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div className="absolute inset-0 backdrop-blur-md z-40"></div>

          <div
            className="relative flex flex-col items-center justify-center p-10 rounded-2xl text-center space-y-6 shadow-2xl w-[95%] md:w-[95%] max-w-6xl h-[70%] max-h-[80%] overflow-auto z-50"
            style={{ backgroundColor: '#FBFBFB', border: '1.5px solid rgba(112, 199, 197, 0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-3xl text-black hover:text-gray-800"
            >
              &times;
            </button>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-3xl font-bold text-black">{selectedCard.title}</div>
              <div className="text-2xl text-black">{selectedCard.value}</div>
              <div className="text-lg text-black">PP: {selectedCard.pp}</div>
              <div
                className={`text-xl font-medium ${selectedCard.change.startsWith('-') ? 'text-red-600' : 'text-green-700'
                  }`}
              >
                {selectedCard.change}
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default Dashboard;