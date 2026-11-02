import {
  X,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";

function SettingsPanel({
  open,
  onClose,
  darkMode,
  onToggleTheme,
  onClearHistory,
}) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60"
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-50
                   h-full w-full sm:w-96
                   bg-slate-900
                   border-l border-slate-700
                   shadow-2xl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between
                     px-5 py-4
                     border-b border-slate-700"
        >
          <h2 className="text-xl font-bold">
            Settings
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg
                       hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings */}
        <div className="p-5 space-y-6">

          {/* Appearance */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">
              APPEARANCE
            </h3>

            <button
              onClick={onToggleTheme}
              className="w-full flex items-center
                         justify-between
                         p-4 rounded-xl
                         bg-slate-800
                         hover:bg-slate-700
                         transition"
            >
              <div className="flex items-center gap-3">

                {darkMode ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )}

                <div className="text-left">
                  <p className="font-medium">
                    Theme
                  </p>

                  <p className="text-sm text-slate-400">
                    {darkMode
                      ? "Dark mode"
                      : "Light mode"}
                  </p>
                </div>

              </div>

              <div
                className={`w-11 h-6 rounded-full
                            p-1 transition
                            ${
                              darkMode
                                ? "bg-blue-600"
                                : "bg-slate-600"
                            }`}
              >
                <div
                  className={`w-4 h-4 bg-white
                              rounded-full transition
                              ${
                                darkMode
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                />
              </div>
            </button>
          </div>

          {/* Data */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">
              DATA
            </h3>

            <button
              onClick={onClearHistory}
              className="w-full flex items-center gap-3
                         p-4 rounded-xl
                         bg-red-950/40
                         hover:bg-red-950/70
                         text-red-400
                         transition"
            >
              <Trash2 size={20} />

              <div className="text-left">
                <p className="font-medium">
                  Clear Chat History
                </p>

                <p className="text-sm text-red-400/70">
                  Delete all saved conversations
                </p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default SettingsPanel;