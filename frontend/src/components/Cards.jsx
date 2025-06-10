// DataCard.jsx
import React from 'react'
const Cards = ({ title, value }) => {
    return (
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };
  
  export default Cards;
 