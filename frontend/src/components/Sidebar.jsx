import {
  Plus,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";

function Sidebar({
  chats = [],
  onNewChat,
  onSelectChat,
  onDeleteChat,
  activeChat,
  open,
  onClose,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          inset-y-0 left-0
          z-50
          w-72
          flex flex-col
          bg-slate-900
          border-r border-slate-700
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            🤖 Nova AI
          </h2>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              px-4
              py-3
              rounded-xl
              text-white
              font-medium
              transition
            "
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3">
          <h3 className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase">
            Chat History
          </h3>

          {chats.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <MessageSquare
                size={30}
                className="mx-auto mb-2 text-slate-600"
              />

              <p className="text-sm text-slate-500">
                No previous chats
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`
                    group
                    flex
                    items-center
                    rounded-lg
                    transition
                    ${
                      activeChat === chat.id
                        ? "bg-slate-800"
                        : "hover:bg-slate-800"
                    }
                  `}
                >
                  {/* Chat Button */}
                  <button
                    onClick={() => {
                      onSelectChat(chat.id);
                      onClose();
                    }}
                    className="
                      flex-1
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      text-left
                      text-sm
                      text-slate-200
                      min-w-0
                    "
                  >
                    <MessageSquare
                      size={16}
                      className="flex-shrink-0 text-slate-400"
                    />

                    <span className="truncate">
                      {chat.title || "New Chat"}
                    </span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteChat(chat.id)}
                    className="
                      p-2
                      mr-1
                      text-slate-400
                      hover:text-red-400
                      transition
                    "
                    title="Delete chat"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Nova AI
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;