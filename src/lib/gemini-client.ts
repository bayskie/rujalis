import axios from "axios";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const geminiClient = axios.create({
  baseURL: GEMINI_API_BASE_URL,
  params: {
    key: GEMINI_API_KEY,
  },
  headers: {
    "Content-Type": "application/json",
  },
});
