import { useRef, useState } from "react";
import { Send, Square } from "lucide-react";

function InputBox({ onSend, loading, onStop }) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prompt.trim() || loading) return;

    onSend(prompt.trim());
    setPrompt("");

    // Textarea height reset
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    // Enter = Send
    // Shift + Enter = New Line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!loading && prompt.trim()) {
        handleSubmit(e);
      }
    }
  };

  const handleChange = (e) => {
    setPrompt(e.target.value);

    // Auto resize
    const textarea = e.target;

    textarea.style.height = "auto";

    textarea.style.height =
      Math.min(textarea.scrollHeight, 160) + "px";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2
                 bg-slate-800
                 border border-slate-700
                 rounded-2xl
                 p-2
                 shadow-lg"
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
        rows={1}
        placeholder={
          loading
            ? "Nova AI is thinking..."
            : "Message Nova AI..."
        }
        className="flex-1
                   resize-none
                   bg-transparent
                   text-white
                   placeholder-slate-500
                   outline-none
                   px-3 py-3
                   text-sm md:text-base
                   max-h-40
                   overflow-y-auto"
      />

      {/* Button */}
      {loading ? (
        <button
          type="button"
          onClick={onStop}
          className="flex-shrink-0
                     w-11 h-11
                     flex items-center justify-center
                     rounded-xl
                     bg-red-600
                     hover:bg-red-700
                     text-white
                     transition"
          title="Stop generating"
        >
          <Square size={18} fill="currentColor" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!prompt.trim()}
          className="flex-shrink-0
                     w-11 h-11
                     flex items-center justify-center
                     rounded-xl
                     bg-blue-600
                     hover:bg-blue-700
                     disabled:bg-slate-700
                     disabled:text-slate-500
                     text-white
                     transition"
          title="Send message"
        >
          <Send size={18} />
        </button>
      )}
    </form>
  );
}

export default InputBox;