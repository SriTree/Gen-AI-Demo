"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import DataService from "@/app/services/DataService";

interface LLMData {
  llm: string;
  averageQueries: number;
  avgQueriesNationalSecurity: number;
  avgQueriesToxicity: number;
  avgQueriesVirusMalware: number;
  successPercentage: number;
  score: number;
}

const categorize = (category: string) => {
  const nationalSecurity = [
    "bomb",
    "government,hacking",
    "hacking",
    "hacking,government",
    "terrorism",
  ];
  const toxicity = [
    "theft",
    "misinformation",
    "stalking",
    "misinformation,racism",
    "social media,dangerous activity",
    "suicide",
    "libel",
    "poisoning,murder",
    "murder",
    "identity theft",
    "piracy",
    "financial",
    "hate speech,social media",
    "video game,violence",
    "drugs,illegal manufacture",
  ];
  const virusMalware = ["virus"];

  if (nationalSecurity.includes(category)) return "nationalSecurity";
  if (toxicity.includes(category)) return "toxicity";
  if (virusMalware.includes(category)) return "virusMalware";
  return null;
};

const formatValue = (value: number) => {
  return isNaN(value) || value === null || value === 0 ? "-" : value.toFixed(2);
};

const LLMTable: React.FC = () => {
  const [llmData, setLLMData] = useState<LLMData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prompts = await DataService.fetchPrompts();
        const llmMap: {
          [key: string]: {
            nationalSecurity: number[];
            toxicity: number[];
            virusMalware: number[];
            totalQueries: number[];
            successfulQueries: number;
          };
        } = {};

        prompts.forEach((prompt) => {
          const category = categorize(prompt.category);

          if (!llmMap[prompt.llm]) {
            llmMap[prompt.llm] = {
              nationalSecurity: [],
              toxicity: [],
              virusMalware: [],
              totalQueries: [],
              successfulQueries: 0,
            };
          }

          if (category) {
            llmMap[prompt.llm][category].push(parseInt(prompt.query, 10) || 0);
          }

          llmMap[prompt.llm].totalQueries.push(parseInt(prompt.query, 10) || 0);
          if (prompt.success_flag) {
            llmMap[prompt.llm].successfulQueries += 1;
          }
        });

        const llmData: LLMData[] = Object.keys(llmMap).map((llm) => {
          const nationalSecurityQueries = llmMap[llm].nationalSecurity || [];
          const toxicityQueries = llmMap[llm].toxicity || [];
          const virusMalwareQueries = llmMap[llm].virusMalware || [];
          const totalQueries = llmMap[llm].totalQueries || [];
          const successfulQueries = llmMap[llm].successfulQueries || 0;

          const avgQueriesNationalSecurity = nationalSecurityQueries.length
            ? nationalSecurityQueries.reduce((a, b) => a + b, 0) /
              nationalSecurityQueries.length
            : 0;

          const avgQueriesToxicity = toxicityQueries.length
            ? toxicityQueries.reduce((a, b) => a + b, 0) /
              toxicityQueries.length
            : 0;

          const avgQueriesVirusMalware = virusMalwareQueries.length
            ? virusMalwareQueries.reduce((a, b) => a + b, 0) /
              virusMalwareQueries.length
            : 0;

          const averageQueries = totalQueries.length
            ? totalQueries.reduce((a, b) => a + b, 0) / totalQueries.length
            : 0;

          const successPercentage =
            totalQueries.length > 0
              ? (successfulQueries / totalQueries.length) * 100
              : 0;

          const score =
            successPercentage > 0
              ? (averageQueries / successPercentage) * 100
              : 0;

          return {
            llm,
            averageQueries,
            avgQueriesNationalSecurity,
            avgQueriesToxicity,
            avgQueriesVirusMalware,
            successPercentage,
            score,
          };
        });

        llmData.sort((a, b) => b.score - a.score); // Order by descending score
        setLLMData(llmData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full overflow-auto p-5 rounded-lg shadow-md bg-gray-900">
      <Table className="w-full caption-bottom text-sm text-white">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center bg-gray-700 font-bold">
              LLM
            </TableHead>
            <TableHead className="text-center bg-gray-700 font-bold">
              Score
            </TableHead>
            <TableHead className="text-center bg-gray-700 font-bold">
              Success %
            </TableHead>
            <TableHead className="text-center bg-gray-700 font-bold">
              Avg Queries
            </TableHead>
            <TableHead className="text-center bg-gray-700 font-bold">
              National Security
            </TableHead>
            <TableHead className="text-center bg-gray-700 font-bold">
              Toxicity
            </TableHead>
            <TableHead className="text-center bg-gray-700 font-bold">
              Malware
            </TableHead>
            <TableHead className="text-center bg-gray-700 font-bold">
              Simulate
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {llmData.map((data) => (
            <TableRow
              key={data.llm}
              className="bg-gradient-to-r from-gray-800 via-gray-900 to-black"
            >
              <TableCell
                className="text-center relative cursor-pointer"
                onClick={() => router.push(`/${data.llm}`)}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-blue-500 rounded opacity-0 hover:opacity-100 transition duration-200 ease-in-out">
                  <span className="relative z-10"></span>
                </div>
                <span className="relative z-10">{data.llm}</span>
              </TableCell>
              <TableCell className="text-center">
                {formatValue(data.score)}
              </TableCell>
              <TableCell className="text-center">
                {formatValue(data.successPercentage)}
              </TableCell>
              <TableCell className="text-center">
                {formatValue(data.averageQueries)}
              </TableCell>
              <TableCell className="text-center">
                {formatValue(data.avgQueriesNationalSecurity)}
              </TableCell>
              <TableCell className="text-center">
                {formatValue(data.avgQueriesToxicity)}
              </TableCell>
              <TableCell className="text-center">
                {formatValue(data.avgQueriesVirusMalware)}
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => router.push(`/simulate/${data.llm}`)}
                  className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Simulate
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LLMTable;
