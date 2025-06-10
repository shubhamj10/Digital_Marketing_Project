import React from 'react';

function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 rounded-lg shadow mb-6">
      {/* Currency */}
      <div className="flex flex-col w-48 p-2 border rounded" style={{ backgroundColor: 'rgba(112, 199, 197, 0.5)', color: 'rgb(0, 0, 0)' }}>
        <label className="text-sm font-medium mb-1">Currency</label>
        <select name="currency" value={filters.currency} onChange={handleChange} className="border p-1 rounded bg-white">
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      {/* Current Start Date */}
      <div className="flex flex-col w-48 p-2 border rounded" style={{ backgroundColor: 'rgba(112, 199, 197, 0.5)', color: 'rgb(0, 0, 0)' }}>
        <label className="text-sm font-medium mb-1">Current Start Date</label>
        <input type="date" name="currentStartDate" value={filters.currentStartDate} onChange={handleChange} className="border p-1 rounded bg-white" />
      </div>

      {/* Current End Date */}
      <div className="flex flex-col w-48 p-2 border rounded" style={{ backgroundColor: 'rgba(112, 199, 197, 0.5)', color: 'rgb(0, 0, 0)' }}>
        <label className="text-sm font-medium mb-1">Current End Date</label>
        <input type="date" name="currentEndDate" value={filters.currentEndDate} onChange={handleChange} className="border p-1 rounded bg-white" />
      </div>

      {/* Previous Start Date */}
      <div className="flex flex-col w-48 p-2 border rounded" style={{ backgroundColor: 'rgba(112, 199, 197, 0.5)', color: 'rgb(0, 0, 0)' }}>
        <label className="text-sm font-medium mb-1">Prev Start Date</label>
        <input type="date" name="prevStartDate" value={filters.prevStartDate} onChange={handleChange} className="border p-1 rounded bg-white" />
      </div>

      {/* Previous End Date */}
      <div className="flex flex-col w-48 p-2 border rounded" style={{ backgroundColor: 'rgba(112, 199, 197, 0.5)', color: 'rgb(0, 0, 0)' }}>
        <label className="text-sm font-medium mb-1">Prev End Date</label>
        <input type="date" name="prevEndDate" value={filters.prevEndDate} onChange={handleChange} className="border p-1 rounded bg-white" />
      </div>

      {/* Brand */}
      <div className="flex flex-col w-48 p-2 border rounded" style={{ backgroundColor: 'rgba(112, 199, 197, 0.5)', color: 'rgb(0, 0, 0)' }}>
        <label className="text-sm font-medium mb-1">Brand</label>
        <select name="brand" value={filters.brand} onChange={handleChange} className="border p-1 rounded bg-white">
          <option value="All">All</option>
          <option value="Brand A">Brand A</option>
          <option value="Brand B">Brand B</option>
        </select>
      </div>

      {/* Campaign */}
      <div className="flex flex-col w-48 p-2 border rounded" style={{ backgroundColor: 'rgba(112, 199, 197, 0.5)', color: 'rgb(0, 0, 0)' }}>
        <label className="text-sm font-medium mb-1">Campaign</label>
        <select name="campaign" value={filters.campaign} onChange={handleChange} className="border p-1 rounded bg-white">
          <option value="All">All</option>
          <option value="Campaign X">Campaign X</option>
          <option value="Campaign Y">Campaign Y</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
