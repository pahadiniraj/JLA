import Image from "next/image";
import React, { useState } from "react";
import LOGO from "../../../public/Logo/file.png";
import { TiThMenu } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
    console.log("clicked");
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-3xl border border-slate-200 rounded-lg shadow-lg justify-between items-center w-full flex md:mx-5 mx-2 md:my-4 my-2 pr-4">
        <Image src={LOGO} alt="JOB FINDER" className="w-[200px]" priority />
        <button onClick={toggleNav}>
          <TiThMenu className="text-3xl md:hidden" />
        </button>

        <AnimatePresence>
          {showNav && (
            <motion.div
              initial={{ x: "-100%" }} // Start off-screen from the right
              animate={{ x: 0 }} // Slide in to the current position
              exit={{ x: "100%" }} // Exit to the right when removed
              transition={{ type: "spring", stiffness: 250 }}
              className=" fixed m-0  inset-0 bg-blue-600 opacity-95 text-white p-4  md:hidden h-screen text-3xl "
            >
              <button className="text-end w-full" onClick={toggleNav}>
                x
              </button>
              <div>hello</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden md:block">
          <div className="flex justify-center items-center gap-5 ">
            <button className="bg-blue-600 p-2 text-base font-bold text-white rounded-lg">
              Register
            </button>
            <button className="bg-blue-600 p-2 text-base font-bold text-white rounded-lg">
              Login
            </button>
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
