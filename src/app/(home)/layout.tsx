"use client";
import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" h-screen">
      <Navbar />
      {children}
    </div>
  );
}
