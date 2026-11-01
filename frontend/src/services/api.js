const API_URL = "http://localhost:8000";

export async function askAI(messagesHistory, signal) {
  const url = `${API_URL}/ask`;

  console.log("Sending Chat History to Backend:", messagesHistory);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messagesHistory,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success || !data.answer) {
    let errorMsg = "AI response not found";
    
    if (data.error) {
      if (typeof data.error === "string") {
        errorMsg = data.error;
      } else if (typeof data.error === "object") {
        errorMsg = data.error.message || JSON.stringify(data.error);
      }
    }

    throw new Error(errorMsg);
  }

  return data.answer;
}