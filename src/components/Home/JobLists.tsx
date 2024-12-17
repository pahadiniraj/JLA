"use client";
import Image from "next/image";
import React, { useState } from "react";
import LOGO from "../../../public/Logo/LOGO.png";
import { MdLocationPin } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";

const JobLists = () => {
  const [loveClicked, setLoveClicked] = useState(false);

  const handleLoveClick = () => {
    setLoveClicked(!loveClicked);
  };

  return (
    <>
      <div className="md:m-10 ">
        <h1 className="text-2xl">
          <span className="border-b-2 pb-1  border-blue-600">Jobs</span> In
          Nepal
        </h1>
        <div className="border-2 rounded-md bg-slate-200/90 shadow-lg backdrop-blur-3xl h-[500px] my-5 grid grid-cols-3 p-4 gap-4">
          <div className="border border-slate-600/40  rounded-lg bg-white shadow-lg backdrop-blur-3xl h-[200px] p-2 relative">
            <div className="absolute right-1">
              <button
                className={` border border-slate-400 w-8 h-8 flex justify-center items-center rounded-full mt-2 mx-2  absolute  right-1   ${
                  loveClicked ? "bg-slate-100 text-red-600" : ""
                } `}
              >
                <FaHeart
                  className={`text-xl  cursor-pointer  `}
                  onClick={handleLoveClick}
                />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="border-slate-400/40  w-[100px]  p-1 flex justify-center items-center rounded-lg shadow-lg bg-slate-500/30">
                <Image
                  src={LOGO}
                  alt="JOB FINDER"
                  className="w-[90px] border border-slate-400/20 rounded-lg bg-white "
                  priority
                />
              </div>
              <div>
                <p className="font-semibold">Sales Executive</p>
                <p className="text-sm font-medium text-slate-800/70">
                  Job Finder Pvt. Ltd.
                </p>
              </div>
            </div>
            <div className="flex justify-start mt-2 items-center gap-2 ">
              <GiMoneyStack className="text-slate-600" />
              <p className="text-sm font-medium text-slate-800/70">NRP 15000</p>
            </div>
            <div>
              <p className="text-xs text-slate-800/90">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
                nobis, delectus ducimus tenetur voluptates beatae hic iusto
                sequi voluptatem magni.
              </p>
            </div>
            <div className=" flex justify-end items-center">
              <MdLocationPin className="text-slate-800/90" />
              <p className="text-sm font-medium text-slate-800/70">
                Sankhamaul,Kathmandu
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobLists;
