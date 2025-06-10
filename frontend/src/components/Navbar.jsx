import React from 'react';

function Navbar() {
  return (
    <nav style={{ backgroundColor: 'rgb(137, 137, 137)', color: 'rgb(255, 255, 255)' }} className="p-4">
      <div className="flex items-center space-x-20">
        <span className="text-xl font-bold">Demo App</span>
        <a href="#" className="hover:underline text-sm font-medium">Executive Summary</a>
        <a href="#" className="hover:underline text-sm font-medium">Planned V/S Delivered</a>
        <a href="#" className="hover:underline text-sm font-medium">Digital Paid Campaigns</a>
        <a href="#" className="hover:underline text-sm font-medium">Video Analytics</a>
        <a href="#" className="hover:underline text-sm font-medium">Rate Analysis Digital</a>
        <a href="#" className="hover:underline text-sm font-medium">More</a>
      </div>
    </nav>
  );
}

export default Navbar;
