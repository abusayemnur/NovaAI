export async function askAI(messagesHistory, signal) {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not defined in environment variables.");
  }

  console.log("Sending Chat History to Backend:", messagesHistory);

  const response = await fetch(`${apiUrl}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messagesHistory,
    }),
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data.answer;
}
