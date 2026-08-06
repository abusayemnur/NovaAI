const API_URL = "http://127.0.0.1:8000";

export async function askAI(prompt) {
  const res = await fetch(
    `${API_URL}/ask?prompt=${encodeURIComponent(prompt)}`
  );

  const data = await res.json();

  return data.reply || "No response.";
}