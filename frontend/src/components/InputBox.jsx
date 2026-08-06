import { useState } from "react";

function InputBox({ onSend, loading }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    onSend(prompt);
    setPrompt("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        padding: "15px",
      }}
    >
      <input
        type="text"
        placeholder="Ask Nova AI..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #555",
          background: "#1f1f1f",
          color: "#fff",
          outline: "none",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px 20px",
          border: "none",
          borderRadius: "10px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "..." : "Send"}
      </button>
    </form>
  );
}

export default InputBox;