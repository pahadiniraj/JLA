import React from "react";
import { FaSearch } from "react-icons/fa";

const HeroSection = () => {
  return (
    <>
      <div className="bg-blue-600 mt-32 h-[200px] flex justify-center items-center flex-col gap-4">
        <h1 className="md:text-3xl text-white text-lg font-bold  text-center">
          FIND YOUR DREAM JOB WITH JOB FINDER
        </h1>

        <div className="flex items-center space-x-2 bg-white rounded-lg pl-4 pr-2 py-2   ">
          <div className="  ">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="outline-none px-2 py-1 md:w-72  rounded-lg "
          />

          <button className="bg-blue-500 text-white p-2 rounded-lg">
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
