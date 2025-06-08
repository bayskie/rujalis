import { useMutation } from "@tanstack/react-query";
import { generateContentWithGeminiFn } from "@/api/gemini";
import { toast } from "sonner";

export const useGeminiGenerateContentMutation = () => {
  return useMutation({
    mutationFn: (prompt: string) => generateContentWithGeminiFn(prompt),
    onSuccess: (data) => {
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (result) {
        toast.success("Gemini berhasil menghasilkan respon");
        console.log("Respon Gemini:", result);
      } else {
        toast.warning("Gemini tidak mengembalikan teks");
      }
    },
    onError: (error) => {
      console.error("Error Gemini:", error);
      toast.error("Gagal mendapatkan respon dari Gemini");
    },
  });
};
