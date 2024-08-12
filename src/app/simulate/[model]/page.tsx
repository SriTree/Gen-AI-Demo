"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DataService, { Prompt } from "@/app/services/DataService";

const ChatSimulationPage: React.FC = () => {
  const { model } = useParams();
  const [data, setData] = useState<Prompt | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (model) {
      const fetchData = async () => {
        try {
          const result = await DataService.fetchRandomSuccessfulPromptByLLM(
            model as string
          );
          setData(result);
          if (Array.isArray(result.attack_hist)) {
            const attackHist = result.attack_hist.includes(result.response)
              ? result.attack_hist
              : [...result.attack_hist, result.response];
            setMessages(attackHist);
          } else {
            throw new Error("attack_hist is not an array");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
          console.error("Error fetching data:", err);
        }
      };

      fetchData();
    }
  }, [model]);

  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      const timeout = setTimeout(() => {
        setCurrentMessageIndex((prev) => prev + 1);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [currentMessageIndex, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessageIndex]);

  const processCategory = (category: string) => {
    return category.replace(/,/g, "/");
  };

  const renderMessage = (
    message: string,
    type: "prompt" | "response" | "feedback",
    isLastMessage: boolean
  ) => {
    if (!message) {
      return null;
    }

    const baseClasses = "p-3 rounded-lg max-w-xl mb-4";
    let bgColor = "";

    if (isLastMessage && message === data?.response) {
      bgColor = "bg-red-500 self-end ml-auto mr-8";
      const words = message.split(" ");
      message =
        words.length > 60 ? `${words.slice(0, 60).join(" ")}...` : message;
    } else if (type === "prompt") {
      bgColor = "bg-blue-500 self-start mr-auto ml-8";
    } else if (type === "response") {
      bgColor = "bg-green-500 self-end ml-auto mr-8";
    } else {
      bgColor = "bg-gray-500 self-start mr-auto ml-8";
    }

    return (
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className={`${baseClasses} ${bgColor}`}
      >
        {message}
      </motion.div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-5 text-white">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 p-5 text-white">
      <div className="absolute top-4 left-4">
        {data && (
          <>
            <div>
              <h2 className="text-xl font-bold">LLM: {model}</h2>
              <h3 className="text-lg">Goal: {data.goal}</h3>
              <h3 className="text-lg">
                Category: {processCategory(data.category)}
              </h3>
            </div>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg max-w-xs">
              <h3 className="text-lg font-bold">Legend</h3>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>
                  <span>Prompt</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>
                  <span>Response</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-gray-500 mr-2"></span>
                  <span>
                    Feedback
                    <div>(not seen by the model)</div>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>
                  <span>Jailbroken Response</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="w-full max-w-4xl p-5 mt-24 ml-64">
        <div className="flex flex-col space-y-4">
          <AnimatePresence>
            {messages.slice(0, currentMessageIndex).map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const type =
                index % 3 === 0
                  ? "prompt"
                  : index % 3 === 1
                  ? "response"
                  : "feedback";
              return renderMessage(message, type, isLastMessage);
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatSimulationPage;
