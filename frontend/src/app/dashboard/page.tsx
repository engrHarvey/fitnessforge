"use client";

import React from "react";
import AuthWrapper from "../../../components/AuthWrapper";
import WeightLineChart from "../../../components/WeightLineChart";
import MuscleDonutChart from "../../../components/MuscleDonutChart";

export default function Dashboard() {
  return (
    <AuthWrapper>
      <div
        className="min-h-screen bg-cover bg-center text-white flex flex-col justify-start"
        style={{ backgroundImage: "url('/dashboard-bg.jpg')" }}
      >
        {/* Background Overlay with Blur Effect Touching the Footer */}
        <div className="bg-black bg-opacity-60 backdrop-blur-sm flex-grow p-6 lg:p-10 flex flex-col items-center justify-start">
          {/* Top Section with Conditional Margin Based on Screen Size */}
          <div className="w-full max-w-screen-xl mx-auto text-center mb-0 lg:mb-4 sm:mb-2"> {/* Small screen margin removed */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-1 lg:mb-2 drop-shadow-md">
              Your Dashboard
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-0 sm:mb-2 lg:mb-4"> {/* Small screen margin removed */}
              Track your fitness activities and view your progress here.
            </p>
          </div>

          {/* Chart Container for Side-by-Side Layout with Increased Heights */}
          <div className="flex flex-col lg:flex-row justify-center items-start w-full lg:gap-6 sm:gap-4 max-w-screen-xl mx-auto mt-0 lg:mt-6"> {/* Small screen top margin removed */}
            {/* Weight Line Chart Container with Longer Height */}
            <div className="w-full lg:w-1/2 h-[50vh] sm:h-[55vh] lg:h-[60vh] mb-4 lg:mb-0"> {/* Margin added between charts */}
              <WeightLineChart />
            </div>

            {/* Muscle Donut Chart Container with Longer Height */}
            <div className="w-full lg:w-1/2 h-[50vh] sm:h-[55vh] lg:h-[60vh]">
              <MuscleDonutChart />
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
