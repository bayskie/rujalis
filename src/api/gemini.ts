import { geminiClient } from "@/lib/gemini-client";
import type { GeminiResponse } from "@/types/gemini";

export const generateContentWithGeminiFn = async (
  prompt: string,
): Promise<GeminiResponse> => {
  const res = await geminiClient.post(
    `/models/gemini-2.0-flash:generateContent`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
  );
  return res.data;
};
