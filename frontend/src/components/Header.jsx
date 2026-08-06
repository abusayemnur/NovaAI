import { Menu, Plus, Settings } from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6 cursor-pointer" />
        <h1 className="text-2xl font-bold text-white">
          🤖 Nova AI
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition">
          <Plus size={18} />
          New Chat
        </button>

        <Settings className="w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition" />
      </div>
    </header>
  );
}

export default Header;