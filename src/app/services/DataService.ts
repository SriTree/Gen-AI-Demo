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

  static async fetchRandomSuccessfulPromptByLLM(llm: string): Promise<Prompt> {
    const { data, error } = await supabase
      .from("jailbreaks")
      .select("*")
      .eq("llm", llm)
      .eq("success_flag", true);

    if (error) {
      console.error("Error fetching data:", error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error(
        "No data found with success_flag set to true for the given LLM"
      );
    }

    // Get a random index
    const randomIndex = Math.floor(Math.random() * data.length);

    const randomPrompt = data[randomIndex];

    // Ensure attack_hist is an array
    randomPrompt.attack_hist = Array.isArray(randomPrompt.attack_hist)
      ? randomPrompt.attack_hist
      : [randomPrompt.attack_hist].flat();

    return randomPrompt as Prompt;
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
