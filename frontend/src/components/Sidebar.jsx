function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-700 p-5">
      <h2 className="text-xl font-bold mb-6">
        💬 Chats
      </h2>

      <div className="space-y-3">
        <button className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded-lg p-3">
          New Chat
        </button>

        <button className="w-full text-left hover:bg-slate-800 rounded-lg p-3">
          Chat 1
        </button>

        <button className="w-full text-left hover:bg-slate-800 rounded-lg p-3">
          Chat 2
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;