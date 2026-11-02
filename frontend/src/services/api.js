export async function askAI(messagesHistory, signal) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_OPENROUTER_API_KEY is not defined in environment variables.");
  }

  console.log("Sending Chat History to OpenRouter:", messagesHistory);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Nova AI",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash", // অথবা আপনার পছন্দমতো মডেল দিতে পারেন
      messages: messagesHistory,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Server error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response received from OpenRouter.");
  }

  return data.choices[0].message.content;
}