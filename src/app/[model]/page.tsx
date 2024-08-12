"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DataService, { Prompt } from "@/app/services/DataService";
import Table from "@/app/components/Table";

const ModelPage = () => {
  const { model } = useParams();
  const [data, setData] = useState<Prompt[]>([]);

  useEffect(() => {
    if (model) {
      console.log("Fetching data for model:", model);
      const fetchData = async () => {
        try {
          const prompts = await DataService.fetchPromptsByLLM(model as string);
          console.log("Fetched prompts:", prompts);
          setData(prompts);
        } catch (err) {
          console.error("Error fetching prompts:", err);
        }
      };

      fetchData();
    } else {
      console.log("Model parameter is undefined");
    }
  }, [model]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 w-[100%] text-left mr-24 mt-20">
            Prompts for LLM: {model}
          </h1>
          <div className="w-[110%]">
            <Table data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPage;
