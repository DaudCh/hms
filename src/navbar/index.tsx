import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="h-20 fixed top-0 bg-blue-500 w-full flex justify-between items-center px-6 shadow-md z-50">
      <div className="text-white font-bold text-xl">HMS</div>
      
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white font-semibold hover:underline">
          Home
        </Link>
        <Link to="/appointments" className="text-white font-semibold hover:underline">
          Appointments
        </Link>
        
        <img
          className="h-12 w-12 rounded-full"
          alt="avatar"
          src="https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg"
        />
      </div>
    </div>
  );
};

export default Navbar;
