const API_URL = "http://localhost:8000";

export async function askAI(prompt, signal) {
  const url = `${API_URL}/ask?prompt=${encodeURIComponent(prompt)}`;

  console.log("Request URL:", url);

  const response = await fetch(url, {
    method: "GET",
    signal,
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();

  console.log("Response data:", data);

  if (!data.reply) {
    throw new Error("AI response not found");
  }

  return data.reply;
}