"use client";
import React from "react";
import { TiArrowBack } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import FormikRegister from "./FormikRegister";

const Register: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className=" w-full flex justify-center items-center bg-gray-900 md:bg-transparent h-full ">
        <div className=" inset-0 md:w-2/6  md:bg-gray-900 rounded-2xl   z-10 bg-opacity-30 backdrop-blur-sm  ">
          <div className=" p-4  rounded-xl max-h-[90vh] overflow-y-auto  relative ">
            <div className="flex justify-center flex-col items-center w-full   mb-2">
              <h1 className="text-xl font-bold mb-1">Niraj Portfolio</h1>
              <p className="text-center text-xs ">
                Welcome to Niraj Portfolio Sign up to stay updated with my
                latest projects. Fill in your details and join the creative
                journey!
              </p>
            </div>
            <FormikRegister />

            <button
              className="absolute top-2 left-2 transition duration-300 ease-linear active:scale-90"
              onClick={() => router.push("/login")}
            >
              <TiArrowBack className="text-2xl" />
            </button>
            <button
              className="absolute top-2 right-2 transition duration-300 ease-linear active:scale-90"
              onClick={() => router.push("/")}
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
