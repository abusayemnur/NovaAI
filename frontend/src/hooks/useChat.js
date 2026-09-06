import { useState } from "react";
import { askAI } from "../services/api";

function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (prompt) => {
    if (!prompt || !prompt.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: prompt.trim(),
    };

    // সাথে সাথে User message দেখাবে
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const reply = await askAI(prompt.trim());

      const aiMessage = {
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Nova AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ ${error.message || "Something went wrong."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    newChat,
  };
}

export default useChat;