import InputBox from "./InputBox";

function ChatInput({ onSend, loading, onStop }) {
  return (
    <div className="border-t border-slate-700 bg-slate-900 p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        <InputBox
          onSend={onSend}
          loading={loading}
          onStop={onStop}
        />

        <p className="text-center text-xs text-slate-500 mt-2">
          Nova AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}

export default ChatInput;