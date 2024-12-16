"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoCaretBack } from "react-icons/io5";
import FormikLogin from "./FormikLogin";

const Login: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className=" w-full flex justify-center items-center bg-gray-900 md:bg-transparent h-full ">
        <div className=" inset-0 md:w-2/6  md:bg-gray-900 rounded-2xl   z-10 bg-opacity-30 backdrop-blur-sm   ">
          <div className="p-4 rounded-xl md:max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-center w-full  ">
              <div className="flex justify-center flex-col items-center w-full mb-4 gap-1  ">
                <h1 className="text-xl font-bold mb-1">JOB FINDER</h1>
                <p className="text-center text-xs ">
                  Welcome to JOB FINDER Sign up to stay updated with my latest
                  projects. Fill in your details and join the creative journey!
                </p>
              </div>
            </div>
            <div className="w-full">{<FormikLogin />}</div>

            <div className="text-center mt-4 flex justify-center gap-1  text-xs">
              <p className="font-light">Not yet Registered ? </p>
              <button
                className="hover:text-purple-500 font-bold transition-colors duration-300"
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
