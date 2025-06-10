import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Import routing components
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import BarGraph from './components/BarGraph';
import PieChart from './components/PieChart';
import TvAndDigitalSpends from './components/TvAndDigitalSpends';
import InsightsPage from './components/InsightsPage'; 

function App() {
  const [filters, setFilters] = useState({
    currency: 'INR',
    currentStartDate: '2024-01-01',
    currentEndDate: '2024-12-31',
    prevStartDate: '2023-01-01',
    prevEndDate: '2023-12-31',
    brand: 'All',
    campaign: 'All'
  });

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-1 px-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <FilterBar filters={filters} setFilters={setFilters} />
                <Dashboard filters={filters} />
                <div className="my-8">
                  <BarGraph />
                </div>
                <div className="my-8">
                  <PieChart />
                </div>
                <div className="my-8">
                  <TvAndDigitalSpends />
                </div>
              </>
            }
          />
          <Route path="/insights" element={<InsightsPage />} /> 
        </Routes>
      </div>
    </div>
  );
}

export default App;
