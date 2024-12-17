"use client";
import Image from "next/image";
import LOGO from "../../../public/Logo/LOGO.png";
import { MdLocationPin } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";

const FavoriteJobs = () => {
  return (
    <>
      <div className=" mt-36 mx-5 ">
        <h1 className="text-2xl m-4 md:m-0 ">
          <span className="border-b-2 pb-1  border-blue-600">Favorite</span>{" "}
          List of jobs
        </h1>
        <div className="flex gap-4">
          <div className="border-2 rounded-md bg-slate-200/90 shadow-lg backdrop-blur-3xl h-[500px] my-5 grid lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-2   p-4 gap-4">
            <div className="border border-slate-600/40  rounded-lg bg-white shadow-lg backdrop-blur-3xl h-[200px] p-2 relative">
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
                <p className="text-sm font-medium text-slate-800/70">
                  NRP 15000
                </p>
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
      </div>
    </>
  );
};

export default FavoriteJobs;
