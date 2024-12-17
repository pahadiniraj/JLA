import Image from "next/image";
import React, { useState } from "react";
import LOGO from "../../../public/Logo/LOGO.png";
import { TiThMenu } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const toggleNav = () => {
    setShowNav(!showNav);
    console.log("clicked");
  };

  const link = [
    {
      href: "/login",
      label: "Login",
    },
    {
      href: "/register",
      label: "Register",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-3xl border border-slate-200 rounded-lg shadow-lg justify-between items-center w-full flex md:mx-5  md:my-4  pr-4">
        <Image src={LOGO} alt="JOB FINDER" className="w-[200px]" priority />
        <button onClick={toggleNav}>
          <TiThMenu className="text-3xl md:hidden" />
        </button>

        <AnimatePresence>
          {showNav && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 250 }}
              className="fixed inset-0 bg-blue-600 opacity-98 text-white p-4 md:hidden h-screen text-3xl"
            >
              <button className="text-end w-full mb-2" onClick={toggleNav}>
                x
              </button>
              <div className="block md:hidden flex-col ">
                <div className="flex flex-col justify-start items-start gap-5 ">
                  {link.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => {
                        if (close) close();
                      }}
                      className={`flex justify-start p-2 rounded-md font-semibold duration-300   w-full ${
                        isActive(item.href)
                          ? "bg-slate-200 text-blue-700 "
                          : "hover:bg-slate-200 hover:text-blue-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <ul className="text-base flex flex-col bg-slate-200 text-blue-700  gap-2 font-bold w-full p-2 rounded-lg">
                    <div className="flex justify-center items-center mr-4">
                      <Image
                        src={LOGO}
                        alt="JOB FINDER"
                        className="w-[200px]"
                        priority
                      />
                    </div>

                    <li>
                      <p className="text-xl">Contact US</p>
                    </li>
                    <li>
                      <p>01-000000</p>
                    </li>
                    <li>
                      <p>example@gmail.com</p>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden md:block">
          <div className="flex justify-center items-center gap-5 ">
            <div className="flex  justify-center items-center gap-2  border-r-2 border-black pr-4">
              {link.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => {
                    if (close) close();
                  }}
                  className={`flex justify-start p-2 rounded-md font-semibold duration-300 text-white w-full text-center ${
                    isActive(item.href)
                      ? "bg-blue-700 "
                      : "bg-blue-600 hover:bg-blue-700 text-center"
                  }`}
                >
                  <p className="text-center flex justify-center items-center ">
                    {" "}
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>
            <ul className="text-base font-bold">
              <li>
                <p>Contact US</p>
              </li>
              <li>
                <p>01-000000</p>
              </li>
              <li>
                <p>example@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
