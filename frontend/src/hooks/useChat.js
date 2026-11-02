import { useState, useEffect } from "react";
import { askAI } from "../services/api";

function useChat() {
  // লোকাল স্টোরেজ থেকে আগের চ্যাট লোড করা, না থাকলে খালি অ্যারে থাকবে
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem("nova_chat_messages");
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error("Failed to load chat history from localStorage:", error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // মেসেজ আপডেট হলেই সেটি লোকাল স্টোরেজে সেভ করা
  useEffect(() => {
    try {
      localStorage.setItem("nova_chat_messages", JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  const sendMessage = async (prompt) => {
    if (!prompt || !prompt.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: prompt.trim(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const reply = await askAI(updatedMessages);

      const aiMessage = {
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Nova AI Error:", error);

      const errorMessage = typeof error === 'object' && error !== null 
        ? (error.message || "Something went wrong.") 
        : String(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ ${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages();
    try {
      localStorage.removeItem("nova_chat_messages");
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    newChat,
  };
}

export default useChat;