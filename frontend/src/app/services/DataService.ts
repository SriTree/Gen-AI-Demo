import supabase from "../lib/supabaseClient";

export interface Prompt {
  id: number;
  goal: string;
  target: string;
  category: string;
  original_index: number;
  query: string;
  response: string;
  score: number;
  llm: string;
  sys_prompt: boolean;
  successful_prompt: string;
  attack_hist: string[]; // Ensure attack_hist is an array of strings
  feedback: string;
  success_flag: boolean;
}

class DataService {
  static async fetchPrompts(): Promise<Prompt[]> {
    const { data, error } = await supabase.from("jailbreaks").select("*");
    if (error) {
      console.error("Error fetching data:", error.message);
      throw new Error(error.message);
    }
    return data.map((item) => ({
      ...item,
      attack_hist: Array.isArray(item.attack_hist)
        ? item.attack_hist
        : [item.attack_hist].flat(),
    })) as Prompt[];
  }

  static async fetchMostQueriedPromptByLLM(llm: string): Promise<Prompt> {
    const { data, error } = await supabase
      .from("jailbreaks")
      .select("*")
      .eq("llm", llm);

    if (error) {
      console.error("Error fetching data:", error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("No data found for the given LLM");
    }

    // Sort the data by query in descending order
    const sortedData = data
      .map((item) => ({
        ...item,
        query: parseInt(item.query, 10),
        attack_hist: Array.isArray(item.attack_hist)
          ? item.attack_hist
          : [item.attack_hist].flat(),
      }))
      .sort((a, b) => b.query - a.query);

    // Find the first prompt with a success_flag set to true
    const validPrompt = sortedData.find((item) => item.success_flag === true);

    if (!validPrompt) {
      throw new Error(
        "No valid data found with success_flag set to true for the given LLM"
      );
    }

    return validPrompt as Prompt;
  }

  static async fetchPromptsByLLM(llm: string): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from("jailbreaks")
      .select("*")
      .eq("llm", llm);

    if (error) {
      console.error(`Error fetching data for LLM ${llm}:`, error.message);
      throw new Error(error.message);
    }

    const filteredData = (data as Prompt[])
      .map((item) => {
        let feedback = item.feedback ?? "";
        feedback = feedback.replace(/Rating: \[\[\d+\]\]/g, "").trim();
        return {
          ...item,
          feedback,
          attack_hist: Array.isArray(item.attack_hist)
            ? item.attack_hist
            : [item.attack_hist].flat(),
        };
      })
      .filter((item) => item.feedback !== "");

    return filteredData;
  }
}

export default DataService;
