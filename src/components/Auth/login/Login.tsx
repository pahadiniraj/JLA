"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoCaretBack } from "react-icons/io5";
import FormikLogin from "./FormikLogin";
import Image from "next/image";
import LOGO from "../../../../public/Logo/file.png";

const Login: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className=" w-full flex   bg-blue-800 md:bg-transparent h-full ">
        <div className=" mt-10 inset-0 md:w-2/6  md:bg-blue-800 rounded-2xl   z-10 bg-opacity-30 backdrop-blur-sm   ">
          <div className="p-4 rounded-xl md:max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-center w-full  ">
              <div className="flex justify-center flex-col items-center w-full mb-4 gap-1  ">
                <div className="flex justify-center items-center mr-4">
                  <Image
                    src={LOGO}
                    alt="JOB FINDER"
                    className="w-[200px]"
                    priority
                  />
                </div>
                <p className="text-center text-base ">
                  Welcome to Job Finder! Login to stay updated with the latest
                  job opportunities and retrieve your saved data. Fill in your
                  details and take the next step in your career journey!
                </p>
              </div>
            </div>
            <div className="w-full">{<FormikLogin />}</div>

            <div className="text-center mt-4 flex justify-center gap-1  text-xs">
              <p className="font-light text-base">Not yet Registered ? </p>
              <button
                className="hover:text-purple-500 font-bold transition-colors duration-300 text-base"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </div>

            <button
              className=" transition duration-300 ease-linear active:scale-90 flex justify-center items-center absolute top-4 left-2"
              onClick={() => router.push("/")}
            >
              <IoCaretBack className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
