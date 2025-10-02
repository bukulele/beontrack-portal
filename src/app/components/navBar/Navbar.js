import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-[#f8f8f8] shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4 lg:justify-between flex-wrap">
          <div className="flex-shrink-0 mb-4 lg:mb-0">
            <a
              href="https://4tracks.ca/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/logo.png" alt="Logo" width={280} height={65} />
            </a>
          </div>
          <div className="text-center">
            <h1 className="lg:text-xl font-semibold text-gray-600">
              Truck Driver Employment Application Form
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
