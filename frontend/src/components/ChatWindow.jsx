function ChatWindow({ children }) {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
      {children}
    </main>
  );
}

export default ChatWindow;