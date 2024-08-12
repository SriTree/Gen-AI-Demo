"use client";

import React from "react";
import LLMTable from "@/app/components/LLMTable";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen p-10 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          LLM Dashboard
        </h1>

        <div className="mt-16">
          <div className="flex justify-between text-lg">
            {/* Left column */}
            <div className="w-1/2 pr-4">
              <h3 className="font-bold">What is Risk Score?</h3>
              <p>
                The risk score is an average of risk in four categories:
                jailbreak susceptibility, bias potential, malware presence, and
                toxicity assessment. Lower the score, lower the risk.
              </p>
            </div>

            {/* Right column */}
            <div className="w-1/2 pl-4">
              <h3 className="font-bold">
                How to read Jailbreak, Bias, Malware and Toxicity Scores?
              </h3>
              <p>
                A Jailbreak score of 18% indicates that 18% of the jailbreak
                tests successfully breached the LLM.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          {/* Table */}
          <LLMTable />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
