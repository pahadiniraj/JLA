"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import Link from "next/link";
import { useLoginUserMutation } from "@/Redux/Services/auth";
import { loginSchema } from "@/utils/Validation/YUP/LoginAndRegister";
import { handleError } from "@/Redux/handleError";

interface LoginFormValues {
  email: string;
  password: string;
  acceptTermAndCondition: boolean;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  acceptTermAndCondition: false,
};
const FormikLogin = () => {
  const [showPassword, setShowPassword] = useState(true);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loginUser, { isError, isLoading, error }] = useLoginUserMutation();

  const handleSubmit = async (values: LoginFormValues) => {
    const { ...loginValues } = values;

    try {
      const response = await loginUser(loginValues);
      console.log(response?.data?.message);
      if (response.data && response.data.success === true) {
        toast.success(response?.data?.message);
        router.push("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [isError, error]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form className="flex flex-col mt-8 md:mt-2 w-full">
            <div className="space-y-4 w-full">
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  className="p-3 bg-white border border-gray-600 rounded-md w-full text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder="Email"
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs ml-1"
                />
              </div>
              <div className="relative">
                <Field
                  type={showPassword ? "password" : "text"}
                  name="password"
                  className="p-3 bg-white border border-gray-600 rounded-md w-full text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder="Password"
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs ml-1"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-4 text-xl transition duration-300 ease-linear active:scale-90 text-black"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <div className="flex flex-col text-white">
                <div className="flex gap-2 items-center ml-1">
                  <Field
                    type="checkbox"
                    name="acceptTermAndCondition"
                    className="w-3 h-3 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
                    id="acceptTermAndCondition"
                  />
                  <label htmlFor="acceptTermAndCondition" className="text-base">
                    I accept the{" "}
                    <span
                      onClick={() => router.push("/term-condition")}
                      className="hover:text-blue-500 duration-200 cursor-pointer"
                    >
                      terms and conditions
                    </span>
                  </label>
                </div>
                <ErrorMessage
                  name="acceptTermAndCondition"
                  component="div"
                  className="text-red-500 text-xs ml-6"
                />
              </div>
              <div className=" w-full flex  justify-end items-end">
                <Link
                  href="/reset-password-link"
                  className="text-sm hover:text-purple-500 font-bold transition-colors duration-300"
                >
                  Forget Password?
                </Link>
              </div>
            </div>
            <button
              className={`${
                isValid
                  ? "bg-gradient-to-r from-blue-500 to-green-500 font-bold text-white hover:shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              } rounded-2xl py-2 mt-4 transition-all duration-300`}
              type="submit"
              disabled={!isValid || isLoading}
            >
              {isLoading ? <ClipLoader size={25} color="#fff" /> : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormikLogin;
