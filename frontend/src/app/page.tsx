"use client";

import React from "react";
import LLMTable from "@/app/components/LLMTable";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen p-10 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Welcome to the LLM Dashboard
        </h1>
        <LLMTable />
      </div>
    </div>
  );
};

export default LandingPage;
