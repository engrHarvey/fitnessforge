"use client";

import React from "react";
import "./globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define pages that should not have a navbar and footer
  const noNavAndFooter = ["/", "/login", "/signup"];
  const showLayout = !noNavAndFooter.includes(pathname);

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Acafac+Flux&display=swap"
          rel="stylesheet"
        />
        <title>FitnessForge</title>
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Show Navbar if applicable */}
        {showLayout && <Navbar />}

        {/* Main Content Area - Use flex-grow to take up remaining space */}
        <main className="flex-grow w-full">
          {children}
        </main>

        {/* Footer should always be at the bottom */}
        {showLayout && <Footer />}
      </body>
    </html>
  );
}
