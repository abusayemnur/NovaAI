import InputBox from "./InputBox";

function ChatInput({ onSend, loading }) {
  return (
    <div className="border-t border-slate-700 bg-slate-900 p-4">
      <InputBox onSend={onSend} loading={loading} />
    </div>
  );
}

export default ChatInput;