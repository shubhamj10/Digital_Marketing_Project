import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelReader({ onDataLoaded }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });

      // Assuming first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      onDataLoaded(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="my-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
}

export default ExcelReader;
