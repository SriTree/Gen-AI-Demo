"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import LLMTable from "@/app/components/LLMTable";
import { useInView } from "react-intersection-observer";

const LandingPage: React.FC = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.1, // How much of the element should be in view before triggering
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    }
  }, [controls, inView]);

  const scrollToTable = () => {
    document
      .getElementById("tableSection")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center min-h-screen p-10 bg-gray-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8">
            Welcome to the LLM Dashboard
          </h1>
          <p className="text-lg mb-8">
            Explore how different LLMs perform under various jailbreak
            scenarios. Learn about their safety scores, success rates, and more.
            Scroll down to dive into the details and analyze the data.
          </p>
          <button
            onClick={scrollToTable}
            className="text-white bg-blue-500 hover:bg-blue-700 px-6 py-3 rounded-full"
          >
            Scroll Down to Explore
          </button>
        </div>
      </div>

      {/* Informative Section */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between text-lg">
            {/* Left column */}
            <div className="w-1/2 pr-4">
              <h3 className="font-bold">What is safety score?</h3>
              <p>
                The safety score is obtained by testing the jailbreak
                susceptibility by an automatic red teaming bot and the ease by
                which it was able to jailbreak. Click on any specific LLM in the
                table below to see a more comprehensive report. Try simulating
                to see how the bot is jailbreaking these LLMs!
              </p>
            </div>

            {/* Right column */}
            <div className="w-1/2 pl-4">
              <h3 className="font-bold">
                How to read success% and average queries?
              </h3>
              <p>
                A success score of 50% means that our bot couldn't find a
                jailbreak prompt under 40 queries for half of the attempts
                across all categories. Avg Queries shows the average queries
                made to the target LLM to find a jailbreak. The other columns
                show average queries for jailbreaks in specific harm categories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        ref={ref}
        id="tableSection"
        initial={{ y: 50, opacity: 0 }}
        animate={controls}
        className="py-16 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Table */}
          <LLMTable />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
