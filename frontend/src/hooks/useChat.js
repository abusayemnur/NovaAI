import { useState } from "react";
import { askAI } from "../services/api";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: prompt,
      },
    ]);

    setLoading(true);

    try {
      const reply = await askAI(prompt);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Failed to connect to AI.",
        },
      ]);
    }

    setLoading(false);
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}