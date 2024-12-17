import Image from "next/image";
import React, { useState } from "react";
import LOGO from "../../../public/Logo/LOGO.png";
import { TiThMenu } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdClose } from "react-icons/md";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const toggleNav = () => setShowNav(!showNav);

  const links = [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
    { href: "/create-job", label: "Create Job" },
    { href: "/favorite-job", label: "Favorite Jobs" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={LOGO} alt="Job Finder" className="w-36 h-auto" priority />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`px-4 py-2 rounded-md font-semibold text-gray-700 transition duration-300 ${
                isActive(link.href)
                  ? "text-blue-600 bg-blue-100"
                  : "hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="text-sm font-semibold text-gray-700">
            <p>Contact Us: 01-000000</p>
            <p>example@gmail.com</p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleNav}
          className="md:hidden text-gray-700 hover:text-blue-600"
        >
          <TiThMenu className="text-3xl" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed inset-0  z-50 md:hidden "
          >
            {/* Links */}
            <div className=" bg-blue-700/95 h-screen relative ">
              <div className="pt-14 px-2">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setShowNav(false)}
                    className={`block text-xl font-semibold text-white p-2 rounded-md transition duration-300 ${
                      isActive(link.href)
                        ? "text-blue-600 bg-blue-100"
                        : "hover:bg-blue-100 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Close Button */}
              <div className="flex absolute right-2 top-3 justify-end">
                <button onClick={toggleNav} className="text-3xl text-white">
                  <MdClose />
                </button>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-10 text-center text-gray-700">
              <p className="text-lg font-bold">Contact Us</p>
              <p className="text-sm">01-000000</p>
              <p className="text-sm">example@gmail.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
