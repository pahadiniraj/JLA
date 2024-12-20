"use client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className=" h-screen text-white bg-blue-200">{children}</div>;
}
