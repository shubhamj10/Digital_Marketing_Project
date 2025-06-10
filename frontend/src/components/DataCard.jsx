import React from 'react';

function DataCard({ title, value, pp, change }) {
  const isPositive = change ? !change.includes('-') : true;
  const color = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full h-[180px] flex flex-col justify-center items-center text-center overflow-hidden">
      <h2 className="text-lg font-semibold mb-1 break-words">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
      {pp && <p className="text-sm text-gray-500">PP: {pp}</p>}
      {change && <p className={`text-sm font-semibold ${color}`}>{change}</p>}
    </div>
  );
}

export default DataCard;
