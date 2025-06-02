import { useState } from "react";

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="py-4">
      <a 
        href="#" 
        className="flex items-center" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.preventDefault();
          console.log("Logo clicked - would navigate to homepage");
        }}
      >
        <div className={`relative flex items-center transition-all duration-300 ${isHovered ? "scale-105" : ""}`}>
          
          <div className="relative flex items-center justify-center h-10 w-10 rounded-lg">
           <img 
             src="/vehicle.png"
             alt="vehicl logo"
             className="h-8 w-8"
           />
          </div>
          
          <div className="ml-3 flex flex-col">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              KPA
            </span>
            <span className="text-xs text-gray-600 font-medium -mt-1">
              Kigali Parking Authority
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}