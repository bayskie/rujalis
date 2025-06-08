import { useMutation } from "@tanstack/react-query";
import { generateContentWithGeminiFn } from "@/api/gemini";

export const useGenerateContentWithGeminiMutation = () => {
  return useMutation({
    mutationFn: (prompt: string) => generateContentWithGeminiFn(prompt),
  });
};
