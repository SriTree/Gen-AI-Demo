"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DataService from "@/app/services/DataService"; // Assuming this service fetches LLM data
import { ShieldHalf } from "lucide-react"; // Import the ShieldHalf icon

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLLMMenuOpen, setIsLLMMenuOpen] = useState(false);
  const [isSimulateMenuOpen, setIsSimulateMenuOpen] = useState(false);
  const [llms, setLLMs] = useState<string[]>([]);

  // Fetch the LLMs on component mount
  useEffect(() => {
    const fetchLLMs = async () => {
      try {
        const prompts = await DataService.fetchPrompts(); // Assuming this fetches prompts with LLM info
        const uniqueLLMs = Array.from(
          new Set(prompts.map((prompt) => prompt.llm))
        );
        setLLMs(uniqueLLMs);
      } catch (error) {
        console.error("Error fetching LLMs:", error);
      }
    };

    fetchLLMs();
  }, []);

  const handleLLMClick = (llm: string) => {
    router.push(`/${llm}`);
    setIsLLMMenuOpen(false); // Close the dropdown after selection
  };

  const handleSimulateClick = (llm: string) => {
    router.push(`/simulate/${llm}`);
    setIsSimulateMenuOpen(false); // Close the dropdown after selection
  };

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
      setIsLLMMenuOpen(false);
      setIsSimulateMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <nav className="bg-gray-800 p-4 w-full fixed top-0 left-0 z-50">
      <div className="max-w-full mx-auto flex justify-between items-center">
        {/* Left-aligned Logo with Icon */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center text-white font-bold text-lg cursor-pointer ml-4"
        >
          SecuLLM
          <ShieldHalf className="w-6 h-6 mr-2" /> {/* Icon with margin */}
        </div>

        {/* Right-aligned Buttons */}
        <div className="flex space-x-4 mr-4">
          {/* LLM Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSimulateMenuOpen(false); // Close Simulate menu if open
                setIsLLMMenuOpen(!isLLMMenuOpen);
              }}
              className="text-white hover:bg-blue-700 px-4 py-2 rounded"
            >
              Report
            </button>
            {isLLMMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <ul className="py-1 text-gray-300">
                  {llms.map((llm) => (
                    <li
                      key={llm}
                      onClick={() => handleLLMClick(llm)}
                      className="block px-4 py-2 hover:bg-gray-600 cursor-pointer"
                    >
                      {llm}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Simulate Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLLMMenuOpen(false); // Close LLM menu if open
                setIsSimulateMenuOpen(!isSimulateMenuOpen);
              }}
              className="text-white hover:bg-blue-700 px-4 py-2 rounded"
            >
              Simulate
            </button>
            {isSimulateMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <ul className="py-1 text-gray-300">
                  {llms.map((llm) => (
                    <li
                      key={llm}
                      onClick={() => handleSimulateClick(llm)}
                      className="block px-4 py-2 hover:bg-gray-600 cursor-pointer"
                    >
                      {llm}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
